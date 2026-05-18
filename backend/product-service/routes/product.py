from flask import Blueprint, request, jsonify, current_app
from psycopg2.extras import RealDictCursor
from datetime import datetime, date
from db import get_connection
import json
import traceback
import os
import re
import unidecode

product_bp = Blueprint("product", __name__, url_prefix="/api/products")

# ========================
# 🧰 Safe date parser
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
            except Exception:
                continue
    return None

# ========================
# 🔗 Slug generator
# ========================
def generate_slug(name):
    if not name:
        return None
    name_ascii = unidecode.unidecode(name).lower()
    slug = re.sub(r'[^a-z0-9]+', '-', name_ascii).strip('-')
    return slug

def ensure_unique_slug(slug, existing_slugs):
    original_slug = slug
    i = 1
    while slug in existing_slugs:
        slug = f"{original_slug}-{i}"
        i += 1
    return slug

# ========================
# 🖼️ Build image URLs
# ========================
def build_image_urls(images_raw):
    if isinstance(images_raw, str):
        try:
            images_raw = json.loads(images_raw)
        except Exception:
            images_raw = []

    try:
        base_url = request.host_url.rstrip("/")
    except RuntimeError:
        base_url = current_app.config.get("BASE_URL", "http://localhost:5001")

    urls = []
    for img in images_raw or []:
        if not img:
            continue
        path = str(img).replace("\\", "/")
        if path.startswith("http://") or path.startswith("https://"):
            urls.append(path)
            continue
        if not path.startswith("uploads/"):
            path = f"uploads/{path}"
        urls.append(f"{base_url}/{path}")

    if not urls:
        urls = [f"{base_url}/uploads/default.png"]

    return urls

# ========================
# 🔄 Update missing slugs for old products
# ========================
def update_missing_slugs():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("SELECT slug FROM product WHERE slug IS NOT NULL")
    existing_slugs = {row["slug"] for row in cur.fetchall()}

    cur.execute("SELECT product_id, name FROM product WHERE slug IS NULL")
    products = cur.fetchall()
    updated_count = 0

    for p in products:
        slug = generate_slug(p["name"])
        slug = ensure_unique_slug(slug, existing_slugs)
        cur.execute("UPDATE product SET slug=%s WHERE product_id=%s", (slug, p["product_id"]))
        existing_slugs.add(slug)
        updated_count += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Updated {updated_count} products with missing slugs.")

