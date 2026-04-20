from flask import Flask
from routes.inventory import inventory_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(inventory_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)