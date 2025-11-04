from flask import Flask, jsonify, request
from flask_cors import CORS
from config import UPLOAD_FOLDER
from vietnam_provinces import NESTED_DIVISIONS_JSON_PATH, Province
import json
from routes.product import product_bp
from routes.upload import upload_bp
from routes.chatbot import chatbot_bp
from routes.auth import auth_bp
from routes.user import user_bp 
from routes.product import product_bp, update_missing_slugs
from routes.rating import rating_bp
app = Flask(__name__)
app.config["SECRET_KEY"] = "supersecretkey123"
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ Đăng ký Blueprint
app.register_blueprint(product_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(rating_bp)
# ========================
# ✅ Cập nhật slug sản phẩm cũ khi server khởi động
# ========================
update_missing_slugs()

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running 🚀"})

# 🧠 Nạp dữ liệu hành chính Việt Nam 1 lần duy nhất (cache)
with NESTED_DIVISIONS_JSON_PATH.open("r", encoding="utf-8") as f:
    VIETNAM_DATA = json.load(f)


# 🗺️ API: Lấy danh sách Tỉnh / Thành phố
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


# 🏘️ API: Lấy danh sách Phường / Xã theo mã tỉnh (province_code)
@app.route("/api/wards", methods=["GET"])
def get_wards():
    province_code = request.args.get("province_code", type=int)
    if not province_code:
        return jsonify({"error": "Thiếu province_code"}), 400

    province = next((p for p in VIETNAM_DATA if p["code"] == province_code), None)
    if not province:
        return jsonify({"error": "Không tìm thấy tỉnh"}), 404

    wards = province.get("wards", [])
    return jsonify(wards), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
