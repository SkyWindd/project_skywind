from flask import Blueprint, jsonify, request
from db import get_connection
from psycopg2.extras import RealDictCursor
import requests

address_bp = Blueprint(
    "address",
    __name__,
    url_prefix="/api/address"
)

# ==========================================
# 📍 GET ALL PROVINCES
# ==========================================
@address_bp.route("/provinces", methods=["GET"])
def get_provinces():
    try:
        url = "https://provinces.open-api.vn/api/p/"

        response = requests.get(url)

        return jsonify(response.json()), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# 📍 GET DISTRICTS BY PROVINCE CODE
# ==========================================
@address_bp.route("/districts", methods=["GET"])
def get_districts():
    try:
        province_code = request.args.get("province_code")

        if not province_code:
            return jsonify({
                "error": "province_code is required"
            }), 400

        url = f"https://provinces.open-api.vn/api/p/{province_code}?depth=2"

        response = requests.get(url)

        data = response.json()

        districts = data.get("districts", [])

        return jsonify(districts), 200

    except Exception as e:
        print("❌ DISTRICT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# 📍 GET WARDS BY DISTRICT CODE
# ==========================================
@address_bp.route("/wards", methods=["GET"])
def get_wards():
    try:
        district_code = request.args.get("district_code")

        if not district_code:
            return jsonify({
                "error": "district_code is required"
            }), 400

        url = f"https://provinces.open-api.vn/api/d/{district_code}?depth=2"

        response = requests.get(url)

        data = response.json()

        wards = data.get("wards", [])

        return jsonify(wards), 200

    except Exception as e:
        print("❌ WARD ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# 📦 GET ADDRESS BY USER
# ==========================================
@address_bp.route("/user/<int:user_id>", methods=["GET"])
def get_address_by_user(user_id):
    try:
        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

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
        return jsonify({
            "error": str(e)
        }), 500
# ==========================================
# ➕ SAVE ADDRESS (CREATE / UPDATE)
# ==========================================
@address_bp.route("/save", methods=["POST"])
def save_address():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        address_id = data.get("address_id")  # có thì update, không thì insert
        street = data.get("street")
        city = data.get("city")
        state = data.get("state")
        zip_code = data.get("zip_code")
        country = data.get("country")

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if address_id:
            # UPDATE
            cur.execute("""
                UPDATE address
                SET street = %s, city = %s, state = %s, zip_code = %s, country = %s
                WHERE address_id = %s AND user_id = %s
                RETURNING address_id
            """, (street, city, state, zip_code, country, address_id, user_id))
        else:
            # INSERT
            cur.execute("""
                INSERT INTO address (user_id, street, city, state, zip_code, country)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING address_id
            """, (user_id, street, city, state, zip_code, country))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Lưu địa chỉ thành công", "address_id": result["address_id"]}), 200

    except Exception as e:
        print("❌ Lỗi save_address:", e)
        return jsonify({"error": str(e)}), 500


# ==========================================
# 🗑️ DELETE ADDRESS
# ==========================================
@address_bp.route("/delete/<int:address_id>", methods=["DELETE"])
def delete_address(address_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM address WHERE address_id = %s", (address_id,))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Xóa địa chỉ thành công"}), 200

    except Exception as e:
        print("❌ Lỗi delete_address:", e)
        return jsonify({"error": str(e)}), 500