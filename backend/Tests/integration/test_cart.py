# Tests/integration/helpers.py
import random
import string
from db import get_connection
from psycopg2.extras import RealDictCursor

# =========================
# User helpers
# =========================
def random_email():
    return ''.join(random.choices(string.ascii_lowercase, k=8)) + "@test.com"

def insert_test_user(email=None, password="123456", role="user"):
    if email is None:
        email = random_email()
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO users (username, email, password, role, is_active)
        VALUES (%s, %s, %s, %s, %s) RETURNING user_id, email
    """, (email.split("@")[0], email, password, role, True))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row["user_id"], row["email"]

def delete_test_user(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE user_id=%s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()

# =========================
# Product helpers
# =========================
def generate_unique_name(base="Test Product"):
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{base} {suffix}"

def insert_test_product(name=None, price=1000, stock=10, brand_id=1):
    if not name:
        name = generate_unique_name()
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO product (name, price, stock, brand_id)
        VALUES (%s, %s, %s, %s) RETURNING product_id, slug
    """, (name, price, stock, brand_id))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row["product_id"], row["slug"]

def delete_test_product(product_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM product WHERE product_id=%s", (product_id,))
    conn.commit()
    cur.close()
    conn.close()

# =========================
# Order helpers
# =========================
def insert_test_order(user_id, product_id, quantity=1):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO "order" (user_id, product_id, quantity)
        VALUES (%s,%s,%s) RETURNING order_id
    """, (user_id, product_id, quantity))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row["order_id"]

def delete_test_order(order_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM "order" WHERE order_id=%s', (order_id,))
    conn.commit()
    cur.close()
    conn.close()

# =========================
# Payment helpers
# =========================
def insert_test_payment(user_id, amount=100):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO payment (user_id, amount, status)
        VALUES (%s, %s, %s) RETURNING payment_id
    """, (user_id, amount, "pending"))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row["payment_id"]

def delete_test_payment(payment_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM payment WHERE payment_id=%s", (payment_id,))
    conn.commit()
    cur.close()
    conn.close()

# =========================
# Cart helpers
# =========================
def insert_test_cart(user_id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO cart (user_id)
        VALUES (%s) RETURNING cart_id
    """, (user_id,))
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row["cart_id"]

def delete_test_cart(cart_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM cart WHERE cart_id=%s", (cart_id,))
    conn.commit()
    cur.close()
    conn.close()
