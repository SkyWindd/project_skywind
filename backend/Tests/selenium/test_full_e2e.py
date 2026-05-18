from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

EMAIL = "bo@gmail.com"
PASSWORD = "123456"

WAIT = 30


# ======================
# LOGIN
# ======================
def login(driver):

    driver.get(
        f"{BASE_URL}/login"
    )

    email_input = WebDriverWait(
        driver,
        WAIT
    ).until(
        EC.presence_of_element_located(
            (
                By.CSS_SELECTOR,
                "input[type='email']"
            )
        )
    )

    email_input.clear()

    email_input.send_keys(
        EMAIL
    )

    password_input = WebDriverWait(
        driver,
        WAIT
    ).until(
        EC.presence_of_element_located(
            (
                By.CSS_SELECTOR,
                "input[type='password']"
            )
        )
    )

    password_input.clear()

    password_input.send_keys(
        PASSWORD
    )

    # SUBMIT FORM
    password_input.submit()

    # WAIT LOGIN SUCCESS
    WebDriverWait(
        driver,
        WAIT
    ).until(
        lambda d:
            "/login"
            not in d.current_url
    )


# ======================
# E2E FULL FLOW
# ======================
def test_e2e_buy_now_checkout(driver):

    # ======================
    # LOGIN
    # ======================
    login(driver)

    # ======================
    # HOME PAGE
    # ======================
    driver.get(BASE_URL)

    WebDriverWait(
        driver,
        WAIT
    ).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[contains(text(),'Sản phẩm nổi bật')]"
            )
        )
    )

    # ======================
    # PRODUCT LIST
    # ======================
    product_links = WebDriverWait(
        driver,
        WAIT
    ).until(
        EC.presence_of_all_elements_located(
            (
                By.CSS_SELECTOR,
                "a[href^='/laptop/']"
            )
        )
    )

    assert len(product_links) > 0

    # CLICK PRODUCT
    product_links[0].click()

    # ======================
    # PRODUCT DETAIL PAGE
    # ======================
    WebDriverWait(
        driver,
        WAIT
    ).until(
        lambda d:
            "/laptop/"
            in d.current_url
    )

    # ======================
    # BUY NOW
    # ======================
    buy_now_button = WebDriverWait(
        driver,
        WAIT
    ).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(.,'MUA NGAY')]"
            )
        )
    )

    driver.execute_script(
        "arguments[0].click();",
        buy_now_button
    )

    # ======================
    # CHECKOUT INFO
    # ======================
    WebDriverWait(
        driver,
        WAIT
    ).until(
        lambda d:
            "/checkout-info"
            in d.current_url
    )

    # ======================
    # ASSERT SUCCESS
    # ======================
    assert (
        "/checkout-info"
        in driver.current_url
    )