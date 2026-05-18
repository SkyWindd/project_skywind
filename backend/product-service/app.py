from flask import Flask, send_from_directory
from routes.product import product_bp
from flask_cors import CORS
import os

app = Flask(__name__)

# 🔥 FIX CORS
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# 🔥 REGISTER ROUTES
app.register_blueprint(product_bp)

# 🔥 FIX IMAGE STATIC
UPLOAD_FOLDER = os.path.join(app.root_path, "uploads")

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )