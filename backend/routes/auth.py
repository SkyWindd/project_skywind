from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection
from flask_cors import cross_origin
import jwt
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import secrets

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = "supersecretkey123"
GOOGLE_CLIENT_ID = "1021298070223-mvdt4u4itl5vecpjsc2aibbvrs2l9hai.apps.googleusercontent.com"  # chỉnh lại Client ID thật


# ---------------------- HELPER ----------------------
def create_tokens(user):
    """Tạo access & refresh token"""
    payload = {
        "user_id": user["user_id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    refresh_payload = {
        "user_id": user["user_id"],
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm="HS256")

    return access_token, refresh_token


# ---------------------- ĐĂNG KÝ ----------------------
@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username") or data.get("fullName")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "user")

        if not username or not email or not password:
            return jsonify({"success": False, "message": "Thiếu thông tin"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"success": False, "message": "Email đã tồn tại"}), 400

        hashed = generate_password_hash(password)
        cur.execute("""
            INSERT INTO users (username, email, password, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING user_id
        """, (username, email, hashed, role, True))
        user_id = cur.fetchone()["user_id"]
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Đăng ký thành công",
            "user": {"user_id": user_id, "username": username, "email": email, "role": role}
        }), 201

    except Exception as e:
        print("❌ Lỗi đăng ký:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if "cur" in locals(): cur.close()
        if "conn" in locals(): conn.close()


# ---------------------- ĐĂNG NHẬP ----------------------
@auth_bp.route("/api/auth/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"success": False, "message": "Thiếu thông tin đăng nhập"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Email không tồn tại"}), 400
        if not user["is_active"]:
            return jsonify({"success": False, "message": "Tài khoản bị khóa"}), 403
        if not check_password_hash(user["password"], password):
            return jsonify({"success": False, "message": "Sai mật khẩu"}), 400

        access_token, refresh_token = create_tokens(user)
        return jsonify({
            "success": True,
            "message": "Đăng nhập thành công",
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "user": {
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        print("❌ Lỗi đăng nhập:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if "cur" in locals(): cur.close()
        if "conn" in locals(): conn.close()


# ---------------------- REFRESH TOKEN ----------------------
@auth_bp.route("/api/auth/refresh-token", methods=["POST"])
def refresh_token():
    try:
        data = request.get_json()
        token = data.get("refreshToken")
        if not token:
            return jsonify({"success": False, "message": "Thiếu refresh token"}), 400

        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if decoded.get("type") != "refresh":
            return jsonify({"success": False, "message": "Token không hợp lệ"}), 401

        new_access = jwt.encode({
            "user_id": decoded["user_id"],
            "exp": datetime.utcnow() + timedelta(minutes=30)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({"success": True, "accessToken": new_access}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Refresh token hết hạn"}), 401
    except Exception as e:
        print("❌ Lỗi refresh:", e)
        return jsonify({"success": False, "message": str(e)}), 400


# ---------------------- GOOGLE LOGIN ----------------------
@auth_bp.route("/api/auth/google-login", methods=["POST"])
@cross_origin()
def google_login():
    try:
        data = request.get_json()
        token = data.get("token") or data.get("credential")

        if not token:
            return jsonify({"success": False, "message": "Thiếu Google token"}), 400

        # Xác minh token Google
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), GOOGLE_CLIENT_ID)

        email = idinfo.get("email")
        name = idinfo.get("name", email.split("@")[0])

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            # Tạo password giả để tránh lỗi NULL mà không ảnh hưởng user cũ
            random_password = secrets.token_hex(16)
            hashed_password = generate_password_hash(random_password)

            cur.execute("""
                INSERT INTO users (username, email, password, role, is_active)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING user_id, username, email, role
            """, (name, email, hashed_password, "user", True))
            user = cur.fetchone()
            conn.commit()

        access_token, refresh_token = create_tokens(user)
        return jsonify({
            "success": True,
            "message": "Đăng nhập Google thành công",
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "user": user
        }), 200

    except ValueError as e:
        print("❌ Lỗi xác minh Google token:", e)
        return jsonify({"success": False, "message": "Google token không hợp lệ"}), 401
    except Exception as e:
        print("❌ Lỗi Google login:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if "cur" in locals(): cur.close()
        if "conn" in locals(): conn.close()


# =======================
# PHÂN QUYỀN (UNIT TEST)
# =======================
def require_admin(user):
    """
    Kiểm tra user có quyền admin hay không
    Dùng cho unit test
    """
    if not user or user.get("role") != "admin":
        raise PermissionError("Forbidden")
    return True
