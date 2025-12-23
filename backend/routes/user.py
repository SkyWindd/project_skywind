from flask import Blueprint, jsonify, request
from db import get_connection
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash

# Blueprint cho user API
user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# =========================
# 📌 GET ALL USERS
# =========================
@user_bp.route("/", methods=["GET"])
@cross_origin()
def get_users():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT user_id, username, email, is_active, role
            FROM users
            ORDER BY user_id ASC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        users = [
            {
                "user_id": r[0],
                "username": r[1],
                "email": r[2],
                "is_active": r[3],
                "role": r[4],
            }
            for r in rows
        ]
        return jsonify(users)
    except Exception as e:
        print("❌ Lỗi lấy users:", e)
        return jsonify({"error": str(e)}), 500


# =========================
# 📌 CREATE USER (ADMIN)
# =========================
@user_bp.route("/", methods=["POST", "OPTIONS"])
@cross_origin()
def create_user():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    try:
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "user")
        is_active = data.get("is_active", True)

        if not username or not email or not password:
            return jsonify({
                "success": False,
                "message": "Thiếu dữ liệu"
            }), 400

        conn = get_connection()
        cur = conn.cursor()

        # ❗ Check trùng email
        cur.execute("SELECT 1 FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({
                "success": False,
                "message": "Email đã tồn tại"
            }), 400

        hashed_password = generate_password_hash(password)

        cur.execute("""
            INSERT INTO users (username, email, password, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING user_id
        """, (username, email, hashed_password, role, is_active))

        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Tạo người dùng thành công",
            "user_id": user_id
        }), 201

    except Exception as e:
        print("❌ Lỗi tạo user:", e)
        return jsonify({"success": False, "error": str(e)}), 500


# =========================
# 📌 UPDATE USER
# =========================
@user_bp.route("/<int:user_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_user(user_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    try:
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        role = data.get("role")
        is_active = data.get("is_active")

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE users
            SET username = %s,
                email = %s,
                role = %s,
                is_active = %s
            WHERE user_id = %s
        """, (username, email, role, is_active, user_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Cập nhật người dùng thành công"
        })

    except Exception as e:
        print("❌ Lỗi update user:", e)
        return jsonify({"success": False, "error": str(e)}), 500
