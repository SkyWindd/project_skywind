import axiosClient from "./axiosClient";

export const authApi = {
  async login(data) {
    const res = await axiosClient.post(
      "/auth/api/auth/login",
      data
    );

    return res.data;
  },

  async register(data) {
    const res = await axiosClient.post(
      "/auth/api/auth/register",
      data
    );

    return res.data;
  },

  async googleLogin(data) {
    const res = await axiosClient.post(
      "/auth/api/auth/google-login",
      data
    );

    return res.data;
  },

  async refreshToken(refreshToken) {
    const res = await axiosClient.post(
      "/auth/api/auth/refresh-token",
      { refreshToken }
    );

    return res.data;
  },
};
