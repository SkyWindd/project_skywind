import axios from "axios";

const API_URL = "http://localhost:5001/api/products/";

const productApi = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  filter: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (typeof value === "string" && value.includes(",")) {
        value.split(",").forEach((v) => params.append(key, v.trim()));
      } else {
        params.append(key, value);
      }
    });

    const res = await axios.get(`${API_URL}filter`, { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}${id}`);
    return res.data;
  },
};

export default productApi;