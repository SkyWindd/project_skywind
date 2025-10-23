import psycopg2
import os

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),          # 🟢 'db' là tên service trong docker-compose.yml
        database=os.getenv("DB_NAME", "skywind"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS", "12345"),
        port=os.getenv("DB_PORT", 5432)
    )
