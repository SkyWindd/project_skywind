from flask import Blueprint, request, jsonify, current_app
from psycopg2.extras import RealDictCursor
from db import get_connection
import traceback
import json

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")

# ========================
# Build image URLs
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
        base_url = current_app.config.get("BASE_URL", "http://localhost:5000")

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
# Lấy giỏ hàng của user
# ========================
@cart_bp.route("/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
        cart = cur.fetchone()
        if not cart:
            return jsonify({"items": []})

        cart_id = cart["cart_id"]

        cur.execute("""
            SELECT 
                p.product_id, p.name, p.price, p.stock, ci.quantity,
                COALESCE(json_agg(DISTINCT i.path) FILTER (WHERE i.path IS NOT NULL), '[]') AS images
            FROM cartitem ci
            JOIN product p ON ci.product_id = p.product_id
            LEFT JOIN image i ON i.product_id = p.product_id
            WHERE ci.cart_id = %s
            GROUP BY p.product_id, p.name, p.price, p.stock, ci.quantity
            ORDER BY p.product_id
        """, (cart_id,))

        items = cur.fetchall()
        for item in items:
            item["images"] = build_image_urls(item.get("images"))
            item["image"] = item["images"][0] if item["images"] else f"{request.host_url}uploads/default.png"

        cur.close()
        conn.close()
        return jsonify({"items": items})

    except Exception as e:
        print("❌ Lỗi trong get_cart:", e)
        traceback.print_exc()
        return jsonify({"items": []})

# ========================
# Thêm sản phẩm vào giỏ (không 400 khi vượt stock)
# ========================
@cart_bp.route("/add", methods=["POST"])
def add_to_cart():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        product_id = data.get("product_id")
        quantity = int(data.get("quantity", 1))

        if not user_id or not product_id:
            return jsonify({"error": "Thiếu user_id hoặc product_id"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Lấy hoặc tạo cart
        cur.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
        cart = cur.fetchone()
        if not cart:
            cur.execute("INSERT INTO cart (user_id, created_at) VALUES (%s, NOW()) RETURNING cart_id", (user_id,))
            cart = cur.fetchone()
        cart_id = cart["cart_id"]

        # Lấy stock sản phẩm
        cur.execute("SELECT stock FROM product WHERE product_id = %s", (product_id,))
        product = cur.fetchone()
        if not product:
            cur.close()
            conn.close()
            return jsonify({"error": "Sản phẩm không tồn tại", "added_quantity": 0}), 404
        stock = product["stock"]

        # Lấy số lượng hiện tại trong cart
        cur.execute("SELECT quantity FROM cartitem WHERE cart_id = %s AND product_id = %s", (cart_id, product_id))
        existing = cur.fetchone()
        current_qty = existing["quantity"] if existing else 0

        max_addable = stock - current_qty

        if max_addable <= 0:
            added_qty = 0
            message = f"Số lượng trong giỏ đã đạt tối đa ({stock})"
        else:
            added_qty = min(quantity, max_addable)
            new_qty = current_qty + added_qty
            if existing:
                cur.execute("UPDATE cartitem SET quantity = %s WHERE cart_id = %s AND product_id = %s",
                            (new_qty, cart_id, product_id))
            else:
                cur.execute("INSERT INTO cartitem (cart_id, product_id, quantity) VALUES (%s, %s, %s)",
                            (cart_id, product_id, added_qty))
            if added_qty < quantity:
                message = f"Chỉ thêm được {added_qty} sản phẩm vì tồn kho còn {max_addable}"
            else:
                message = f"Đã thêm {added_qty} sản phẩm vào giỏ hàng"

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": message, "added_quantity": added_qty})

    except Exception as e:
        print("❌ Lỗi trong add_to_cart:", e)
        traceback.print_exc()
        return jsonify({"error": str(e), "added_quantity": 0}), 500

# ========================
# Cập nhật số lượng
# ========================
@cart_bp.route("/update", methods=["PUT"])
def update_cart_item():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        product_id = data.get("product_id")
        quantity = int(data.get("quantity"))

        if not user_id or not product_id:
            return jsonify({"error": "Thiếu user_id hoặc product_id"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
        cart = cur.fetchone()
        if not cart:
            cur.close()
            conn.close()
            return jsonify({"error": "Giỏ hàng không tồn tại"}), 404
        cart_id = cart["cart_id"]

        cur.execute("SELECT stock FROM product WHERE product_id = %s", (product_id,))
        product = cur.fetchone()
        if not product:
            cur.close()
            conn.close()
            return jsonify({"error": "Sản phẩm không tồn tại"}), 404
        stock = product["stock"]

        updated_qty = min(quantity, stock)

        cur.execute("UPDATE cartitem SET quantity = %s WHERE cart_id = %s AND product_id = %s",
                    (updated_qty, cart_id, product_id))
        conn.commit()
        cur.close()
        conn.close()

        if quantity > stock:
            message = f"Số lượng vượt quá tồn kho, đã giới hạn còn {stock}"
        else:
            message = "Cập nhật số lượng thành công"

        return jsonify({"message": message, "updated_quantity": updated_qty})

    except Exception as e:
        print("❌ Lỗi trong update_cart_item:", e)
        traceback.print_exc()
        return jsonify({"error": str(e), "updated_quantity": 0}), 500

# ========================
# Xóa sản phẩm khỏi giỏ
# ========================
@cart_bp.route("/remove", methods=["DELETE"])
def remove_from_cart():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        product_id = data.get("product_id")

        if not user_id or not product_id:
            return jsonify({"error": "Thiếu user_id hoặc product_id"}), 400

        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
        cart = cur.fetchone()
        if not cart:
            cur.close()
            conn.close()
            return jsonify({"error": "Giỏ hàng không tồn tại"}), 404
        cart_id = cart["cart_id"]

        cur.execute("DELETE FROM cartitem WHERE cart_id = %s AND product_id = %s", (cart_id, product_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Đã xóa sản phẩm khỏi giỏ hàng"})

    except Exception as e:
        print("❌ Lỗi trong remove_from_cart:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ========================
# Xóa toàn bộ giỏ hàng
# ========================
@cart_bp.route("/clear/<int:user_id>", methods=["DELETE"])
def clear_cart(user_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT cart_id FROM cart WHERE user_id = %s", (user_id,))
        cart = cur.fetchone()
        if cart:
            cart_id = cart["cart_id"]
            cur.execute("DELETE FROM cartitem WHERE cart_id = %s", (cart_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Đã xóa toàn bộ giỏ hàng"})
    except Exception as e:
        print("❌ Lỗi trong clear_cart:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
