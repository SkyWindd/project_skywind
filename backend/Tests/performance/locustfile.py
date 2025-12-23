from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    # 🔐 LOGIN
    @task(2)
    def login(self):
        self.client.post(
            "/api/auth/login",
            json={
                "email": "3122411074@gmail.com",
                "password": "123456"
            },
            name="Auth - Login"
        )

    # 📦 XEM SẢN PHẨM
    @task(3)
    def get_products(self):
        self.client.get(
            "/api/products",
            name="Product - Get list"
        )

    # 🛒 GIỎ HÀNG
    @task(2)
    def get_cart(self):
        self.client.get(
            "/api/cart/1",
            name="Cart - Get cart"
        )

    # 📍 LẤY TỈNH
    @task(1)
    def get_provinces(self):
        self.client.get(
            "/api/provinces",
            name="Address - Provinces"
        )

    # 🧾 TẠO ĐƠN HÀNG
    @task(1)
    def create_order(self):
        self.client.post(
            "/api/orders/create",
            json={
                "user_id": 1,
                "cart_items": [
                    {
                        "product_id": 1,
                        "quantity": 2,
                        "price": 100000
                    }
                ],
                "payment_method": "cod"
            },
            name="Order - Create"
        )
