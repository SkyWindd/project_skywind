import os
from google import genai
from pgvector.psycopg2 import register_vector
from db import get_conn

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "models/gemini-embedding-001"
SIMILARITY_THRESHOLD = 0.3

def embed_query(query: str) -> list[float]:
    client = genai.Client(api_key=GEMINI_API_KEY)
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[query],
        config={"task_type": "RETRIEVAL_QUERY"},
    )
    return result.embeddings[0].values

def search_products_vector(query: str, limit: int = 5) -> list[dict]:
    query_vector = embed_query(query)
    conn = get_conn()
    register_vector(conn)
    cur = conn.cursor()
    cur.execute("""
        SELECT p.product_id, p.name, p.price, p.slug,
               p.cpu, p.ram, p.ssd, p.vga,
               b.name AS brand,
               i.path AS image,
               1 - (p.embedding <=> %s::vector) AS similarity
        FROM product p
        LEFT JOIN brand b ON b.brand_id = p.brand_id
        LEFT JOIN LATERAL (
            SELECT path FROM image
            WHERE product_id = p.product_id
            LIMIT 1
        ) i ON true
        WHERE p.embedding IS NOT NULL
          AND 1 - (p.embedding <=> %s::vector) > %s
        ORDER BY p.embedding <=> %s::vector
        LIMIT %s
    """, (query_vector, query_vector, SIMILARITY_THRESHOLD, query_vector, limit))
    rows = cur.fetchall()
    conn.close()
    return [
        {"product_id": r[0], "name": r[1], "price": float(r[2] or 0),
         "slug": r[3], "cpu": r[4], "ram": r[5], "ssd": r[6], "vga": r[7],
         "brand": r[8], "images": [r[9]] if r[9] else [],
         "similarity": round(float(r[10]), 3)}
        for r in rows
    ]

def search_products_fulltext(query: str, limit: int = 5) -> list[dict]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT p.product_id, p.name, p.price, p.slug,
               p.cpu, p.ram, p.ssd, p.vga,
               b.name AS brand, i.path AS image
        FROM product p
        LEFT JOIN brand b ON b.brand_id = p.brand_id
        LEFT JOIN image i ON i.product_id = p.product_id
        WHERE to_tsvector('simple', coalesce(p.name,'') || ' ' ||
              coalesce(p.cpu,'') || ' ' || coalesce(b.name,''))
              @@ plainto_tsquery('simple', %s)
        GROUP BY p.product_id, b.name, i.path
        LIMIT %s
    """, (query, limit))
    rows = cur.fetchall()
    conn.close()
    return [
        {"product_id": r[0], "name": r[1], "price": float(r[2] or 0),
         "slug": r[3], "cpu": r[4], "ram": r[5], "ssd": r[6], "vga": r[7],
         "brand": r[8], "images": [r[9]] if r[9] else [], "similarity": None}
        for r in rows
    ]

def search_products(query: str, limit: int = 5) -> list[dict]:
    words = query.strip().split()
    if len(words) <= 3:
        results = search_products_fulltext(query, limit)
        if results:
            return results
    try:
        results = search_products_vector(query, limit)
        if results:
            return results
    except Exception as e:
        print(f"Vector search lỗi: {e}, fallback fulltext...")
    return search_products_fulltext(query, limit)