import axiosClient from "./axiosClient";

export const authApi = {
  async login(data) {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
  },
  async register(data) {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  },
};
