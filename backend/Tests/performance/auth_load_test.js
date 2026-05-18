import http from "k6/http";

import { check, sleep } from "k6";



export const options = {

    vus: 10,

    duration: "20s",
};



export default function () {

    const payload = JSON.stringify({

        email: "3122411074@gmail.com",

        password: "123456",
    });

    const params = {

        headers: {

            "Content-Type":
                "application/json",
        },
    };

    const res = http.post(
        "http://localhost:5005/api/auth/login",
        payload,
        params
    );

    check(res, {

        "login success":
            (r) =>
                r.status === 200,
    });

    sleep(1);
}