from db import get_conn

def search_products(query: str, limit=3):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT p.product_id, p.name, p.price, p.slug,
               p.cpu, p.ram, p.ssd, p.vga,
               b.name AS brand,
               i.path AS image
        FROM product p
        LEFT JOIN brand b ON b.brand_id = p.brand_id
        LEFT JOIN image i ON i.product_id = p.product_id
        WHERE to_tsvector('simple', coalesce(p.name,'a') || ' ' ||
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
         "brand": r[8], "images": [r[9]] if r[9] else []}
        for r in rows
    ]