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
  const [editedProducts, setEditedProducts] = useState({});

  const API_URL = "http://localhost:5001/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}?include=images`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách sản phẩm ❌");
    }
  };

  // ⚠️ CHỈ DÙNG KHI SAVE (KHÔNG DÙNG RENDER)
  const calcDiscountPrice = (price, discount_percent) => {
    if (!price) return 0;
    return price - (price * (discount_percent || 0)) / 100;
  };

  const handleRowSave = async (product) => {
    try {
      setSavingId(product.product_id);

      const payload = {
        stock: Number(product.stock),
        discount_percent: Number(product.discount_percent),
        discount_price: calcDiscountPrice(
          product.price,
          product.discount_percent
        ),
      };

      await axios.put(`${API_URL}/${product.product_id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(`💾 Đã lưu "${product.name}"`);

      setEditedProducts((prev) => {
        const updated = { ...prev };
        delete updated[product.product_id];
        return updated;
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("🗑️ Đã xóa sản phẩm!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xoá sản phẩm ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-blue-700">
          📦 Quản lý sản phẩm
        </h2>
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

                {/* TỒN KHO */}
                <td className="p-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={p.stock}
                    onChange={(e) =>
                      handleChange(p, "stock", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-20 text-center"
                  />
                  {savingId === p.product_id && (
                    <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                  )}
                </td>

                {/* GIÁ GỐC (ĐÚNG) */}
                <td className="p-2 text-gray-500">
                  {(p.old_price ?? p.price)?.toLocaleString()} ₫
                </td>

                {/* % GIẢM */}
                <td className="p-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    step="1"
                    value={p.discount_percent || 0}
                    onChange={(e) =>
                      handleChange(p, "discount_percent", e.target.value)
                    }
                    className="border rounded-md px-2 py-1 w-16 text-center"
                  />
                  {savingId === p.product_id && (
                    <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                  )}
                </td>

                {/* GIÁ SAU GIẢM (ĐÚNG – KHÔNG TÍNH LẠI) */}
                <td className="p-2 text-green-600 font-semibold">
                  {p.price?.toLocaleString()} ₫
                </td>

                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setOpenModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>

                  {editedProducts[p.product_id] && (
                    <button
                      onClick={() => handleRowSave(p)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="text-red-600 hover:text-red-800"
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
        product={selectedProduct}
      />
    </div>
  );
}
