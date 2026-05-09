import psycopg2
conn = psycopg2.connect(host='localhost', port=54321, dbname='skywind', user='postgres', password='12345')
cur = conn.cursor()
cur.execute('SELECT COUNT(*) FROM product')
print('Tong san pham:', cur.fetchone()[0])
cur.execute('SELECT COUNT(*) FROM product WHERE embedding IS NULL')
print('Chua co embedding:', cur.fetchone()[0])
conn.close()