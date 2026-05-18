from flask import Blueprint
from flask import request
from flask import jsonify

from db import get_connection

payment_bp = Blueprint(
    "payment",
    __name__,
    url_prefix="/api/payments"
)

# ==========================================
# CREATE PAYMENT
# ==========================================
@payment_bp.route("/create", methods=["POST"])
def create_payment():

    try:

        data = request.json

        if not data:
            return jsonify({
                "error": "No data"
            }), 400

        order_id = data.get("order_id")

        amount = data.get("amount")

        payment_method = data.get("payment_method")

        if not order_id:
            return jsonify({
                "error": "Missing order_id"
            }), 400

        conn = get_connection()

        cur = conn.cursor()

        cur.execute("""
            INSERT INTO payment (
                order_id,
                payment_date,
                method,
                status,
                amount
            )
            VALUES (
                %s,
                NOW(),
                %s,
                %s,
                %s
            )
            RETURNING payment_id
        """, (
            order_id,
            payment_method,
            "paid",
            amount
        ))

        payment_id = cur.fetchone()[0]

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "payment_id": payment_id
        }), 201

    except Exception as e:

        print("❌ PAYMENT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500
    
# GET PAYMENT BY ORDER ID
@payment_bp.route("/order/<int:order_id>", methods=["GET"])
def get_payment(order_id):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT payment_id, order_id, payment_date, method, status, amount
            FROM payment WHERE order_id = %s
        """, (order_id,))
        r = cur.fetchone()
        cur.close()
        conn.close()
        if not r:
            return jsonify({"error": "Payment not found"}), 404
        return jsonify({
            "payment_id": r[0],
            "order_id": r[1],
            "payment_date": str(r[2]),
            "method": r[3],
            "status": r[4],
            "amount": float(r[5])
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500