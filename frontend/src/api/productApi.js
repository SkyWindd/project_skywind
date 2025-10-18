import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/products";

const productApi = {
  // 🧱 Lấy toàn bộ sản phẩm
  getAll: async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data;
  },

  // 🧱 Lọc sản phẩm theo tham số động
  filter: async (filters = {}) => {
    const params = new URLSearchParams();

    // --- ✅ Xử lý từng bộ lọc ---
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      // Cho phép truyền mảng hoặc chuỗi
      if (Array.isArray(value)) {
        // Mỗi phần tử là một param riêng (vd: ?ssd=256GB&ssd=512GB)
        value.forEach((v) => params.append(key, v));
      } else if (typeof value === "string" && value.includes(",")) {
        // Nếu người dùng truyền kiểu "256GB,512GB" thì split ra
        value.split(",").forEach((v) => params.append(key, v.trim()));
      } else {
        // Truyền 1 giá trị bình thường
        params.append(key, value);
      }
    });

    console.log("🔍 Gửi filter:", params.toString());

    const res = await axios.get(`${API_URL}/filter`, { params });
    return res.data;
  },

  // 🧱 Lấy chi tiết sản phẩm
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
};

export default productApi;
