from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'order-topic',
    bootstrap_servers='kafka:9092',
    auto_offset_reset='earliest',
    group_id='notification-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

print("🚀 Notification service running...")

for message in consumer:
    data = message.value
    print("📩 Nhận event:", data)

    # TODO: gửi email / log / notification