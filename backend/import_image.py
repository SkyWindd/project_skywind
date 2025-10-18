import os
import psycopg2
from dotenv import load_dotenv
import unicodedata
import re

# -------------------------------
# Load .env
# -------------------------------
load_dotenv()
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads/")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", 54321)
DB_NAME = os.getenv("DB_NAME", "skywind")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "12345")

# -------------------------------
# Hàm chuyển tên tiếng Việt sang ascii
# -------------------------------
def remove_vietnamese(text):
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-zA-Z0-9._-]', '_', text)
    return text.lower()

# -------------------------------
# Kết nối PostgreSQL
# -------------------------------
def get_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        print("✅ Kết nối PostgreSQL thành công!")
        return conn
    except Exception as e:
        print("❌ Lỗi kết nối:", e)
        exit(1)

# -------------------------------
# Import tất cả ảnh
# -------------------------------
def import_all_images():
    conn = get_connection()
    cur = conn.cursor()

    for root, _, files in os.walk(UPLOAD_FOLDER):
        for file in files:
            old_path = os.path.join(root, file)
            new_name = remove_vietnamese(file)
            new_path = os.path.join(root, new_name)

            # Đổi tên nếu khác
            if old_path != new_path:
                os.rename(old_path, new_path)

            # Tạo đường dẫn lưu trong DB (tương đối)
            relative_path = os.path.relpath(new_path, UPLOAD_FOLDER)
            db_path = f"{UPLOAD_FOLDER}{relative_path.replace(os.sep, '/')}"

            # Lưu vào DB, product_id = NULL tạm thời
            try:
                cur.execute(
                    "INSERT INTO image (product_id, name, path) VALUES (%s, %s, %s)",
                    (None, new_name, db_path)
                )
                print(f"✅ Added: {db_path}")
            except Exception as e:
                print(f"❌ Lỗi khi thêm {db_path}: {e}")
                conn.rollback()
                continue

    conn.commit()
    cur.close()
    conn.close()
    print("🎉 Import completed!")

# -------------------------------
# Main
# -------------------------------
if __name__ == "__main__":
    import_all_images()
