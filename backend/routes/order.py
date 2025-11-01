from flask import Blueprint, jsonify, request
from db import get_connection
from psycopg2.extras import RealDictCursor

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")

# 📦 Lấy tất cả đơn hàng
@orders_bp.route("/", methods=["GET"])
def get_orders():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT o.order_id, o.user_id, u.username, o.total_amount, o.status, o.order_date
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        ORDER BY o.order_date DESC;
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)


# 🧾 Tạo đơn hàng mới
@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.json
    user_id = data.get("user_id")
    total_amount = data.get("total_amount")
    status = data.get("status", "pending")

    if not user_id or total_amount is None:
        return jsonify({"error": "Thiếu thông tin bắt buộc"}), 400

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO orders (user_id, total_amount, status, order_date)
        VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
        RETURNING order_id;
    """, (user_id, total_amount, status))
    new_id = cur.fetchone()["order_id"]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Tạo đơn hàng thành công", "order_id": new_id})


# ✏️ Cập nhật đơn hàng
@orders_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    data = request.json
    status = data.get("status")

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("UPDATE orders SET status=%s WHERE order_id=%s RETURNING *;", (status, order_id))
    updated = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if not updated:
        return jsonify({"error": "Không tìm thấy đơn hàng"}), 404

    return jsonify({"message": "Cập nhật thành công", "order": updated})


# 🗑️ Xóa đơn hàng
@orders_bp.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("DELETE FROM orders WHERE order_id=%s RETURNING *;", (order_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if not deleted:
        return jsonify({"error": "Không tìm thấy đơn hàng"}), 404

    return jsonify({"message": "Đã xóa đơn hàng", "order": deleted})
