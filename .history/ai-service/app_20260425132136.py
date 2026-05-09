from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import search_products
from llm import get_reply

app = Flask(__name__)
CORS(app)

@app.route("/api/message", methods=["POST"])
def message():
    data = request.json
    user_msg = data.get("message", "")

    products = search_products(user_msg)
    
    # Build context cho LLM
    context = "\n".join([
        f"- {p['name']} | {p['brand']} | CPU: {p['cpu']} | RAM: {p['ram']} | SSD: {p['ssd']} | Giá: {p['price']:,.0f}đ"
        for p in products
    ]) or "Không tìm thấy sản phẩm phù hợp."

    reply = get_reply(user_msg, context)
    return jsonify({"reply": reply, "products": products})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)