from flask import Blueprint, jsonify
from db import get_connection
from psycopg2.extras import RealDictCursor

address_bp = Blueprint("address", __name__, url_prefix="/api/address")


# =========================
# 📦 GET ADDRESS BY USER
# =========================
@address_bp.route("/user/<int:user_id>", methods=["GET"])
def get_address_by_user(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT
                address_id AS id,
                street,
                city,
                state,
                zip_code,
                country
            FROM address
            WHERE user_id = %s
            ORDER BY address_id DESC
        """, (user_id,))

        rows = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(rows), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500