from flask import Blueprint, request, jsonify
from db import get_connection
from psycopg2.extras import RealDictCursor

inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")

@inventory_bp.route("", methods=["GET"])
def check_inventory():
    sku_codes = request.args.getlist("skuCode")

    if not sku_codes:
        return jsonify({"error": "Thiếu skuCode"}), 400

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    result = []

    for sku in sku_codes:
        cur.execute(
            "SELECT stock FROM product WHERE product_id = %s",
            (sku,)
        )
        row = cur.fetchone()

        in_stock = row and row["stock"] > 0

        result.append({
            "skuCode": sku,
            "isInStock": in_stock
        })

    cur.close()
    conn.close()

    return jsonify(result)