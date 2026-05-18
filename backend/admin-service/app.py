from flask import Flask

from flask_cors import CORS

# =========================
# BLUEPRINTS
# =========================
from routes.admin import admin_bp

from routes.dashboard import dashboard_bp


app = Flask(__name__)

CORS(app)

# =========================
# REGISTER BLUEPRINT
# =========================
app.register_blueprint(admin_bp)

app.register_blueprint(dashboard_bp)


# =========================
# HOME
# =========================
@app.route("/")
def home():

    return {
        "message":
        "Admin service running"
    }


# =========================
# RUN
# =========================
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5006,
        debug=True
    )

