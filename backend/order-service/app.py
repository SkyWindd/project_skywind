from flask import Flask
from flask_cors import CORS

# import tất cả routes
from routes.order import orders_bp
from routes.auth import auth_bp
from routes.cart import cart_bp
from routes.admin import admin_bp
from routes.dashboard import dashboard_bp
from routes.upload import upload_bp
from routes.rating import rating_bp
from routes.address import address_bp

app = Flask(__name__)

# 🔥 CORS chuẩn (tránh lỗi frontend)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 🔥 register tất cả blueprint
app.register_blueprint(orders_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(rating_bp)
app.register_blueprint(address_bp)

# 🔥 fix OPTIONS (tránh 404 preflight)
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

@app.route("/")
def home():
    return {"message": "Order Service running 🚀"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)