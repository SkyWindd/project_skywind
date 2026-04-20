from flask import Flask, send_from_directory
from routes.product import product_bp
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app)

app.register_blueprint(product_bp)

# 🔥 FIX IMAGE 404
@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(
        os.path.join(app.root_path, 'uploads'),
        filename
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)