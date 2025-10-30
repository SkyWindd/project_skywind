from flask import Blueprint, jsonify, request
from db import get_connection
from flask_cors import cross_origin

# Blueprint cho user API
user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")


# 🧩 Lấy danh sách người dùng
@user_bp.route("/", methods=["GET"])
@cross_origin()
def get_users():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT user_id, username, email, is_active, role FROM users ORDER BY user_id ASC"
        )
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
        print("❌ Lỗi lấy danh sách users:", e)
        return jsonify({"error": str(e)}), 500


# 🧩 Cập nhật thông tin người dùng
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
        cur.execute(
            """
            UPDATE users
            SET username = %s, email = %s, role = %s, is_active = %s
            WHERE user_id = %s
            """,
            (username, email, role, is_active, user_id),
        )
        conn.commit()
        cur.close()
        conn.close()

        print(f"✅ Cập nhật user_id={user_id} thành công!")
        return jsonify({"success": True, "message": "Cập nhật người dùng thành công!"})
    except Exception as e:
        print("❌ Lỗi cập nhật người dùng:", e)
        return jsonify({"success": False, "error": str(e)}), 500