# ========================
# 🛍️ GET all products
# ========================
@product_bp.route("/", methods=["GET"])
def get_products():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT 
                p.product_id, p.name, p.slug, p.price AS base_price, p.stock,
                p.brand_id, p.cpu, p.ram, p.ssd, p.vga, p.man_hinh, p.is_hot,
                pr.discount_rate, pr.start_date, pr.end_date,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            GROUP BY 
                p.product_id, p.name, p.slug, p.price, p.stock, p.brand_id,
                p.cpu, p.ram, p.ssd, p.vga, p.man_hinh, p.is_hot,
                pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.product_id;
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        today = date.today()
        products = []
        for r in rows:
            base_price = float(r.get("base_price") or 0)
            new_price = base_price
            old_price = None
            discount_percent = None
            start_date = safe_date(r.get("start_date")) or date.min
            end_date = safe_date(r.get("end_date")) or date.max
            if r.get("discount_rate") and start_date <= today <= end_date:
                rate = float(r["discount_rate"])
                old_price = base_price
                new_price = base_price * (1 - rate)
                discount_percent = round(rate * 100)

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "slug": r.get("slug"),
                "price": round(new_price, 2),
                "old_price": round(old_price, 2) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "brand_id": r["brand_id"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "man_hinh": r["man_hinh"],
                "is_hot": r["is_hot"],
                "images": build_image_urls(r.get("images")),
            })
        return jsonify(products)
    except Exception as e:
        print("❌ get_products error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ========================
# 🔍 GET product by ID
# ========================
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT p.*, COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN image i ON p.product_id = i.product_id
            WHERE p.product_id = %s
            GROUP BY p.product_id;
        """, (product_id,))
        product = cur.fetchone()
        cur.close()
        conn.close()
        if not product:
            return jsonify({"error": "Product not found"}), 404
        product["images"] = build_image_urls(product.get("images"))
        return jsonify(product)
    except Exception as e:
        print("❌ get_product_by_id error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ========================
# 🔍 GET product by slug
# ========================
@product_bp.route("/slug/<string:slug>", methods=["GET"])
def get_product_by_slug(slug):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # 🔍 Lấy thông tin sản phẩm + ảnh + khuyến mãi + thương hiệu
        cur.execute("""
            SELECT 
                p.*, 
                b.name AS brand_name, 
                promo.discount_rate,
                promo.start_date AS promo_start, 
                promo.end_date AS promo_end,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN brand b ON p.brand_id = b.brand_id
            LEFT JOIN promotion promo ON p.promo_id = promo.promo_id
            LEFT JOIN image i ON p.product_id = i.product_id
            WHERE p.slug = %s
            GROUP BY p.product_id, b.name, promo.discount_rate, promo.start_date, promo.end_date
        """, (slug,))

        product = cur.fetchone()

        if not product:
            cur.close()
            conn.close()
            return jsonify({"error": "Không tìm thấy sản phẩm"}), 404

        # ✅ Thêm phần tạo thông số kỹ thuật ngay tại đây
        specs = []
        fields = {
            "CPU": product.get("cpu"),
            "RAM": product.get("ram"),
            "Ổ cứng (SSD)": product.get("ssd"),
            "Card đồ họa": product.get("vga"),
            "Màn hình": product.get("man_hinh"),
        }
        for name, value in fields.items():
            if value:
                specs.append({"spec_name": name, "spec_value": value})

        cur.close()
        conn.close()

        # 🧮 Tính giá khuyến mãi
        today = date.today()
        base_price = float(product.get("price") or 0)
        discount_rate = product.get("discount_rate")
        promo_start = safe_date(product.get("promo_start")) or date.min
        promo_end = safe_date(product.get("promo_end")) or date.max

        old_price = base_price
        new_price = base_price
        discount_percent = None

        if discount_rate and promo_start <= today <= promo_end:
            rate = float(discount_rate)
            new_price = base_price * (1 - rate)
            discount_percent = round(rate * 100)

        # 🖼️ Xử lý hình ảnh + specs
        product["images"] = build_image_urls(product.get("images"))
        product["specifications"] = specs
        product["price"] = round(new_price, 2)
        product["old_price"] = round(old_price, 2)
        product["discount_percent"] = discount_percent

        return jsonify(product)

    except Exception as e:
        print("❌ Lỗi khi lấy chi tiết sản phẩm:", e)
        traceback.print_exc()
        return jsonify({"error": "Lỗi server"}), 500

# ========================
# 🔍 FILTER products
# ========================
@product_bp.route("/filter", methods=["GET"])
def filter_products():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        brand = request.args.getlist("brand")
        cpu = request.args.getlist("cpu")
        vga = request.args.getlist("vga")
        ram = request.args.getlist("ram")
        ssd = request.args.getlist("ssd")
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)
        in_stock = request.args.get("in_stock")
        is_hot = request.args.get("is_hot")

        query = """
            SELECT 
                p.product_id, p.name, p.slug, p.price AS base_price, p.stock,
                b.name AS brand_name, p.cpu, p.ram, p.ssd, p.vga, p.man_hinh, p.is_hot,
                pr.discount_rate, pr.start_date, pr.end_date,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM product p
            LEFT JOIN brand b ON p.brand_id = b.brand_id
            LEFT JOIN image i ON p.product_id = i.product_id
            LEFT JOIN promotion pr ON p.promo_id = pr.promo_id
            WHERE 1=1
        """
        params = []

        def add_multi_filter(column, values):
            nonlocal query, params
            if values:
                conds = [f"LOWER({column}) ILIKE %s" for _ in values]
                query += " AND (" + " OR ".join(conds) + ")"
                params.extend([f"%{v.lower()}%" for v in values])

        add_multi_filter("b.name", brand)
        add_multi_filter("p.cpu", cpu)
        add_multi_filter("p.vga", vga)
        add_multi_filter("p.ram", ram)
        add_multi_filter("p.ssd", ssd)

        if min_price is not None:
            query += " AND p.price >= %s"
            params.append(min_price)
        if max_price is not None:
            query += " AND p.price <= %s"
            params.append(max_price)
        if in_stock == "true":
            query += " AND p.stock > 0"
        if is_hot is not None:
            is_hot_bool = is_hot.strip().lower() in ["1", "true", "yes"]
            query += " AND p.is_hot = %s"
            params.append(is_hot_bool)

        query += """
            GROUP BY 
                p.product_id, p.name, p.slug, p.price, p.stock, b.name,
                p.cpu, p.ram, p.ssd, p.vga, p.man_hinh, p.is_hot,
                pr.discount_rate, pr.start_date, pr.end_date
            ORDER BY p.price ASC
        """

        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        today = date.today()
        products = []
        for r in rows:
            base_price = float(r.get("base_price") or 0)
            new_price = base_price
            old_price = None
            discount_percent = None
            start_date = safe_date(r.get("start_date")) or date.min
            end_date = safe_date(r.get("end_date")) or date.max
            if r.get("discount_rate") and start_date <= today <= end_date:
                rate = float(r["discount_rate"])
                old_price = base_price
                new_price = base_price * (1 - rate)
                discount_percent = round(rate * 100)

            products.append({
                "product_id": r["product_id"],
                "name": r["name"],
                "slug": r.get("slug"),
                "brand": r.get("brand_name"),
                "price": round(new_price, 2),
                "old_price": round(old_price, 2) if old_price else None,
                "discount_percent": discount_percent,
                "stock": r["stock"],
                "cpu": r["cpu"],
                "ram": r["ram"],
                "ssd": r["ssd"],
                "vga": r["vga"],
                "man_hinh": r["man_hinh"],
                "is_hot": r["is_hot"],
                "images": build_image_urls(r.get("images")),
            })

        return jsonify(products)
    except Exception as e:
        print("❌ Filter error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ========================
# ➕ ADD product
# ========================
@product_bp.route("/", methods=["POST"])
def add_product():
    try:
        data = request.form.to_dict()
        files = request.files.getlist("images")

        name = data.get("name")
        slug = generate_slug(name)

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Kiểm tra trùng slug
        cur.execute("SELECT slug FROM product WHERE slug IS NOT NULL")
        existing_slugs = {row["slug"] for row in cur.fetchall()}
        slug = ensure_unique_slug(slug, existing_slugs)

        price = float(data.get("price") or 0)
        stock = int(data.get("stock") or 0)

        brand_id = data.get("brand_id") or None
        promo_id = data.get("promo_id") or None

        cpu = data.get("cpu")
        ram = data.get("ram")
        ssd = data.get("ssd")
        vga = data.get("vga")
        man_hinh = data.get("man_hinh")

        is_hot = str(
            data.get("is_hot", "false")
        ).lower() in ["true", "1"]
        cur.execute("""
            INSERT INTO product 
                (name, slug, price, stock, brand_id, promo_id, cpu, ram, ssd, vga, man_hinh, is_hot)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING product_id
        """, (name, slug, price, stock, brand_id, promo_id, cpu, ram, ssd, vga, man_hinh, is_hot))
        product_id = cur.fetchone()["product_id"]

        upload_folder = os.path.join(current_app.root_path, "static", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        img_urls = []

        for f in files:
            filename = f"{product_id}_{f.filename}"
            save_path = os.path.join(upload_folder, filename)
            f.save(save_path)
            rel_path = f"uploads/{filename}"
            cur.execute("INSERT INTO image (product_id, path) VALUES (%s, %s)", (product_id, rel_path))
            img_urls.append(rel_path)

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Product added successfully",
            "product_id": product_id,
            "slug": slug,
            "images": build_image_urls(img_urls)
        }), 201
    except Exception as e:
        print("❌ add_product error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ========================
# ✏️ UPDATE product
# ========================
@product_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        data = request.form.to_dict()
        files = request.files.getlist("images")
        if not data and request.is_json:
            data = request.get_json()

        fields = []
        values = []

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Cập nhật thông tin cơ bản
        for key in ["name", "price", "stock", "brand_id", "cpu", "ram", "ssd", "vga", "man_hinh", "is_hot"]:
            if key in data:
                val = data[key]
                if key == "is_hot":
                    val = str(val).lower() in ["true", "1"]
                fields.append(f"{key}=%s")
                values.append(val)
                if key == "name":
                    slug = generate_slug(val)
                    cur.execute("SELECT slug FROM product WHERE slug IS NOT NULL AND product_id != %s", (product_id,))
                    existing_slugs = {row["slug"] for row in cur.fetchall()}
                    slug = ensure_unique_slug(slug, existing_slugs)
                    fields.append("slug=%s")
                    values.append(slug)

        if fields:
            query = f"UPDATE product SET {', '.join(fields)} WHERE product_id=%s"
            values.append(product_id)
            cur.execute(query, tuple(values))

        # Cập nhật ảnh nếu có
        if files:
            cur.execute("DELETE FROM image WHERE product_id = %s", (product_id,))
            upload_folder = os.path.join(current_app.root_path, "static", "uploads")
            os.makedirs(upload_folder, exist_ok=True)
            for f in files:
                filename = f"{product_id}_{f.filename}"
                save_path = os.path.join(upload_folder, filename)
                f.save(save_path)
                rel_path = f"uploads/{filename}"
                cur.execute("INSERT INTO image (product_id, path) VALUES (%s, %s)", (product_id, rel_path))

        # Cập nhật khuyến mãi nếu có discount_percent
        if "discount_percent" in data:
            discount_percent = float(data.get("discount_percent") or 0)
            discount_rate = discount_percent / 100
            cur.execute("SELECT promo_id FROM product WHERE product_id = %s", (product_id,))
            promo_row = cur.fetchone()
            if promo_row and promo_row["promo_id"]:
                promo_id = promo_row["promo_id"]
                cur.execute("""
                    UPDATE promotion
                    SET discount_rate = %s, description = %s
                    WHERE promo_id = %s
                """, (discount_rate, f"Giảm {discount_percent}% cập nhật từ Admin", promo_id))
            else:
                cur.execute("""
                    INSERT INTO promotion (description, discount_rate, start_date, end_date)
                    VALUES (%s, %s, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
                    RETURNING promo_id
                """, (f"Giảm {discount_percent}% tự động", discount_rate))
                new_promo_id = cur.fetchone()["promo_id"]
                cur.execute("UPDATE product SET promo_id = %s WHERE product_id = %s", (new_promo_id, product_id))

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "✅ Product and promotion updated successfully!"}), 200
    except Exception as e:
        print("❌ update_product error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@product_bp.route("/search", methods=["GET"])
def search_products():
    try:
        query = request.args.get("query", "").strip()
        if not query:
            return jsonify({"success": False, "message": "Thiếu từ khóa tìm kiếm"}), 400

        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # 🔥 SỬA bảng "products" → "product"
        # 🔥 SỬA cột "id" → "product_id"
        cursor.execute("""
            SELECT 
                product_id, name, price, description, slug, brand_id
            FROM product 
            WHERE name ILIKE %s
            ORDER BY product_id DESC
        """, (f"%{query}%",))

        products = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "data": products}), 200

    except Exception as e:
        print("❌ Lỗi tìm kiếm sản phẩm:", e)
        return jsonify({"success": False, "message": "Lỗi server"}), 500


def find_products(keyword):
    from db import get_connection
    from psycopg2.extras import RealDictCursor
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
            base_price = float(r.get("base_price") or 0)
            new_price = base_price
            old_price = None
            discount_percent = None

            start_date = safe_date(r.get("start_date")) or date.min
            end_date = safe_date(r.get("end_date")) or date.max

            if r.get("discount_rate") and start_date <= today <= end_date:
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
                "images": build_image_urls(r.get("images"))
            })

        return results

    except Exception as e:
        print("❌ find_products error:", e)
        return []
    
# ========================
# 🗑️ DELETE product
# ========================
@product_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:

        conn = get_connection()
        cur = conn.cursor()

        # 🔥 XÓA IMAGE
        cur.execute(
            "DELETE FROM image WHERE product_id = %s",
            (product_id,)
        )

        # 🔥 XÓA PRODUCT
        cur.execute(
            "DELETE FROM product WHERE product_id = %s",
            (product_id,)
        )

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "success": True
        }), 200

    except Exception as e:

        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500