from kafka import KafkaConsumer
import json
import smtplib
import os
import time

from email.mime.text import MIMEText
from datetime import datetime

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

# =========================================
# WAIT FOR KAFKA
# =========================================
consumer = None

while consumer is None:

    try:

        consumer = KafkaConsumer(

            'order-topic',

            bootstrap_servers='kafka:9092',

            auto_offset_reset='earliest',

            # ✅ KHÔNG PHẢI STRING
            group_id=None,

            value_deserializer=lambda x:
            json.loads(x.decode('utf-8'))
        )

        print("✅ Connected to Kafka")

    except Exception as e:

        print("⏳ Waiting for Kafka...")
        print(e)

        time.sleep(5)

print("🚀 Notification service running...")
print("👂 Waiting for Kafka messages...")

# =========================================
# CONSUME EVENTS
# =========================================
for message in consumer:

    data = message.value

    print("📩 Nhận event:", data)

    try:

        customer_email = data["email"]

        order_id = data["order_id"]

        total = data["total"]

        # ✅ PRODUCTS
        items = data["items"]

        # =========================================
        # PRODUCT LIST
        # =========================================
        product_text = ""

        for item in items:

            product_name = item.get(
                "product_name",
                f"Product #{item['product_id']}"
            )

            quantity = item["quantity"]

            price = item["price"]

            product_text += (
                f"""
• {product_name}

  Số lượng: {quantity}

  Giá: {format(int(price), ',')} VNĐ

"""
            )

        # =========================================
        # DATE
        # =========================================
        current_date = datetime.now().strftime(
            "%d/%m/%Y %H:%M"
        )

        # =========================================
        # EMAIL BODY
        # =========================================
        body = f"""
========================================
            SKYWIND SHOP
========================================

🛒 XÁC NHẬN ĐẶT HÀNG THÀNH CÔNG

Xin chào quý khách,

Cảm ơn bạn đã mua sắm tại
SKYWIND SHOP ❤️

----------------------------------------
📦 THÔNG TIN ĐƠN HÀNG
----------------------------------------

Mã đơn hàng:
#{order_id}

Ngày đặt:
{current_date}

----------------------------------------
🛍️ DANH SÁCH SẢN PHẨM
----------------------------------------

{product_text}

----------------------------------------
💰 TỔNG THANH TOÁN
----------------------------------------

{format(int(total), ',')} VNĐ

----------------------------------------

📌 Trạng thái:
Đang xử lý

----------------------------------------

Cảm ơn bạn đã tin tưởng
SKYWIND SHOP ❤️

========================================
"""

        # =========================================
        # CREATE EMAIL
        # =========================================
        msg = MIMEText(body, "plain", "utf-8")

        msg["Subject"] = (
            f"Xác nhận đơn hàng #{order_id}"
        )

        msg["From"] = MAIL_USERNAME

        msg["To"] = customer_email

        # =========================================
        # SEND EMAIL
        # =========================================
        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            MAIL_USERNAME,
            MAIL_PASSWORD
        )

        server.send_message(msg)

        server.quit()

        print(
            f"✅ Đã gửi email tới {customer_email}"
        )

    except Exception as e:

        print(
            "❌ Lỗi gửi email:",
            str(e)
        )