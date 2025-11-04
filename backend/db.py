import psycopg2
import os
from psycopg2.extras import RealDictCursor
def get_connection():
    return psycopg2.connect(
         host=os.getenv("DB_HOST", "db"),
        port=os.getenv("DB_PORT", "5432"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS", "12345"),
        database=os.getenv("DB_NAME", "skywind")
    )