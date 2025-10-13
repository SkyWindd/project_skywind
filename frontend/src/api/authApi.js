// src/api/authApi.js
// Giao tiếp với backend cho auth (login, register, refresh nếu cần)
// Dùng axiosClient để tận dụng interceptor và baseURL

import axiosClient from "./axiosClient";

// NOTE: FE expects backend responses in these shapes:
// - login success:
//   { success: true, message: "Đăng nhập thành công", accessToken: "...", refreshToken: "...", user: {...} }
// - register success:
//   { success: true, message: "Đăng ký thành công" }

const authApi = {
  login(payload) {
    // payload: { email, password }
    return axiosClient.post("/auth/login", payload);
  },

  register(payload) {
    // payload: { fullName, email, password }
    return axiosClient.post("/auth/register", payload);
  },

  // optional: explicit refresh helper (not necessary; axiosClient uses refreshClient internally)
  refreshToken(payload) {
    // payload: { refreshToken }
    // use plain axios (no interceptor) to avoid infinite loop, but we provide through axiosClient for convenience
    return axiosClient.post("/auth/refresh-token", payload);
  },
};

export default authApi;
