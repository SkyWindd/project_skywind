from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.utils import secure_filename
import os, unicodedata, re, json, random
from datetime import datetime
from rapidfuzz import fuzz
from dotenv import load_dotenv

# ========================
# ⚙️ Flask config
# ========================
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ========================
# 🔗 Database connection
# ========================
def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="skywind",
        user="postgres",
        password="12345",
        port=54321
    )


# ========================
# 🔤 Remove Vietnamese + ký tự đặc biệt
# ========================
def clean_filename(text):
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("utf-8")
    text = re.sub(r"[^a-zA-Z0-9._-]", "_", text)
    return text.lower()


# ========================
# 🧠 Load intents
# ========================
if os.path.exists("intents.json"):
    with open("intents.json", "r", encoding="utf-8") as f:
        intents = json.load(f).get("intents", [])
else:
    intents = []


# ========================
# 📸 Serve uploaded images
# ========================
@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ========================
# 📥 Import ảnh tự động
# ========================
@app.route("/api/import_images", methods=["POST"])
def import_images():
    base_folder = UPLOAD_FOLDER
    try:
        conn = get_connection()
        cur = conn.cursor()
        count = 0

        for root, _, files in os.walk(base_folder):
            for file in files:
                if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
                    new_name = clean_filename(file)
                    old_path = os.path.join(root, file)
                    new_path = os.path.join(root, new_name)
                    if old_path != new_path:
                        os.rename(old_path, new_path)

                    relative_path = os.path.relpath(new_path, UPLOAD_FOLDER).replace("\\", "/")
                    parts = relative_path.split("/")
                    product_name_guess = parts[0]

                    cur.execute("SELECT product_id FROM product_new WHERE name ILIKE %s LIMIT 1;", (f"%{product_name_guess}%",))
                    product = cur.fetchone()
                    if not product:
                        continue

                    product_id = product[0]
                    image_url = f"uploads/{relative_path}"

                    cur.execute(
                        "INSERT INTO image (product_id, name, path) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;",
                        (product_id, new_name, image_url)
                    )
                    count += 1

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": f"Đã import {count} ảnh vào DB ✅"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Route test
@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running 🚀"})


# ========================
# 🛍️ Lấy danh sách sản phẩm
# ========================
@app.route("/api/products", methods=["GET"])   # <— ✅ Route chuẩn cho frontend
@app.route("/api/product_new", methods=["GET"])  # <— alias tương thích
def get_products():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                p.product_id,
                p.name,
                p.price AS base_price,
                p.stock,
                p.brand_id,
                p.promo_id,
                p.cpu,
                p.ram,
                p.ssd,
                p.vga,
                p.man_hinh,
                pr.discount_rate,
                pr.start_date,
                pr.end_date,
                COALESCE(json_agg(i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product_new p
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            GROUP BY 
                p.product_id, pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.product_id;
        """)

        rows = cur.fetchall()
        cur.close()
        conn.close()

        today = datetime.now().date()
        products = []

        for r in rows:
            base_price = float(r["base_price"]) if r["base_price"] else 0
            old_price = None
            new_price = base_price

            if r["discount_rate"] and r["start_date"] and r["end_date"]:
                if r["start_date"] <= today <= r["end_date"]:
                    discount = float(r["discount_rate"])
                    old_price = base_price
                    new_price = base_price * (1 - discount)

            discount_percent = None
            if old_price and old_price > new_price:
                discount_percent = round(((old_price - new_price) / old_price) * 100)

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "price": round(new_price),
                "old_price": round(old_price) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "brand_id": r["brand_id"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "man_hinh": r["man_hinh"],
                "images": [f"http://127.0.0.1:5000/{img}" for img in r["images"]],
            })

        return jsonify(products)

    except Exception as e:
        print("❌ Database error:", e)
        return jsonify({"error": str(e)}), 500


# ========================
# 🧩 Bộ lọc sản phẩm
# ========================
@app.route("/api/products/filter", methods=["GET"])
def filter_products():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Nhận params
        brand = request.args.getlist("brand") or split_if_needed(request.args.get("brand"))
        cpu = request.args.getlist("cpu") or split_if_needed(request.args.get("cpu"))
        vga = request.args.getlist("vga") or split_if_needed(request.args.get("vga"))
        ram = request.args.getlist("ram") or split_if_needed(request.args.get("ram"))
        ssd = request.args.getlist("ssd") or split_if_needed(request.args.get("ssd"))
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)

        query = """
            SELECT 
                p.product_id,
                p.name,
                p.price,
                p.stock,
                b.name AS brand_name,
                p.cpu,
                p.ram,
                p.ssd,
                p.vga,
                pr.discount_rate,
                pr.start_date,
                pr.end_date,
                COALESCE(
                    json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL),
                    '[]'
                ) AS images
            FROM product_new p
            LEFT JOIN brand b ON p.brand_id = b.brand_id
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            WHERE 1=1
        """

        params = []

        def add_multi_filter(column, values):
            nonlocal query, params
            if values:
                placeholders = []
                for val in values:
                    placeholders.append("LOWER(" + column + ") ILIKE %s")
                    params.append(f"%{val.lower()}%")
                query += " AND (" + " OR ".join(placeholders) + ")"

        add_multi_filter("b.name", brand)
        add_multi_filter("p.cpu", cpu)
        add_multi_filter("p.vga", vga)
        add_multi_filter("p.ram", ram)
        add_multi_filter("p.ssd", ssd)

        if min_price is not None:
            query += " AND p.price >= %s"
            params.append(min_price)
        if max_price is not None:
            query += " AND p.price <= %s"
            params.append(max_price)

        query += """
            GROUP BY p.product_id, b.name, pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.price ASC
        """

        cur.execute(query, params)
        rows = cur.fetchall()

        today = datetime.now().date()
        products = []
        for r in rows:
            base_price = float(r["price"] or 0)
            new_price = base_price
            old_price = None
            discount_percent = None

            if r["discount_rate"] and r["start_date"] and r["end_date"]:
                if r["start_date"] <= today <= r["end_date"]:
                    old_price = base_price
                    discount_rate = float(r["discount_rate"])
                    new_price = base_price * (1 - discount_rate)
                    discount_percent = round(discount_rate * 100)

            images = []
            if isinstance(r["images"], list):
                for img in r["images"]:
                    if img:
                        img = str(img).replace("\\", "/")
                        if not img.startswith("http"):
                            img = f"http://127.0.0.1:5000/{img}"
                        images.append(img)

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "brand": r["brand_name"],
                "price": round(new_price),
                "old_price": round(old_price) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "images": images
            })

        cur.close()
        conn.close()
        return jsonify(products)

    except Exception as e:
        print("❌ Filter error:", e)
        return jsonify({"error": str(e)}), 500


# ========================
# 🔹 Helper
# ========================
def split_if_needed(value):
    if not value:
        return []
    if "," in value:
        return [v.strip() for v in value.split(",")]
    return [value]


# ========================
# 💬 Chatbot
# ========================
def get_intent_reply(user_input):
    user_input = user_input.lower()
    for intent in intents:
        for pattern in intent["patterns"]:
            if pattern in user_input:
                return random.choice(intent["responses"]), intent["tag"]
    return None, None


@app.route("/api/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    msg = data.get("message", "").strip()

    intent_reply, tag = get_intent_reply(msg)

    if intent_reply:
        return jsonify({"reply": intent_reply})
    return jsonify({"reply": "Xin lỗi, tôi chưa hiểu ý bạn 😅. Bạn có thể nói rõ hơn không?"})


# ========================
# 🏁 Run Server
# ========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", 5000)))
