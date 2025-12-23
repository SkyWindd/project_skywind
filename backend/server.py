import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import UPLOAD_FOLDER
from vietnam_provinces import NESTED_DIVISIONS_JSON_PATH

# Blueprints
from routes.product import product_bp, update_missing_slugs
from routes.upload import upload_bp
from routes.chatbot import chatbot_bp
from routes.auth import auth_bp
from routes.user import user_bp
from routes.rating import rating_bp
from routes.order import orders_bp
from routes.dashboard import dashboard_bp
from routes.cart import cart_bp
from routes.address import address_bp
from routes.admin import admin_bp


# =========================
# APP CHẠY THẬT
# =========================
app = Flask(__name__)
app.config["SECRET_KEY"] = "supersecretkey123"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# Register blueprints
app.register_blueprint(product_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(address_bp)
app.register_blueprint(admin_bp)


# ❗ CHỈ CHẠY DB KHI KHÔNG TEST
if not os.environ.get("TESTING"):
    update_missing_slugs()


@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running 🚀"})


# Load Vietnam administrative data
with NESTED_DIVISIONS_JSON_PATH.open("r", encoding="utf-8") as f:
    VIETNAM_DATA = json.load(f)


@app.route("/api/provinces", methods=["GET"])
def get_provinces():
    provinces = [
        {
            "name": p["name"],
            "code": p["code"],
            "division_type": p["division_type"],
            "codename": p["codename"],
        }
        for p in VIETNAM_DATA
    ]
    return jsonify(provinces), 200


@app.route("/api/wards", methods=["GET"])
def get_wards():
    province_code = request.args.get("province_code", type=int)
    if not province_code:
        return jsonify({"error": "Thiếu province_code"}), 400

    province = next((p for p in VIETNAM_DATA if p["code"] == province_code), None)
    if not province:
        return jsonify({"error": "Không tìm thấy tỉnh"}), 404

    return jsonify(province.get("wards", [])), 200


# =========================
# APP FACTORY CHO TEST
# =========================
def create_app():
    """App factory dùng cho unit/integration test"""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "supersecretkey123"
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config["TESTING"] = True  # ❗ RẤT QUAN TRỌNG

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

    # Register blueprints
    app.register_blueprint(product_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(rating_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(address_bp)
    app.register_blueprint(admin_bp)

    # ❌ TUYỆT ĐỐI KHÔNG ĐỤNG DB KHI TEST
    return app


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
