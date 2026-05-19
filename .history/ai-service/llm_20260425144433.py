import os
from google import genai
from openai import OpenAI

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """Bạn là Bi, trợ lý CSKH của cửa hàng laptop Skywind.
Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
Dựa vào thông tin sản phẩm được cung cấp để tư vấn chính xác.
Nếu không có sản phẩm phù hợp, hãy hỏi thêm nhu cầu của khách."""

def ask_gemini(user_msg, context):
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt = f"{SYSTEM_PROMPT}\n\nThông tin sản phẩm:\n{context}\n\nKhách: {user_msg}"
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text

def get_reply(user_msg, context):
    return ask_gemini(user_msg, context)