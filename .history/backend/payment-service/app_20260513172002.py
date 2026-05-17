from flask import Flask, request, jsonify
from flask_cors import CORS

from db import get_connection

from psycopg2.extras import RealDictCursor

app = Flask(__name__)

CORS(app)

# ==========================================
# CREATE PAYMENT
# ==========================================
@app.route("/api/payments/create", methods=["POST"])
def create_payment():

    try:

        data = request.json

        print("📦 PAYMENT DATA:", data)

        order_id = data.get("order_id")

        amount = data.get("amount")

        payment_method = data.get("payment_method")

        if not order_id:

            return jsonify({
                "error": "Thiếu order_id"
            }), 400

        if not amount:

            return jsonify({
                "error": "Thiếu amount"
            }), 400

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        # ==========================================
        # INSERT PAYMENT
        # ==========================================
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
            RETURNING *
        """, (
            order_id,
            payment_method,
            "paid",
            amount
        ))

        payment = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        print("✅ PAYMENT CREATED:", payment)

        return jsonify({
            "success": True,
            "message": "Tạo payment thành công",
            "payment_id": payment["payment_id"],
            "payment": payment
        }), 201

    except Exception as e:

        print("❌ CREATE PAYMENT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# GET PAYMENT DETAIL
# ==========================================
@app.route(
    "/api/payments/<int:payment_id>",
    methods=["GET"]
)
def get_payment(payment_id):

    try:

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        cur.execute("""
            SELECT *
            FROM payment
            WHERE payment_id = %s
        """, (payment_id,))

        payment = cur.fetchone()

        cur.close()
        conn.close()

        if not payment:

            return jsonify({
                "error": "Không tìm thấy payment"
            }), 404

        return jsonify(payment), 200

    except Exception as e:

        print("❌ GET PAYMENT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# UPDATE PAYMENT STATUS
# ==========================================
@app.route(
    "/api/payments/update-status/<int:payment_id>",
    methods=["PUT"]
)
def update_payment_status(payment_id):

    try:

        data = request.json

        status = data.get("status")

        conn = get_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        cur.execute("""
            UPDATE payment
            SET status = %s
            WHERE payment_id = %s
            RETURNING *
        """, (
            status,
            payment_id
        ))

        payment = cur.fetchone()

        conn.commit()

        cur.close()
        conn.close()

        if not payment:

            return jsonify({
                "error": "Không tìm thấy payment"
            }), 404

        return jsonify({
            "success": True,
            "message": "Cập nhật payment thành công",
            "payment": payment
        }), 200

    except Exception as e:

        print("❌ UPDATE PAYMENT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# HEALTH CHECK
# ==========================================
@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "service": "payment-service",
        "status": "running"
    })


# ==========================================
# RUN APP
# ==========================================
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5008,
        debug=True
    )
    @app.route("/api/payments/order/<int:order_id>", methods=["GET"])
def get_payment_by_order(order_id):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM payment WHERE order_id = %s", (order_id,))
        payment = cur.fetchone()
        cur.close()
        conn.close()
        if not payment:
            return jsonify({"error": "Chưa có thanh toán cho đơn hàng này"}), 404
        return jsonify(payment), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500