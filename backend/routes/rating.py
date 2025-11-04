from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from datetime import datetime
from db import get_connection
import traceback

rating_bp = Blueprint("rating", __name__, url_prefix="/api/rating")

# ✅ API thêm đánh giá
@rating_bp.route("/add", methods=["POST"])
def add_rating():
    try:
        data = request.get_json()
        print("📩 Dữ liệu đánh giá nhận được:", data)

        product_id = data.get("product_id")
        user_id = data.get("user_id")
        rating = data.get("rating")
        comment = data.get("comment", "")

        # Kiểm tra dữ liệu
        if not all([product_id, user_id, rating]):
            return jsonify({"success": False, "message": "Thiếu dữ liệu cần thiết"}), 400

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO rating (product_id, user_id, rating, comment, created_at)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING rating_id
        """, (product_id, user_id, rating, comment, datetime.now()))

        new_id = cur.fetchone()[0]
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "rating_id": new_id}), 201

    except Exception as e:
        print("❌ Lỗi khi thêm đánh giá:", e)
        traceback.print_exc()
        return jsonify({"success": False, "message": "Lỗi server"}), 500


# ✅ API lấy danh sách đánh giá của sản phẩm
@rating_bp.route("/<int:product_id>", methods=["GET"])
def get_ratings(product_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT r.rating_id, r.rating, r.comment, r.created_at,
                   u.username AS user_name
            FROM rating r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = %s
            ORDER BY r.created_at DESC
        """, (product_id,))

        ratings = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": ratings}), 200

    except Exception as e:
        print("❌ Lỗi khi lấy danh sách đánh giá:", e)
        traceback.print_exc()
        return jsonify({"success": False, "message": "Lỗi server"}), 500
# ✅ API lấy trung bình đánh giá cho từng sản phẩm
@rating_bp.route("/average/<int:product_id>", methods=["GET"])
def get_average_rating(product_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
                COUNT(r.rating_id) AS total_reviews
            FROM rating r
            WHERE r.product_id = %s
        """, (product_id,))

        result = cur.fetchone()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": result}), 200

    except Exception as e:
        print("❌ Lỗi khi lấy trung bình đánh giá:", e)
        traceback.print_exc()
        return jsonify({"success": False, "message": "Lỗi server"}), 500
