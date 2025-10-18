# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os, time, random, json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load intents.json (nếu có)
if os.path.exists("intents.json"):
    with open("intents.json", "r", encoding="utf-8") as f:
        intents = json.load(f).get("intents", [])
else:
    intents = []

# ⚙️ Kết nối PostgreSQL
for i in range(5):
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            port=os.getenv("DB_PORT")
        )
        cur = conn.cursor(cursor_factory=RealDictCursor)
        print("✅ Kết nối PostgreSQL thành công!")
        break
    except Exception as e:
        print(f"⏳ Thử lại kết nối DB ({i+1}/5):", e)
        time.sleep(3)
else:
    print("❌ Không thể kết nối tới PostgreSQL.")
    cur = None



# ✅ Route mặc định (để test)
@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running 🚀"})

# ✅ API 1: Lấy danh sách sản phẩm
@app.route("/api/product_new", methods=["GET"])
def get_products():
    if not cur:
        return jsonify({"error": "Database not connected"}), 500
    try:
        cur.execute("SELECT id, name, price, image FROM product_new")
        rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        print("❌ Lỗi database:", e)
        return jsonify({"error": "Database error"}), 500


# 🎯 Hàm phản hồi từ file intents.json
def get_intent_reply(user_input):
    user_input = user_input.lower()
    for intent in intents:
        for pattern in intent["patterns"]:
            if pattern in user_input:
                return random.choice(intent["responses"])
    return None


@app.route("/api/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    msg = data.get("message", "").lower()
    reply = "Xin lỗi, tôi chưa hiểu ý bạn 😅"

    for intent in intents:
        for pattern in intent.get("patterns", []):
            if pattern in msg:
                reply = random.choice(intent["responses"])
                break
    return jsonify({"reply": reply})

# 🚀 Chạy server Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", 5000)))




