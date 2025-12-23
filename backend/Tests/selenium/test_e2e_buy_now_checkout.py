from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"
EMAIL = "3122411074@gmail.com"
PASSWORD = "123456"
WAIT = 30


# ======================
# LOGIN
# ======================
def login(driver):
    driver.get(f"{BASE_URL}/login")

    WebDriverWait(driver, WAIT).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    ).send_keys(EMAIL)

    WebDriverWait(driver, WAIT).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='password']"))
    ).send_keys(PASSWORD)

    # submit form
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").submit()

    # login thành công → rời /login
    WebDriverWait(driver, WAIT).until(
        lambda d: "/login" not in d.current_url
    )


# ======================
# E2E – BUY NOW → CHECKOUT INFO (PASS)
# ======================
def test_e2e_buy_now_checkout(driver):
    # 1️⃣ LOGIN
    login(driver)

    # 2️⃣ HOME
    driver.get(BASE_URL)

    WebDriverWait(driver, WAIT).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(),'Sản phẩm nổi bật')]")
        )
    )

    # 3️⃣ CLICK SẢN PHẨM
    product_links = WebDriverWait(driver, WAIT).until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "a[href^='/laptop/']")
        )
    )
    assert len(product_links) > 0
    product_links[0].click()

    # 4️⃣ TRANG CHI TIẾT
    WebDriverWait(driver, WAIT).until(
        lambda d: "/laptop/" in d.current_url
    )

    # 5️⃣ CLICK "MUA NGAY"
    WebDriverWait(driver, WAIT).until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(.,'MUA NGAY')]")
        )
    ).click()

    # 6️⃣ CHECKOUT INFO (ĐIỂM KẾT THÚC ĐÚNG NGHIỆP VỤ)
    WebDriverWait(driver, WAIT).until(
        lambda d: "/checkout-info" in d.current_url
    )

    # 7️⃣ ASSERT PASS
    assert "/checkout-info" in driver.current_url
