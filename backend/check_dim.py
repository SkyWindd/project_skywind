from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
result = client.models.embed_content(
    model="models/gemini-embedding-2",
    contents=["test"],
)
print("So chieu:", len(result.embeddings[0].values))