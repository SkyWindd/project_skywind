import axiosClient from "./axiosClient";

const BASE = "/users/api/address";

const addressApi = {
  // =========================
  // 🔹 Lấy danh sách địa chỉ
  // =========================
  getAddresses(userId) {
    return axiosClient.get(`${BASE}/user/${userId}`);
  },

  // =========================
  // 🔹 Tạo địa chỉ
  // =========================
  createAddress(data) {
    return axiosClient.post(`${BASE}/create`, data);
  },

  // =========================
  // 🔹 Update địa chỉ
  // =========================
  updateAddress(id, data) {
    return axiosClient.put(`${BASE}/update/${id}`, data);
  },

  // =========================
  // 🔹 Xóa địa chỉ
  // =========================
  deleteAddress(id) {
    return axiosClient.delete(`${BASE}/delete/${id}`);
  },

  // =========================
  // 🔹 Lấy tỉnh
  // =========================
  getProvinces() {
    return axiosClient.get(`${BASE}/provinces`);
  },

  // =========================
  // 🔹 Lấy quận huyện
  // =========================
  getDistricts(province) {
    return axiosClient.get(
      `${BASE}/districts/${encodeURIComponent(province)}`
    );
  },

  // =========================
  // 🔹 Lấy phường xã
  // =========================
  getWards(district) {
    return axiosClient.get(
      `${BASE}/wards/${encodeURIComponent(district)}`
    );
  },
};

export default addressApi;