from flask import request, current_app
from psycopg2.extras import RealDictCursor
from db import get_connection
from datetime import datetime, date
import json, os

# ========================  
# Safe date
# ========================  
def safe_date(val):
    if isinstance(val, date):
        return val
    if isinstance(val, datetime):
        return val.date()
    if isinstance(val, str):
        for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d-%m-%Y"):
            try:
                return datetime.strptime(val, fmt).date()
            except:
                continue
    return None

# ========================  
# Build image URLs
# ========================  
def build_image_urls(images_raw):
    import json
    from flask import request

    # Convert JSON string -> list
    if isinstance(images_raw, str):
        try:
            images_raw = json.loads(images_raw)
        except:
            images_raw = []

    base_url = request.host_url.rstrip("/")
    urls = []

    for img in images_raw or []:
        if not img:
            continue

        # Fix path Windows → Linux
        img = img.replace("\\", "/")

        # Nếu ảnh có sẵn http → giữ nguyên
        if img.startswith("http://") or img.startswith("https://"):
            urls.append(img)
            continue

        # Nếu DB đã chứa "uploads/" → KHÔNG thêm lần 2
        if img.startswith("uploads/"):
            urls.append(f"{base_url}/{img}")
            continue

        # Nếu DB chỉ lưu "Dell/1/abc.png"
        urls.append(f"{base_url}/uploads/{img}")

    # Fallback nếu không có ảnh
    if not urls:
        urls.append(f"{base_url}/uploads/default.png")

    return urls

# ========================  
# FIND PRODUCTS (chatbot dùng)
# ========================  
def find_products(keyword):
    from datetime import date

    keyword = keyword.lower()

    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                p.product_id,
                p.name,
                p.slug,
                p.price AS base_price,
                b.name AS brand_name,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images,
                pr.discount_rate,
                pr.start_date,
                pr.end_date
            FROM product p
            LEFT JOIN brand b ON p.brand_id = b.brand_id
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            WHERE LOWER(b.name) ILIKE %s OR LOWER(p.name) ILIKE %s
            GROUP BY 
                p.product_id, p.name, p.slug, p.price,
                b.name, pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.product_id DESC
        """, (f"%{keyword}%", f"%{keyword}%"))

        rows = cur.fetchall()
        cur.close()
        conn.close()

        today = date.today()
        results = []

        for r in rows:
            base_price = float(r["base_price"])
            new_price = base_price
            old_price = None
            discount_percent = None

            start = safe_date(r.get("start_date")) or date.min
            end = safe_date(r.get("end_date")) or date.max

            if r.get("discount_rate") and start <= today <= end:
                rate = float(r["discount_rate"])
                old_price = base_price
                new_price = base_price * (1 - rate)
                discount_percent = round(rate * 100)

            results.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "slug": r["slug"],
                "brand": r["brand_name"],
                "price": round(new_price, 2),
                "old_price": round(old_price, 2) if old_price else None,
                "discount_percent": discount_percent,
                "images": build_image_urls(r.get("images")),
            })

        return results

    except Exception as e:
        print("❌ find_products error:", e)
        return []
