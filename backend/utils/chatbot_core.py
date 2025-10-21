import json, os, random

if os.path.exists("intents.json"):
    with open("intents.json", "r", encoding="utf-8") as f:
        intents = json.load(f).get("intents", [])
else:
    intents = []

def get_intent_reply(user_input: str):
    user_input = user_input.lower()
    for intent in intents:
        for pattern in intent["patterns"]:
            if pattern.lower() in user_input:
                return random.choice(intent["responses"])
    return "Xin lỗi, tôi chưa hiểu ý bạn 😅. Bạn có thể nói rõ hơn không?"
