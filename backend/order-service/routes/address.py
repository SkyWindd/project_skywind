# backend/routes/address.py
from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from db import get_connection
import traceback
import requests

address_bp = Blueprint("address", __name__, url_prefix="/api/address")

# ===========================================================
# 🔵 API LẤY TỈNH
# ===========================================================
@address_bp.route("/provinces", methods=["GET"])
def get_provinces():
    try:
        res = requests.get("https://provinces.open-api.vn/api/p/")
        return jsonify(res.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# 🟠 API LẤY QUẬN THEO TỈNH
# ===========================================================
@address_bp.route("/districts", methods=["GET"])
def get_districts():
    province_code = request.args.get("province_code")

    if not province_code:
        return jsonify({"error": "Thiếu province_code"}), 400

    try:
        res = requests.get(f"https://provinces.open-api.vn/api/p/{province_code}?depth=2")
        data = res.json()
        return jsonify(data.get("districts", []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# 🟢 API LẤY PHƯỜNG THEO QUẬN
# ===========================================================
@address_bp.route("/wards", methods=["GET"])
def get_wards():
    district_code = request.args.get("district_code")

    if not district_code:
        return jsonify({"error": "Thiếu district_code"}), 400

    try:
        res = requests.get(f"https://provinces.open-api.vn/api/d/{district_code}?depth=2")
        data = res.json()
        return jsonify(data.get("wards", []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# 🟦 LẤY DANH SÁCH ĐỊA CHỈ TRONG DB
# ===========================================================
@address_bp.route("/user/<int:user_id>", methods=["GET"])
def get_addresses(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT
                address_id AS id,
                name,
                phone,
                street,
                ward,
                district,
                province,
                is_default
            FROM address
            WHERE user_id = %s
            ORDER BY is_default DESC, address_id DESC
        """, (user_id,))

        data = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===========================================================
# 🟩 API LẤY ĐỊA CHỈ MẶC ĐỊNH
# ===========================================================
@address_bp.route("/default/<int:user_id>", methods=["GET"])
def get_default_address(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT
                name,
                phone,
                province,
                district,
                ward,
                street,
                is_default
            FROM address
            WHERE user_id = %s
            ORDER BY is_default DESC, address_id DESC
            LIMIT 1
        """, (user_id,))

        data = cur.fetchone()

        cur.close()
        conn.close()

        return jsonify(data if data else {}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===========================================================
# 🟧 LƯU ĐỊA CHỈ (THÊM / SỬA)
# ===========================================================
@address_bp.route("/save", methods=["POST"])
def save_address():
    try:
        data = request.get_json()

        user_id = data.get("user_id")
        name = data.get("name")
        phone = data.get("phone")
        street = data.get("street")
        ward = data.get("ward")
        district = data.get("district")
        province = data.get("province")
        is_default = data.get("is_default", False)

        if not all([user_id, name, phone, street, ward, district, province]):
            return jsonify({"error": "Thiếu thông tin"}), 400

        conn = get_connection()
        cur = conn.cursor()

        # reset default nếu user chọn mặc định mới
        if is_default:
            cur.execute("UPDATE address SET is_default = FALSE WHERE user_id = %s", (user_id,))

        # check user có địa chỉ chưa
        cur.execute("SELECT address_id FROM address WHERE user_id = %s", (user_id,))
        exists = cur.fetchone()

        if exists:
            cur.execute("""
                UPDATE address
                SET name=%s, phone=%s, street=%s, ward=%s, district=%s, province=%s, is_default=%s
                WHERE user_id=%s
            """, (name, phone, street, ward, district, province, is_default, user_id))
        else:
            cur.execute("""
                INSERT INTO address (user_id, name, phone, street, ward, district, province, is_default)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """, (user_id, name, phone, street, ward, district, province, is_default))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Lưu thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===========================================================
# 🟥 XÓA ĐỊA CHỈ
# ===========================================================
@address_bp.route("/delete/<int:address_id>", methods=["DELETE"])
def delete_address(address_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM address WHERE address_id=%s", (address_id,))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "Xoá thành công"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
