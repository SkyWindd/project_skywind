from flask import Blueprint, jsonify, request
from utils.chatbot_core import get_intent_reply



chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/api/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    msg = data.get("message", "").strip()
    reply, tag = get_intent_reply(msg)
    if reply:
        return jsonify({"reply": reply})
    return jsonify({"reply": "Xin lỗi, tôi chưa hiểu ý bạn 😅. Bạn có thể nói rõ hơn không?"})
