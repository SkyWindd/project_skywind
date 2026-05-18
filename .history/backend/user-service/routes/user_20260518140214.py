from flask import Blueprint, jsonify, request
from db import get_connection
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# GET USERS
@user_bp.route("", methods=["GET"])
@user_bp.route("/", methods=["GET"])
def get_users():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT user_id, username, email, is_active, role
        FROM users
        ORDER BY user_id ASC
    """)

    rows = cur.fetchall()

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

    cur.close()
    conn.close()

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

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE users 
            SET username = %s, email = %s
            WHERE user_id = %s
            RETURNING user_id, username, email
        """, (username, email, user_id))

        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "user_id": updated[0],
            "username": updated[1],
            "email": updated[2]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500