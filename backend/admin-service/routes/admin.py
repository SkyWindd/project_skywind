from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
import os

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# 🔥 SECRET từ ENV (chuẩn microservice)
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")


# =====================================================
# 🔒 Middleware check admin
# =====================================================
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Missing token"}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # 🔥 check role
            if payload.get("role") != "admin":
                return jsonify({"message": "Forbidden"}), 403

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except Exception as e:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


# =====================================================
# 📦 TEST API admin
# =====================================================
@admin_bp.route("/test", methods=["GET"])
@admin_required
def admin_test():
    return jsonify({
        "message": "Admin service OK 🚀"
    })


# =====================================================
# 📊 DASHBOARD SAMPLE
# =====================================================
@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard():
    return jsonify({
        "users": 120,
        "orders": 56,
        "revenue": 999999
    })