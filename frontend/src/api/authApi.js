import axiosClient from "./axiosClient";

export const authApi = {
  // 🔹 Đăng nhập bằng email & password
  async login(data) {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
  },

  // 🔹 Đăng ký tài khoản
  async register(data) {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  },

  // 🔹 Đăng nhập bằng Google (gửi email & name)
  async googleLogin(data) {
    const res = await axiosClient.post("/auth/google-login", data);
    return res.data;
  },

  // 🔹 Làm mới accessToken bằng refreshToken
  async refreshToken(refreshToken) {
    const res = await axiosClient.post("/auth/refresh-token", { refreshToken });
    return res.data;
  },
};
