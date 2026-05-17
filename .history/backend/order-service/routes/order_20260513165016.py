from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime
import requests
from psycopg2.extras import RealDictCursor

# 🔥 NEW: Kafka
from kafka import KafkaProducer
import json

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

INVENTORY_URL = "http://inventory-service:5002/api/inventory"

# ============================
# 🔥 KAFKA PRODUCER (NEW)
# ============================
producer = None

def get_producer():
    global producer
    if producer is None:
        producer = KafkaProducer(
            bootstrap_servers="kafka:9092",
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            retries=5
        )
    return producer

def send_notification(order_id):
    message = {
        "orderNumber": str(order_id),
        "message": "Order Placed Successfully"
    }
    try:
        get_producer().send("notificationTopic", message)
        get_producer().flush()
        print(f"✅ Kafka sent: {message}")
    except Exception as e:
        print(f"❌ Kafka error: {e}")


# ============================
# CREATE ORDER
# ============================
@orders_bp.route("/create", methods=["POST"])
def create_order():
    conn = None

    try:
        data = request.get_json()
        user_id = data.get("user_id")
        items = data.get("cart_items")

        if not user_id or not items:
            return jsonify({"error": "Thiếu dữ liệu"}), 400

        # 👉 tổng tiền
        total_amount = sum(item["price"] * item["quantity"] for item in items)

        # 🔥 gọi inventory 1 lần
        sku_list = [str(item["product_id"]) for item in items]

        response = requests.get(
            INVENTORY_URL,
            params=[("skuCode", sku) for sku in sku_list]
        )

        inventory_data = response.json()

        # 🔥 check stock
        for item in items:
            sku = str(item["product_id"])

            check = next((x for x in inventory_data if x["skuCode"] == sku), None)

            if not check or not check["isInStock"]:
                return jsonify({
                    "error": f"Sản phẩm {sku} hết hàng"
                }), 400

        # ============================
        # 🔥 INSERT ORDER
        # ============================
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO orders (user_id, order_date, total_amount, status)
            VALUES (%s, %s, %s, %s)
            RETURNING order_id
        """, (user_id, datetime.now(), total_amount, "Chờ xác nhận"))

        order_id = cur.fetchone()[0]

        # 👉 chi tiết đơn
        for item in items:
            cur.execute("""
                INSERT INTO orderdetail (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (order_id, item["product_id"], item["quantity"], item["price"]))

        conn.commit()
        cur.close()

        # ============================
        # 🔥 NEW: GỬI KAFKA EVENT
        # ============================
        try:
            send_notification(order_id)
        except Exception as e:
            print("⚠️ Kafka error:", e)

        return jsonify({
            "message": "Order placed successfully",
            "order_id": order_id
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()


# ============================
# GET ALL ORDERS
# ============================
@orders_bp.route("", methods=["GET"])
def get_orders():
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT order_id, user_id, order_date, total_amount, status
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
        return jsonify({"error": str(e)}), 500


# ============================
# GET ORDERS BY USER
# ============================
@orders_bp.route("/user/<int:user_id>", methods=["GET"])
def get_orders_by_user(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # 🔥 lấy danh sách đơn hàng
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

        # 🔥 lấy chi tiết từng đơn
        for order in orders:
            cur.execute("""
                SELECT 
                    p.name AS product_name,
                    od.quantity,
                    od.price
                FROM orderdetail od
                JOIN product p ON od.product_id = p.product_id
                WHERE od.order_id = %s
            """, (order["order_id"],))

            order["items"] = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(orders)

    except Exception as e:
        print("❌ Lỗi get_orders_by_user:", e)
        return jsonify({"error": str(e)}), 500
Không có route cancel_order sẵn. Cần thêm vào code. Đây là full plan:

Bước 1 — Thêm route cancel vào order-service
Mở file routes/order.py → thêm vào cuối:
python# ============================
# CANCEL ORDER
# ============================
@orders_bp.route("/cancel/<int:order_id>", methods=["PUT"])
def cancel_order(order_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT status FROM orders WHERE order_id = %s", (order_id,))
        order = cur.fetchone()

        if not order:
            return jsonify({"error": "Không tìm thấy đơn hàng"}), 404

        if order["status"] not in ["Chờ xác nhận"]:
            return jsonify({"error": f"Không thể hủy đơn đang ở trạng thái '{order['status']}'"}), 400

        cur.execute("""
            UPDATE orders SET status = 'Đã hủy'
            WHERE order_id = %s RETURNING order_id, status
        """, (order_id,))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Hủy đơn thành công", "order": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500