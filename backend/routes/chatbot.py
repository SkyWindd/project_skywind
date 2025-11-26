from flask import Blueprint, jsonify, request
from utils.chatbot_core import get_intent_reply
from utils.productservice import find_products

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/api/message", methods=["POST", "OPTIONS"])
def chat_message():

    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json()
    msg = data.get("message", "").strip()

    reply, tag, keyword = get_intent_reply(msg)

    # Intent tìm sản phẩm trong DB
    if tag == "product_info":
        products = find_products(keyword)

        return jsonify({
            "reply": reply,
            "products": products
        })

    # Intent bình thường
    return jsonify({
        "reply": reply,
        "tag": tag
    })
