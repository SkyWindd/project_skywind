import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import ProductModal from "@/admin/productmodal";

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [editedProducts, setEditedProducts] = useState({}); // ✅ Lưu sản phẩm đã chỉnh sửa

  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}?include=images`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      toast.error("Không thể tải danh sách sản phẩm ❌");
    }
  };

  const calcDiscountPrice = (price, discount_percent) => {
    if (!price) return 0;
    return price - (price * (discount_percent || 0)) / 100;
  };

  // ✅ Hàm lưu thay đổi
  const handleRowSave = async (product) => {
    try {
      setSavingId(product.product_id);

      const payload = {
        stock: Number(product.stock),
        discount_percent: Number(product.discount_percent),
        discount_price: calcDiscountPrice(product.price, product.discount_percent),
      };

      await axios.put(`${API_URL}/${product.product_id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(`💾 Đã lưu "${product.name}" thành công!`);

      setEditedProducts((prev) => {
        const updated = { ...prev };
        delete updated[product.product_id];
        return updated;
      });
    } catch (err) {
      console.error("❌ Lỗi khi lưu:", err);
      toast.error("Không thể lưu sản phẩm!");
    } finally {
      setSavingId(null);
    }
  };

  const handleChange = (p, field, value) => {
    const updated = { ...p, [field]: Number(value) };
    setProducts((prev) =>
      prev.map((prod) =>
        prod.product_id === p.product_id ? updated : prod
      )
    );
    setEditedProducts((prev) => ({
      ...prev,
      [p.product_id]: true,
    }));
  };

  const handleSaveModal = async (data) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      };

      if (selectedProduct) {
        await axios.put(`${API_URL}/${selectedProduct.product_id}`, payload);
        toast.success("🛠️ Đã cập nhật sản phẩm!");
      } else {
        await axios.post(API_URL, payload);
        toast.success("✅ Thêm sản phẩm thành công!");
      }

      setOpenModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      toast.error("❌ Không thể lưu sản phẩm!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("🗑️ Đã xóa sản phẩm!");
        fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
        toast.error("Không thể xoá sản phẩm ❌");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-blue-700">📦 Quản lý sản phẩm</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Tên</th>
            <th className="p-2">Tồn kho</th>
            <th className="p-2">Giá gốc</th>
            <th className="p-2">% Giảm</th>
            <th className="p-2">Giá sau giảm</th>
            <th className="p-2 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.product_id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.product_id}</td>
                <td className="p-2">{p.name}</td>

                <td className="p-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={p.stock}
                    onChange={(e) => handleChange(p, "stock", e.target.value)}
                    className="border rounded-md px-2 py-1 w-20 text-center focus:ring focus:ring-blue-200"
                  />
                  {savingId === p.product_id && (
                    <Loader2 className="animate-spin text-blue-500 w-4 h-4" />
                  )}
                </td>

                <td className="p-2">{p.price?.toLocaleString()} ₫</td>

                <td className="p-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    step="1"
                    value={p.discount_percent || 0}
                    onChange={(e) => handleChange(p, "discount_percent", e.target.value)}
                    className="border rounded-md px-2 py-1 w-16 text-center focus:ring focus:ring-blue-200"
                  />
                  {savingId === p.product_id && (
                    <Loader2 className="animate-spin text-blue-500 w-4 h-4" />
                  )}
                </td>

                <td className="p-2 text-green-600 font-semibold">
                  {calcDiscountPrice(p.price, p.discount_percent).toLocaleString()} ₫
                </td>

                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setOpenModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Sửa chi tiết"
                  >
                    <Pencil size={18} />
                  </button>

                  {editedProducts[p.product_id] && (
                    <button
                      onClick={() => handleRowSave(p)}
                      className="text-green-600 hover:text-green-800"
                      title="Lưu thay đổi"
                    >
                      <Save size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xoá"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                Không có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ProductModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveModal}
        product={selectedProduct}
      />
    </div>
  );
}
