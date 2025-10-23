from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = "supersecretkey123"

# ---------------------- HELPER ----------------------
def create_tokens(user):
    """Tạo access & refresh token"""
    payload = {
        "user_id": user["user_id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(minutes=15)  # access token 15 phút
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    refresh_payload = {
        "user_id": user["user_id"],
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7)  # refresh token 7 ngày
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm="HS256")

    return access_token, refresh_token


# ---------------------- ĐĂNG KÝ ----------------------
@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        print("📩 Dữ liệu đăng ký:", data)

        # ✅ Nhận cả username hoặc fullName
        username = data.get("username") or data.get("fullName")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "user")

        if not username or not email or not password:
            return jsonify({"success": False, "message": "Thiếu thông tin"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # ✅ Kiểm tra email trùng
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            print("⚠️ Email đã tồn tại")
            return jsonify({"success": False, "message": "Email đã tồn tại"}), 400

        # ✅ Mã hóa mật khẩu
        hashed = generate_password_hash(password)
        print("🔐 Hash:", hashed)

        cur.execute(
            """
            INSERT INTO users (username, email, password, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING user_id
            """,
            (username, email, hashed, role, True),
        )
        user_id = cur.fetchone()["user_id"]
        conn.commit()

        print(f"✅ Đăng ký thành công: {email}")

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
        print("📩 Dữ liệu đăng nhập:", data)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"success": False, "message": "Thiếu thông tin đăng nhập"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            print("❌ Không tìm thấy user")
            return jsonify({"success": False, "message": "Email không tồn tại"}), 400

        if not check_password_hash(user["password"], password):
            print("❌ Sai mật khẩu")
            return jsonify({"success": False, "message": "Mật khẩu không đúng"}), 400

        access_token, refresh_token = create_tokens(user)
        print(f"✅ Đăng nhập thành công: {email}")

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

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if decoded.get("type") != "refresh":
                return jsonify({"success": False, "message": "Token không hợp lệ"}), 401

            new_access = jwt.encode({
                "user_id": decoded["user_id"],
                "exp": datetime.utcnow() + timedelta(minutes=15)
            }, SECRET_KEY, algorithm="HS256")

            return jsonify({"success": True, "accessToken": new_access}), 200

        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Refresh token hết hạn"}), 401
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 400

    except Exception as e:
        print("❌ Lỗi refresh:", e)
        return jsonify({"success": False, "message": str(e)}), 500
