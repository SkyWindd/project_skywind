from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from db import get_connection
from datetime import datetime
import traceback

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


# =========================================================
# 🧾 API: Tạo đơn hàng mới + TRỪ STOCK
# =========================================================
@orders_bp.route("/create", methods=["POST"])
def create_order():
    conn = None
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        items = data.get("cart_items")
        payment_method = data.get("payment_method", "cod")

        if not user_id or not items:
            return jsonify({"error": "Thiếu dữ liệu đầu vào"}), 400

        total_amount = sum(item["price"] * item["quantity"] for item in items)

        conn = get_connection()
        cur = conn.cursor()

        # 1️⃣ Tạo đơn hàng
        cur.execute("""
            INSERT INTO orders (user_id, order_date, total_amount, status)
            VALUES (%s, %s, %s, %s)
            RETURNING order_id
        """, (user_id, datetime.now(), total_amount, "Đang xử lý"))

        order_id = cur.fetchone()[0]

        # 2️⃣ Lặp toàn bộ sản phẩm trong giỏ → thêm vào orderdetail và trừ stock
        for item in items:

            product_id = item["product_id"]
            quantity = item["quantity"]
            price = item["price"]

            # 2.1 ⛔ Kiểm tra tồn kho
            cur.execute("""
                SELECT stock FROM product WHERE product_id = %s
            """, (product_id,))
            result = cur.fetchone()

            if not result:
                conn.rollback()
                return jsonify({"error": f"Sản phẩm {product_id} không tồn tại"}), 400

            stock = result[0]

            if stock < quantity:
                conn.rollback()
                return jsonify({"error": f"Sản phẩm {product_id} không đủ số lượng. Còn {stock} cái."}), 400

            # 2.2 📝 Thêm vào bảng orderdetail
            cur.execute("""
                INSERT INTO orderdetail (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (order_id, product_id, quantity, price))

            # 2.3 🔥 TRỪ STOCK
            cur.execute("""
                UPDATE product
                SET stock = stock - %s
                WHERE product_id = %s
            """, (quantity, product_id))

        # 3️⃣ Tạo thông tin thanh toán
        cur.execute("""
            INSERT INTO payment (order_id, payment_date, method, status, amount)
            VALUES (%s, %s, %s, %s, %s)
        """, (order_id, datetime.now(), payment_method, "Chờ xử lý", total_amount))

        conn.commit()
        cur.close()

        return jsonify({
            "message": "Tạo đơn hàng thành công",
            "order_id": order_id
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()

# =========================================================
# 📦 API: Lấy danh sách đơn hàng của user
# =========================================================
@orders_bp.route("/user/<int:user_id>", methods=["GET"])
def get_orders_by_user(user_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Lấy đơn hàng
        cur.execute("""
            SELECT 
                o.order_id,
                o.order_date,
                o.total_amount,
                o.status,
                p.method AS payment_method,
                p.status AS payment_status,
                p.amount AS payment_amount
            FROM orders o
            LEFT JOIN payment p ON o.order_id = p.order_id
            WHERE o.user_id = %s
            ORDER BY o.order_date DESC
        """, (user_id,))
        orders = cur.fetchall()

        result = []

        # Lấy sản phẩm + ảnh
        for order in orders:
            order_id = order["order_id"]

            cur.execute("""
                SELECT 
                    od.product_id,
                    pr.name AS product_name,
                    od.quantity,
                    od.price,
                    img.path AS image_url
                FROM orderdetail od
                JOIN product pr ON od.product_id = pr.product_id
                LEFT JOIN image img ON od.product_id = img.product_id
                WHERE od.order_id = %s
                ORDER BY img.image_id ASC
                LIMIT 1
            """, (order_id,))
            items = cur.fetchall()

            result.append({
                "order_id": order["order_id"],
                "order_date": order["order_date"].strftime("%Y-%m-%d %H:%M:%S"),
                "total_amount": order["total_amount"],
                "status": order["status"],
                "payment": {
                    "method": order["payment_method"],
                    "status": order["payment_status"],
                    "amount": order["payment_amount"],
                },
                "items": items,
            })

        cur.close()
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


# =========================================================
# 🔍 API: Lấy chi tiết đơn hàng
# =========================================================
@orders_bp.route("/<int:order_id>", methods=["GET"])
def get_order_detail(order_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Lấy thông tin đơn
        cur.execute("""
            SELECT 
                o.order_id,
                o.user_id,
                o.order_date,
                o.total_amount,
                o.status,
                p.method AS payment_method,
                p.status AS payment_status,
                p.amount AS payment_amount
            FROM orders o
            LEFT JOIN payment p ON o.order_id = p.order_id
            WHERE o.order_id = %s
        """, (order_id,))
        order = cur.fetchone()

        if not order:
            return jsonify({"error": "Không tìm thấy đơn hàng"}), 404

        # Lấy sản phẩm + ảnh
        cur.execute("""
            SELECT 
                od.product_id,
                pr.name AS product_name,
                od.quantity,
                od.price,
                img.path AS image_url
            FROM orderdetail od
            JOIN product pr ON od.product_id = pr.product_id
            LEFT JOIN image img ON od.product_id = img.product_id
            WHERE od.order_id = %s
            ORDER BY img.image_id ASC
            LIMIT 1
        """, (order_id,))
        items = cur.fetchall()

        order_detail = {
            "order_id": order["order_id"],
            "user_id": order["user_id"],
            "order_date": order["order_date"].strftime("%Y-%m-%d %H:%M:%S"),
            "total_amount": order["total_amount"],
            "status": order["status"],
            "payment": {
                "method": order["payment_method"],
                "status": order["payment_status"],
                "amount": order["payment_amount"]
            },
            "items": items
        }

        cur.close()
        return jsonify(order_detail), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# =========================================================
# 🧰 API (Admin): Cập nhật trạng thái đơn hàng
# =========================================================
@orders_bp.route("/update-status/<int:order_id>", methods=["PUT"])
def update_order_status(order_id):
    conn = None
    try:
        data = request.get_json()
        new_order_status = data.get("order_status")
        new_payment_status = data.get("payment_status")

        if not new_order_status and not new_payment_status:
            return jsonify({"error": "Không có dữ liệu để cập nhật"}), 400

        conn = get_connection()
        cur = conn.cursor()

        if new_order_status:
            cur.execute("""
                UPDATE orders
                SET status = %s
                WHERE order_id = %s
            """, (new_order_status, order_id))

        if new_payment_status:
            cur.execute("""
                UPDATE payment
                SET status = %s
                WHERE order_id = %s
            """, (new_payment_status, order_id))

        conn.commit()
        cur.close()

        return jsonify({
            "message": "Cập nhật trạng thái thành công",
            "new_status": new_order_status,
            "new_payment_status": new_payment_status
        }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


# =========================================================
# 📋 API: Lấy tất cả đơn hàng (Admin)
# =========================================================
@orders_bp.route("/", methods=["GET"])
@orders_bp.route("", methods=["GET"])
def get_all_orders():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                o.order_id,
                o.user_id,
                o.order_date,
                o.total_amount,
                o.status
            FROM orders o
            ORDER BY o.order_date DESC
        """)
        orders = cur.fetchall()

        cur.close()
        return jsonify(orders), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()
