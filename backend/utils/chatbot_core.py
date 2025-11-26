import json, os, random

# Load intents.json
if os.path.exists("intents.json"):
    with open("intents.json", "r", encoding="utf-8") as f:
        intents = json.load(f).get("intents", [])
else:
    intents = []

def get_intent_reply(user_input: str):
    user_input = user_input.lower().strip()

    for intent in intents:
        for pattern in intent.get("patterns", []):
            if pattern.lower() in user_input:
                reply = random.choice(intent.get("responses", []))
                tag = intent.get("tag", None)
                keyword = user_input     # dùng cả câu làm keyword tìm sản phẩm
                return reply, tag, keyword

    # ❗ RẤT QUAN TRỌNG: luôn trả về 3 giá trị
    return "Xin lỗi, tôi chưa hiểu ý bạn 😅.", "unknown", user_input
