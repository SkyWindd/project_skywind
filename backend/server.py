# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import json, random
app = Flask(__name__)
CORS(app)
# 🧠 Đọc file intents.json (huấn luyện cơ bản)
with open("intents.json", "r", encoding="utf-8") as f:
    intents = json.load(f)["intents"]



# ⚙️ Kết nối PostgreSQL
try:
    conn = psycopg2.connect(
        host="localhost",
        database="skywind",   # ⚠️ Đúng tên database của bạn
        user="postgres",            # ⚠️ Tên người dùng
        password="12345",           # ⚠️ Mật khẩu PostgreSQL
        port=54321                # ⚠️ Port mặc định PostgreSQL (đừng dùng 54321)
    )
    cur = conn.cursor(cursor_factory=RealDictCursor)
    print("✅ Kết nối PostgreSQL thành công!")
except Exception as e:
    print("❌ Không thể kết nối tới PostgreSQL:", e)
    conn = None
    cur = None

# ✅ Route mặc định (để test)
@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running 🚀"})

# ✅ API 1: Lấy danh sách sản phẩm
@app.route("/api/products", methods=["GET"])
def get_products():
    if not cur:
        return jsonify({"error": "Database not connected"}), 500
    try:
        cur.execute("SELECT id, name, price, image FROM products;")
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


# ✅ API chat chính
@app.route("/api/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    msg = data.get("message", "").lower()
    reply = None

    # 1️⃣ Thử phản hồi từ intents.json
    reply = get_intent_reply(msg)

    # 2️⃣ Nếu người dùng hỏi về sản phẩm → truy vấn PostgreSQL
    if "sản phẩm" in msg or "product" in msg:
        if cur:
            try:
                product_name = msg.split("sản phẩm")[-1].strip()
                if product_name:
                    cur.execute("SELECT name, price FROM products WHERE name ILIKE %s LIMIT 5;", (f"%{product_name}%",))
                else:
                    cur.execute("SELECT name, price FROM products LIMIT 5;")
                rows = cur.fetchall()

                if rows:
                    reply = "Các sản phẩm tôi tìm thấy: " + ", ".join([f"{r['name']} ({r['price']}₫)" for r in rows])
                else:
                    reply = "Không tìm thấy sản phẩm phù hợp."
            except Exception as e:
                print("❌ Lỗi khi truy vấn sản phẩm:", e)
                reply = "Xin lỗi, tôi không thể lấy dữ liệu sản phẩm ngay bây giờ."
        else:
            reply = "⚠️ Server chưa kết nối được với database."

    if not reply:
        reply = "Xin lỗi, tôi chưa hiểu ý bạn 😅"

    return jsonify({"reply": reply})



# 🚀 Chạy server Flask
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
