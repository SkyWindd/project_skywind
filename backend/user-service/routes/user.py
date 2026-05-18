
from flask import Blueprint, jsonify, request
from db import get_connection
from werkzeug.security import generate_password_hash

user_bp = Blueprint(
    "user_bp",
    __name__,
    url_prefix="/api/users"
)

# =========================================================
# GET USERS
# =========================================================
@user_bp.route("", methods=["GET"])
@user_bp.route("/", methods=["GET"])
def get_users():

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                user_id,
                username,
                email,
                is_active,
                role
            FROM users
            ORDER BY user_id ASC
        """)

        rows = cur.fetchall()

        users = [
            {
                "user_id": row[0],
                "username": row[1],
                "email": row[2],
                "is_active": row[3],
                "role": row[4],
            }
            for row in rows
        ]

        cur.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# CREATE USER
# =========================================================
@user_bp.route("", methods=["POST"])
@user_bp.route("/", methods=["POST"])
def create_user():

    return jsonify(users)

# GET USER BY ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT user_id, username, email, is_active, role
            FROM users WHERE user_id = %s
        """, (user_id,))
        r = cur.fetchone()
        cur.close()
        conn.close()
        if not r:
            return jsonify({"error": "User not found"}), 404
        return jsonify({
            "user_id": r[0],
            "username": r[1],
            "email": r[2],
            "is_active": r[3],
            "role": r[4]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# UPDATE USER
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "user")

        # VALIDATE
        if not username or not email or not password:
            return jsonify({
                "error": "Thiếu thông tin"
            }), 400

        conn = get_connection()
        cur = conn.cursor()

        # CHECK EMAIL
        cur.execute("""
            SELECT user_id
            FROM users
            WHERE email = %s
        """, (email,))

        existing = cur.fetchone()

        if existing:

            cur.close()
            conn.close()

            return jsonify({
                "error": "Email đã tồn tại"
            }), 400

        # HASH PASSWORD
        hashed_password = generate_password_hash(password)

        # INSERT USER
        cur.execute("""
            INSERT INTO users (
                username,
                email,
                password,
                role,
                is_active
            )
            VALUES (%s, %s, %s, %s, %s)

            RETURNING
                user_id,
                username,
                email,
                role
        """, (
            username,
            email,
            hashed_password,
            role,
            True
        ))

        new_user = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "message": "Tạo user thành công",

            "user": {
                "user_id": new_user[0],
                "username": new_user[1],
                "email": new_user[2],
                "role": new_user[3],
            }
        }), 201

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# UPDATE USER
# =========================================================
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):

    try:
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE users

            SET
                username = %s,
                email = %s

            WHERE user_id = %s

            RETURNING
                user_id,
                username,
                email
        """, (
            username,
            email,
            user_id
        ))

        updated = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        if not updated:
            return jsonify({
                "error": "User không tồn tại"
            }), 404

        return jsonify({
            "message": "Cập nhật thành công",

            "user": {
                "user_id": updated[0],
                "username": updated[1],
                "email": updated[2]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# DELETE USER
# =========================================================
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            DELETE FROM users
            WHERE user_id = %s
            RETURNING user_id
        """, (user_id,))

        deleted = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        if not deleted:
            return jsonify({
                "error": "User không tồn tại"
            }), 404

        return jsonify({
            "message": "Xóa user thành công"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

