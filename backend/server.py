from flask import Flask, jsonify
from flask_cors import CORS
from config import UPLOAD_FOLDER
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
