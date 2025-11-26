import db
from psycopg2.extras import RealDictCursor

def find_products(keyword: str):
    try:
        conn = db.get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT id, name, price, description
            FROM product
            WHERE LOWER(name) LIKE %s
        """
        cur.execute(query, (f"%{keyword.lower()}%",))
        return cur.fetchall()
    except Exception as e:
        print("❌ Database error:", e)
        return []
