from flask import Blueprint, jsonify, request
from functools import wraps
import jwt

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

SECRET_KEY = "supersecretkey123"

# Middleware check admin
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"message": "Missing token"}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("role") != "admin":
                return jsonify({"message": "Forbidden"}), 403
        except Exception:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated


@admin_bp.route("/products", methods=["GET"])
@admin_required
def admin_products():
    return jsonify({"message": "Admin access OK"}), 200
