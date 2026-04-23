from flask import Flask
from routes.admin import admin_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(admin_bp)

@app.route("/")
def home():
    return {"message": "Admin service running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5006)