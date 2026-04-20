from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime
import requests

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

INVENTORY_URL = "http://inventory-service:5002/api/inventory"

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

        # ✅ tạo order
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