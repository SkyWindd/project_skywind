from flask import Blueprint, jsonify
from db import get_connection
from datetime import datetime, timedelta
from psycopg2.extras import RealDictCursor
import traceback

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

# =========================================================
# 📊 API: Thống kê tổng quan
# =========================================================
@dashboard_bp.route("/stats", methods=["GET"])
def get_dashboard_stats():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM users")
        total_users = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM product")
        total_products = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM orders")
        total_orders = cur.fetchone()[0]

        cur.execute("SELECT COALESCE(SUM(total_amount),0) FROM orders")
        total_revenue = cur.fetchone()[0]

        cur.close()
        return jsonify({
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue)
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


# =========================================================
# 📈 API: Biểu đồ doanh thu 7 ngày gần nhất
# =========================================================
@dashboard_bp.route("/revenue-chart", methods=["GET"])
def revenue_chart():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Lấy 7 ngày gần nhất
        today = datetime.today().date()
        seven_days_ago = today - timedelta(days=6)

        cur.execute("""
            SELECT 
                to_char(order_date, 'YYYY-MM-DD') AS date, 
                COALESCE(SUM(total_amount),0) AS revenue
            FROM orders
            WHERE order_date::date BETWEEN %s AND %s
            GROUP BY date
            ORDER BY date ASC
        """, (seven_days_ago, today))

        data = cur.fetchall()
        cur.close()
        return jsonify(data)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


# =========================================================
# 🧾 API: Lấy 5 đơn hàng gần nhất
# =========================================================
@dashboard_bp.route("/recent-orders", methods=["GET"])
def recent_orders():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status
            FROM orders o
            ORDER BY o.order_date DESC
            LIMIT 5
        """)
        orders = cur.fetchall()
        cur.close()
        return jsonify(orders)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
