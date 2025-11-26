import json, os, random, re, unicodedata

def normalize(text: str) -> str:
    text = text.lower()
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9 ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

BRANDS = ["asus", "acer", "dell", "msi", "hp", "lenovo", "macbook"]

USAGE_KEYWORDS = {
    "gaming": [
        "gaming", "game", "choi game", "chơi game", "chiến game",
        "pubg", "valorant", "lien minh", "lmht", "fo4"
    ],
    "office": [
        "van phong", "văn phòng", "office", "word", "excel", "ppt",
        "hoc online", "học online", "sinh vien", "sinh viên",
        "hoc tap", "học tập"
    ],
    "powerful": [
        "manh", "mạnh", "cau hinh cao", "cấu hình cao",
        "khung", "khủng", "do hoa", "đồ họa", "photoshop",
        "premiere", "render", "ai", "edit video"
    ],
    "basic": [
        "yeu", "yếu", "gia re", "giá rẻ", "co ban", "cơ bản",
        "du dung", "đủ dùng", "luot web", "lướt web", "facebook"
    ],
}

USAGE_TEXT_VI = {
    "gaming": "chơi game",
    "office": "văn phòng / học tập",
    "powerful": "đồ họa / cấu hình mạnh",
    "basic": "nhu cầu cơ bản, giá rẻ",
}

if os.path.exists("intents.json"):
    with open("intents.json", "r", encoding="utf-8") as f:
        intents = json.load(f).get("intents", [])
else:
    intents = []

LAST_BRAND = None  # nhớ brand gần nhất


def detect_brand(text_norm: str):
    global LAST_BRAND
    for b in BRANDS:
        if b in text_norm:
            LAST_BRAND = b
            return b
    return None


def detect_usage(text_norm: str):
    for usage, keys in USAGE_KEYWORDS.items():
        for k in keys:
            if k in text_norm:
                return usage
    return None


def build_search_keyword(brand: str | None, usage: str | None) -> str:
    # Ghép keyword cho DB
    if usage == "gaming":
        base = "gaming"
    elif usage == "office":
        base = "van phong"
    elif usage == "powerful":
        base = "i7 i9 rtx"
    elif usage == "basic":
        base = "i3 pentium"
    else:
        base = ""

    if brand and base:
        return f"{brand} {base}"
    if brand:
        return brand
    if base:
        return base
    return ""


def get_intent_reply(user_input: str):
    global LAST_BRAND

    original = user_input.strip()
    text_norm = normalize(user_input)

    # 1) Intent trong intents.json (chào hỏi, giờ mở cửa, ship, ...)
    for intent in intents:
        for pattern in intent.get("patterns", []):
            if normalize(pattern) in text_norm:
                reply = random.choice(intent.get("responses", []))
                return reply, intent.get("tag"), original

    # 2) Nhận diện brand & usage nâng cao
    brand = detect_brand(text_norm)        # asus / dell / ...
    usage = detect_usage(text_norm)        # gaming / office / powerful / basic

    if usage:
        kw = build_search_keyword(brand, usage)
        usage_vi = USAGE_TEXT_VI.get(usage, usage)

        if brand:
            reply = f"Bạn cần laptop {brand.capitalize()} dùng cho {usage_vi} đúng không? 😊"
        else:
            reply = f"Bạn cần laptop dùng cho {usage_vi} đúng không? 😊"

        # Dùng luôn product_info để backend vẫn gọi find_products(kw)
        return reply, "product_info", kw or original

    # 3) Chỉ có brand (giống logic cũ)
    if brand:
        reply = f"Bạn muốn xem laptop {brand.capitalize()} đúng không? 😊"
        return reply, "product_info", brand

    # 4) Một số từ xác nhận như 'ok', 'đúng rồi' → dùng lại brand trước
    if any(w in text_norm for w in ["dung", "đúng", "ok", "okay", "yes", "duoc", "được", "chuan", "chuẩn", "uh", "ừ"]):
        if LAST_BRAND:
            kw = LAST_BRAND
            reply = f"Mình lấy giúp bạn các mẫu laptop {LAST_BRAND.capitalize()} nhé! 👇"
            return reply, "product_info", kw

    # 5) Không hiểu
    return "Xin lỗi, tôi chưa hiểu ý bạn 😅.", "unknown", original
