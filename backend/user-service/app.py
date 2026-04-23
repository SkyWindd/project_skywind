from flask import Flask
from flask_cors import CORS

# 🔹 Import routes
from routes.user import user_bp
from routes.address import address_bp   # ✅ thêm address

def create_app():
    app = Flask(__name__)

    # ============================
    # 🔥 CORS (cho frontend + gateway)
    # ============================
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": "*"}},  # dev: cho tất cả
    )

    # ============================
    # 🔹 REGISTER BLUEPRINT
    # ============================
    app.register_blueprint(user_bp)
    app.register_blueprint(address_bp)  # ✅ đăng ký address

    # ============================
    # 🔹 HEALTH CHECK (debug nhanh)
    # ============================
    @app.route("/", methods=["GET"])
    def health():
        return {
            "service": "user-service",
            "status": "running"
        }

    return app


# ============================
# 🔹 RUN APP
# ============================
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5003, debug=True)