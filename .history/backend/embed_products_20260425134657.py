"""
BƯỚC 1B: Tạo embedding cho toàn bộ sản phẩm
Chạy 1 lần duy nhất để nạp vector vào database.
 
Cài đặt trước:
  pip install google-generativeai psycopg2-binary pgvector
 
Chạy:
  python embed_products.py
"""
 
import os
import time
import psycopg2
from pgvector.psycopg2 import register_vector
 
# ── Cấu hình ────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-key-here")
DB_HOST        = os.getenv("DB_HOST", "localhost")
DB_PORT        = int(os.getenv("DB_PORT", "54321"))   # port mapping trong docker-compose
DB_NAME        = os.getenv("DB_NAME", "skywind")
DB_USER        = os.getenv("DB_USER", "postgres")
DB_PASSWORD    = os.getenv("DB_PASSWORD", "12345")
 
EMBEDDING_MODEL = "models/text-embedding-004"  # 768 chiều, miễn phí
BATCH_SIZE      = 20   # Gemini cho phép embed 20 text/lần
SLEEP_BETWEEN   = 1.0  # giây, tránh rate limit
# ────────────────────────────────────────────────────────────

 
 
def build_product_text(row: dict) -> str:
    """Ghép các trường thành 1 đoạn text để embed."""
    parts = [
        row.get("name", ""),
        row.get("brand", ""),
        f"CPU {row.get('cpu', '')}",
        f"RAM {row.get('ram', '')}",
        f"SSD {row.get('ssd', '')}",
        f"VGA {row.get('vga', '')}",
        f"Giá {row.get('price', 0):,.0f} đồng",
    ]
    return " | ".join(p for p in parts if p.strip(" |"))
 
 
def embed_texts(texts: list[str]) -> list[list[float]]:
    """Gọi Gemini API để embed 1 batch."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=texts,
        task_type="retrieval_document",
    )
    return result["embedding"]
 
 
def main():
    # Kết nối DB
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT,
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )
    register_vector(conn)
    cur = conn.cursor()
 
    # Lấy tất cả sản phẩm chưa có embedding
    cur.execute("""
        SELECT p.product_id, p.name, p.price, p.cpu, p.ram, p.ssd, p.vga,
               b.name AS brand
        FROM product p
        LEFT JOIN brand b ON b.brand_id = p.brand_id
        WHERE p.embedding IS NULL
        ORDER BY p.product_id
    """)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    products = [dict(zip(columns, row)) for row in rows]
 
    total = len(products)
    if total == 0:
        print("✅ Tất cả sản phẩm đã có embedding rồi!")
        return
 
    print(f"📦 Tìm thấy {total} sản phẩm cần embed...")
 
    # Xử lý theo batch
    for i in range(0, total, BATCH_SIZE):
        batch = products[i : i + BATCH_SIZE]
        texts = [build_product_text(p) for p in batch]
 
        try:
            vectors = embed_texts(texts)
        except Exception as e:
            print(f"  ⚠️  Lỗi batch {i}-{i+len(batch)}: {e}")
            time.sleep(5)
            continue
 
        # Cập nhật từng sản phẩm
        for product, vector in zip(batch, vectors):
            cur.execute(
                "UPDATE product SET embedding = %s WHERE product_id = %s",
                (vector, product["product_id"])
            )
 
        conn.commit()
        done = min(i + BATCH_SIZE, total)
        print(f"  ✅ {done}/{total} sản phẩm đã được embed")
        time.sleep(SLEEP_BETWEEN)
 
    cur.close()
    conn.close()
    print("\n🎉 Hoàn thành! Toàn bộ sản phẩm đã có embedding.")
 
 
if __name__ == "__main__":
    main()