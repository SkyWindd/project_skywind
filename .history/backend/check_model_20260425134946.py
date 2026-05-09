    from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
for m in client.models.list():
    if "embed" in m.name.lower():
        print(m.name)