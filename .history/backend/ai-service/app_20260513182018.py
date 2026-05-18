from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import search_products
from llm import get_reply

app = Flask(__name__)
CORS(app)

@app.route("/api/search", methods=["POST"])
def search():
    data = request.json
    user_msg = data.get("message", "")
    products = search_products(user_msg)
    context = "\n".join([
        f"- {p['name']} | {p['brand']} | CPU: {p['cpu']} | RAM: {p['ram']} | SSD: {p['ssd']} | Giá: {p['price']:,.0f}đ"
        for p in products
    ]) or "Không tìm thấy sản phẩm phù hợp."
    
    return jsonify({
        "context": context,
        "products": products  # ← đã có sẵn
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)