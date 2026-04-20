from flask import Flask
from flask_cors import CORS
from routes.user import user_bp

app = Flask(__name__)

# 🔥 FIX CORS CHUẨN
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(port=5003, debug=True)