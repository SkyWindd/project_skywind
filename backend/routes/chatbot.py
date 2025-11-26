from flask import Blueprint, jsonify, request
from utils.chatbot_core import get_intent_reply
from utils.productservice import find_products

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/api/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    msg = data.get("message", "").strip()

    reply, tag, keyword = get_intent_reply(msg)

    # 🔥 Nếu là intent tìm sản phẩm → query DB
    if tag == "product_info":
        products = find_products(keyword)

        if len(products) == 0:
            return jsonify({
                "reply": "Mình không tìm thấy sản phẩm nào phù hợp 😢",
                "products": []
            })

        return jsonify({
            "reply": reply,
            "products": products  # list sản phẩm (name, price, image, desc)
        })

    # 🔹 Các intent khác (bình thường)
    return jsonify({
        "reply": reply,
        "tag": tag
    })
