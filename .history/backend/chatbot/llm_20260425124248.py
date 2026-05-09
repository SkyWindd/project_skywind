import os, google.generativeai as genai
from openai import OpenAI

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """Bạn là Bi, trợ lý CSKH của cửa hàng laptop Skywind.
Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
Dựa vào thông tin sản phẩm được cung cấp để tư vấn chính xác.
Nếu không có sản phẩm phù hợp, hãy hỏi thêm nhu cầu của khách."""

def ask_gemini(user_msg, context):
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"{SYSTEM_PROMPT}\n\nThông tin sản phẩm:\n{context}\n\nKhách: {user_msg}"
    response = model.generate_content(prompt)
    return response.text

def ask_gpt(user_msg, context):
    res = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Sản phẩm:\n{context}\n\nKhách: {user_msg}"}
        ]
    )
    return res.choices[0].message.content

def get_reply(user_msg, context):
    try:
        return ask_gemini(user_msg, context)
    except Exception as e:
        print(f"Gemini lỗi: {e}, fallback GPT...")
        return ask_gpt(user_msg, context)