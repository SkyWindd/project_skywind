import http from "k6/http";

import { check, sleep } from "k6";



export const options = {

    vus: 1,

    iterations: 1,
};



export default function () {

    // =====================================
    // LOGIN
    // =====================================
    const loginPayload = JSON.stringify({

        email: "bo@gmail.com",

        password: "123456",
    });

    const loginRes = http.post(

        "http://localhost:8000/auth/api/auth/login",

        loginPayload,

        {
            headers: {
                "Content-Type":
                    "application/json",
            },
        }
    );

    console.log(
        "LOGIN STATUS:",
        loginRes.status
    );

    console.log(
        "LOGIN BODY:",
        loginRes.body
    );

    // =====================================
    // GET TOKEN
    // =====================================
    const token =
        loginRes.json("accessToken");

    // =====================================
    // CHECKOUT
    // =====================================
    const payload = JSON.stringify({

        user_id: 1,

        cart_items: [
            {
                product_id: 1,
                quantity: 1,
                price: 100000,
            },
        ],

        payment_method: "cod",

        payment_status: "pending",
    });

    const res = http.post(

        "http://localhost:8000/orders/api/orders/create",

        payload,

        {
            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    console.log(
        "CHECKOUT STATUS:",
        res.status
    );

    console.log(
        "CHECKOUT BODY:",
        res.body
    );

    check(res, {

        "checkout success":
            (r) =>
                r.status >= 200
                && r.status < 300,
    });

    sleep(1);
}