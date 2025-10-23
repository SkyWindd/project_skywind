from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from datetime import datetime
from db import get_connection

product_bp = Blueprint("product", __name__)

# ========================
# 🛍️ Lấy danh sách sản phẩm
# ========================
@product_bp.route("/api/product", methods=["GET"])
def get_products():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                p.product_id,
                p.name,
                p.price AS base_price,
                p.stock,
                p.brand_id,
                p.cpu,
                p.ram,
                p.ssd,
                p.vga,
                p.man_hinh,
                p.is_hot,  
                pr.discount_rate,
                pr.start_date,
                pr.end_date,
                COALESCE(json_agg(i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            GROUP BY 
                p.product_id, pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.product_id;
        """)

        rows = cur.fetchall()
        cur.close()
        conn.close()

        today = datetime.now().date()
        products = []

        for r in rows:
            base_price = float(r["base_price"] or 0)
            new_price = base_price
            old_price = None
            discount_percent = None

            if r["discount_rate"] and r["start_date"] and r["end_date"]:
                if r["start_date"] <= today <= r["end_date"]:
                    old_price = base_price
                    new_price = base_price * (1 - float(r["discount_rate"]))
                    discount_percent = round(float(r["discount_rate"]) * 100)

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "price": round(new_price),
                "old_price": round(old_price) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "brand_id": r["brand_id"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "man_hinh": r["man_hinh"],
                "images": ["http://localhost:5000/" + str(img).replace("\\", "/")
                for img in r["images"] if img],
            })

        return jsonify(products)

    except Exception as e:
        print("❌ Database error:", e)
        return jsonify({"error": str(e)}), 500


@product_bp.route("/api/product/filter", methods=["GET"])
def filter_products():
    print("🔥 Filter API called!")
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # 🧩 Lấy các tham số từ query string
        brand = request.args.getlist("brand")
        cpu = request.args.getlist("cpu")
        vga = request.args.getlist("vga")
        ram = request.args.getlist("ram")
        ssd = request.args.getlist("ssd")
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)
        in_stock = request.args.get("in_stock")  # ✅ thêm dòng này

        # 🧩 Câu SQL cơ bản
        query = """
            SELECT 
                p.product_id,
                p.name,
                p.price,
                p.stock,
                b.name AS brand_name,
                p.cpu,
                p.ram,
                p.ssd,
                p.vga,
                pr.discount_rate,
                pr.start_date,
                pr.end_date,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN brand b ON p.brand_id = b.brand_id
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            WHERE 1=1
        """

        params = []

        # 🧩 Hàm thêm nhiều điều kiện (lọc nhiều giá trị)
        def add_multi_filter(column, values):
            nonlocal query, params
            if values:
                placeholders = []
                for val in values:
                    placeholders.append(f"LOWER({column}) ILIKE %s")
                    params.append(f"%{val.lower()}%")
                query += " AND (" + " OR ".join(placeholders) + ")"

        add_multi_filter("b.name", brand)
        add_multi_filter("p.cpu", cpu)
        add_multi_filter("p.vga", vga)
        add_multi_filter("p.ram", ram)
        add_multi_filter("p.ssd", ssd)

        # 🧩 Lọc theo giá
        if min_price is not None:
            query += " AND p.price >= %s"
            params.append(min_price)
        if max_price is not None:
            query += " AND p.price <= %s"
            params.append(max_price)

        # 🧩 ✅ Lọc theo còn hàng
        if in_stock == "true":
            query += " AND p.stock > 0"

        query += """
            GROUP BY p.product_id, b.name, pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.price ASC
        """

        cur.execute(query, params)
        rows = cur.fetchall()

        today = datetime.now().date()
        products = []

        for r in rows:
            base_price = float(r["price"] or 0)
            new_price = base_price
            old_price = None
            discount_percent = None

            # ✅ Kiểm tra và chuyển đổi ngày khuyến mãi an toàn
            start_date = r.get("start_date")
            end_date = r.get("end_date")

            if start_date and end_date and r.get("discount_rate"):
                if isinstance(start_date, datetime):
                    start_date = start_date.date()
                if isinstance(end_date, datetime):
                    end_date = end_date.date()

                if start_date <= today <= end_date:
                    old_price = base_price
                    new_price = base_price * (1 - float(r["discount_rate"]))
                    discount_percent = round(float(r["discount_rate"]) * 100)

            # ✅ Xử lý danh sách ảnh an toàn
            images_raw = r["images"]
            if isinstance(images_raw, str):
                import json
                try:
                    images_raw = json.loads(images_raw)
                except Exception:
                    images_raw = []
            elif not isinstance(images_raw, list):
                images_raw = []

            images = [
               "http://localhost:5000/" + str(img).replace("\\", "/")
                for img in images_raw if img
            ]

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "brand": r["brand_name"],
                "price": round(new_price),
                "old_price": round(old_price) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "images": images
            })

        cur.close()
        conn.close()
        return jsonify(products)

    except Exception as e:
        import traceback
        print("❌ Filter error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
