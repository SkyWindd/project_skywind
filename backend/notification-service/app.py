from kafka import KafkaConsumer
import json
import smtplib
import os
import time

from email.mime.text import MIMEText

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

            group_id='None',

            value_deserializer=lambda x:
            json.loads(x.decode('utf-8'))
        )

        print("✅ Connected to Kafka")

    except Exception as e:

        print("⏳ Waiting for Kafka...")

        time.sleep(5)

print("🚀 Notification service running...")

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

        body = f"""
Cảm ơn bạn đã đặt hàng!

Mã đơn hàng: {order_id}
Tổng tiền: {total} VNĐ

Đơn hàng của bạn đang được xử lý.
"""

        msg = MIMEText(body)

        msg["Subject"] = "Xác nhận đơn hàng"

        msg["From"] = MAIL_USERNAME

        msg["To"] = customer_email

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