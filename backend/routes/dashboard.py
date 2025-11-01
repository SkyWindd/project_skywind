# routes/dashboard.py
from flask import Blueprint, jsonify
from db import get_connection
from psycopg2.extras import RealDictCursor

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/stats", methods=["GET"])
def get_stats():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # 🧩 Tổng người dùng
        cur.execute("SELECT COUNT(*) AS total_users FROM users;")
        total_users = cur.fetchone()["total_users"]

        # 🧩 Tổng sản phẩm
        cur.execute("SELECT COUNT(*) AS total_products FROM product;")
        total_products = cur.fetchone()["total_products"]

        # 🧩 Tổng đơn hàng + doanh thu
        cur.execute("""
            SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_amount), 0) AS total_revenue 
            FROM orders;
        """)
        order_stats = cur.fetchone()

        # 🧩 Doanh thu trung bình
        cur.execute("SELECT COALESCE(AVG(total_amount), 0) AS avg_revenue FROM orders;")
        avg_rev = cur.fetchone()["avg_revenue"]

        cur.close()
        conn.close()

        return jsonify({
            "total_users": total_users,
            "total_products": total_products,  # ✅ Đã có
            "total_orders": order_stats["total_orders"],
            "total_revenue": float(order_stats["total_revenue"]),
            "avg_revenue": round(float(avg_rev), 2)
        })

    except Exception as e:
        print("❌ Dashboard stats error:", e)
        return jsonify({"error": str(e)}), 500


@dashboard_bp.route("/revenue-chart", methods=["GET"])
def revenue_chart():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT 
                TO_CHAR(order_date, 'YYYY-MM-DD') AS date,
                SUM(total_amount) AS revenue
            FROM orders
            WHERE order_date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY date
            ORDER BY date ASC;
        """)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([
            {"date": row["date"], "revenue": float(row["revenue"])} for row in data
        ])
    except Exception as e:
        print("❌ Revenue chart error:", e)
        return jsonify({"error": str(e)}), 500
