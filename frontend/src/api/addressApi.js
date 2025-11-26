import axiosClient from "./axiosClient";

const addressApi = {
  getAddresses(userId) {
    return axiosClient.get(`/address/user/${userId}`);
  },

  createAddress(data) {
    return axiosClient.post("/address/create", data);
  },

  updateAddress(id, data) {
    return axiosClient.put(`/address/update/${id}`, data);
  },

  deleteAddress(id) {
    return axiosClient.delete(`/address/delete/${id}`);
  },
};

export default addressApi;
