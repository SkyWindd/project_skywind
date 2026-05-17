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