
from flask import Blueprint, request, jsonify
from db import get_connection

from datetime import datetime

import requests
import json

from psycopg2.extras import RealDictCursor

# 🔥 KAFKA
from kafka import KafkaProducer

orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)

INVENTORY_URL = (
    "http://inventory-service:5002/api/inventory"
)

# =========================================
# KAFKA PRODUCER
# =========================================
producer = None


def get_producer():

    global producer

    if producer is None:

        producer = KafkaProducer(
            bootstrap_servers="kafka:9092",

            value_serializer=lambda v:
            json.dumps(v).encode("utf-8"),

            retries=5
        )

    return producer


# =========================================
# SEND NOTIFICATION
# =========================================
def send_notification(order_id):

    message = {
        "orderNumber": str(order_id),
        "message": "Order Placed Successfully"
    }

    try:

        get_producer().send(
            "notificationTopic",
            message
        )

        get_producer().flush()

        print(f"✅ Kafka sent: {message}")

    except Exception as e:

        print(f"❌ Kafka error: {e}")


# =========================================
# CREATE ORDER
# =========================================
@orders_bp.route("/create", methods=["POST"])
def create_order():

    conn = None

    try:

        data = request.get_json()

        user_id = data.get("user_id")

        items = data.get("cart_items")

        if not user_id or not items:

            return jsonify({
                "error": "Thiếu dữ liệu"
            }), 400

        # =========================================
        # TOTAL PRICE
        # =========================================
        total_amount = sum(
            item["price"] * item["quantity"]
            for item in items
        )

        # =========================================
        # INVENTORY CHECK
        # =========================================
        sku_list = [
            str(item["product_id"])
            for item in items
        ]

        response = requests.get(
            INVENTORY_URL,
            params=[
                ("skuCode", sku)
                for sku in sku_list
            ]
        )

        inventory_data = response.json()

        for item in items:

            sku = str(item["product_id"])

            check = next(
                (
                    x for x in inventory_data
                    if x["skuCode"] == sku
                ),
                None
            )

            if (
                not check
                or not check["isInStock"]
            ):

                return jsonify({
                    "error":
                    f"Sản phẩm {sku} hết hàng"
                }), 400

        # =========================================
        # INSERT ORDER
        # =========================================
        conn = get_connection()

        cur = conn.cursor()

        cur.execute("""
            INSERT INTO orders (
                user_id,
                order_date,
                total_amount,
                status
            )

            VALUES (%s, %s, %s, %s)

            RETURNING order_id
        """, (
            user_id,
            datetime.now(),
            total_amount,
            "Chờ xác nhận"
        ))

        order_id = cur.fetchone()[0]

        # =========================================
        # INSERT ORDER DETAIL
        # =========================================
        for item in items:

            cur.execute("""
                INSERT INTO orderdetail (
                    order_id,
                    product_id,
                    quantity,
                    price
                )

                VALUES (%s, %s, %s, %s)
            """, (
                order_id,
                item["product_id"],
                item["quantity"],
                item["price"]
            ))

        conn.commit()

        cur.close()

        # =========================================
        # SEND KAFKA
        # =========================================
        try:

            send_notification(order_id)

        except Exception as e:

            print("⚠️ Kafka error:", e)

        return jsonify({
            "message":
            "Order placed successfully",

            "order_id": order_id
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print("❌ CREATE ORDER ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if conn:
            conn.close()


# =========================================
# GET ALL ORDERS
# =========================================
@orders_bp.route("", methods=["GET"])
def get_orders():

    try:

        conn = get_connection()

        cur = conn.cursor()

        cur.execute("""
            SELECT
                order_id,
                user_id,
                order_date,
                total_amount,
                status

            FROM orders

            ORDER BY order_id DESC
        """)

        rows = cur.fetchall()

        result = []

        for row in rows:

            result.append({
                "order_id": row[0],
                "user_id": row[1],
                "order_date": row[2],
                "total_amount": float(row[3]),
                "status": row[4],
            })

        cur.close()
        conn.close()

        return jsonify(result)

    except Exception as e:

        print("❌ GET ORDERS ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# GET ORDERS BY USER
# =========================================
@orders_bp.route(
    "/user/<int:user_id>",
    methods=["GET"]
)
def get_orders_by_user(user_id):

    try:

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        cur.execute("""
            SELECT
                order_id,
                order_date,
                total_amount,
                status

            FROM orders

            WHERE user_id = %s

            ORDER BY order_date DESC
        """, (user_id,))

        orders = cur.fetchall()

        # =========================================
        # GET ITEMS
        # =========================================
        for order in orders:

            cur.execute("""
                SELECT

                    p.name AS product_name,

                    od.quantity,

                    od.price,

                    (
                        SELECT i.path
                        FROM image i
                        WHERE i.product_id = p.product_id
                        ORDER BY i.image_id ASC
                        LIMIT 1
                    ) AS image_url

                FROM orderdetail od

                JOIN product p
                    ON od.product_id = p.product_id

                WHERE od.order_id = %s
            """, (order["order_id"],))

            order["items"] = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(orders)

    except Exception as e:

        print(
            "❌ GET USER ORDERS ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# CANCEL ORDER
# =========================================
@orders_bp.route(
    "/cancel/<int:order_id>",
    methods=["PUT"]
)
def cancel_order(order_id):

    try:

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        cur.execute("""
            SELECT status
            FROM orders
            WHERE order_id = %s
        """, (order_id,))

        order = cur.fetchone()

        if not order:

            return jsonify({
                "error":
                "Không tìm thấy đơn hàng"
            }), 404

        if order["status"] not in [
            "Chờ xác nhận"
        ]:

            return jsonify({
                "error":
                f"Không thể hủy đơn đang ở trạng thái '{order['status']}'"
            }), 400

        cur.execute("""
            UPDATE orders

            SET status = 'Đã hủy'

            WHERE order_id = %s

            RETURNING order_id, status
        """, (order_id,))

        result = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "message":
            "Hủy đơn thành công",

            "order": result
        }), 200

    except Exception as e:

        print(
            "❌ CANCEL ORDER ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


# =========================================
# GET ORDER DETAIL
# =========================================
@orders_bp.route(
    "/<int:order_id>",
    methods=["GET"]
)
def get_order_detail(order_id):

    try:

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        # =========================================
        # ORDER INFO
        # =========================================
        cur.execute("""
            SELECT
                order_id,
                user_id,
                order_date,
                total_amount,
                status

            FROM orders

            WHERE order_id = %s
        """, (order_id,))

        order = cur.fetchone()

        if not order:

            cur.close()
            conn.close()

            return jsonify({
                "error":
                "Không tìm thấy đơn hàng"
            }), 404

        # =========================================
        # ORDER ITEMS
        # =========================================
        cur.execute("""
            SELECT

                p.name AS product_name,

                od.quantity,

                od.price,

                (
                    SELECT i.path
                    FROM image i
                    WHERE i.product_id = p.product_id
                    ORDER BY i.image_id ASC
                    LIMIT 1
                ) AS image_url

            FROM orderdetail od

            JOIN product p
                ON od.product_id = p.product_id

            WHERE od.order_id = %s
        """, (order_id,))

        items = cur.fetchall()

        # =========================================
        # PAYMENT MOCK
        # =========================================
        payment = {
            "method": "COD",
            "status": "Đã thanh toán"
        }

        # =========================================
        # RESULT
        # =========================================
        result = {
            "order_id":
            order["order_id"],

            "user_id":
            order["user_id"],

            "order_date":
            order["order_date"],

            "total_amount":
            float(order["total_amount"]),

            "status":
            order["status"],

            "payment":
            payment,

            "items":
            items
        }

        cur.close()
        conn.close()

        return jsonify(result), 200

    except Exception as e:

        print(
            "❌ GET ORDER DETAIL ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# UPDATE ORDER STATUS
# =========================================
@orders_bp.route(
    "/update-status/<int:order_id>",
    methods=["PUT"]
)
def update_order_status(order_id):

    conn = None

    try:

        data = request.get_json()

        new_status = data.get(
            "order_status"
        )

        # VALIDATE
        allowed_status = [
            "Chờ xác nhận",
            "Đã xác nhận",
            "Đang vận chuyển",
            "Đã giao hàng",
            "Đã hủy"
        ]

        if new_status not in allowed_status:

            return jsonify({
                "error":
                "Trạng thái không hợp lệ"
            }), 400

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        # CHECK ORDER
        cur.execute("""
            SELECT order_id, status
            FROM orders
            WHERE order_id = %s
        """, (order_id,))

        order = cur.fetchone()

        if not order:

            cur.close()
            conn.close()

            return jsonify({
                "error":
                "Không tìm thấy đơn hàng"
            }), 404

        # UPDATE
        cur.execute("""
            UPDATE orders

            SET status = %s

            WHERE order_id = %s

            RETURNING
                order_id,
                status
        """, (
            new_status,
            order_id
        ))

        updated = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "message":
            "Cập nhật trạng thái thành công",

            "order":
            updated
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "❌ UPDATE STATUS ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if conn:
            conn.close()
