import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ProductModal({ open, onClose, product, refresh }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    brand_id: "",
    promo_id: "",
    cpu: "",
    ram: "",
    ssd: "",
    vga: "",
    man_hinh: "",
    is_hot: false,
  });
  const [previews, setPreviews] = useState([]); // nhiều ảnh preview
  const [files, setFiles] = useState([]); // nhiều file

  const API_URL = "http://localhost:5000/api/products";
  const UPLOAD_URL = "http://localhost:5000/api/products/upload";
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        brand_id: product.brand_id || "",
        promo_id: product.promo_id || "",
        cpu: product.cpu || "",
        ram: product.ram || "",
        ssd: product.ssd || "",
        vga: product.vga || "",
        man_hinh: product.man_hinh || "",
        is_hot: product.is_hot || false,
      });

      // 🔹 hiển thị tất cả ảnh có sẵn
      if (product.images && product.images.length > 0) {
        setPreviews(
          product.images.map((img) =>
            img.startsWith("http") ? img : `${BASE_URL}/${img}`
          )
        );
      } else {
        setPreviews([]);
      }
    } else {
      setForm({
        name: "",
        price: "",
        stock: "",
        brand_id: "",
        promo_id: "",
        cpu: "",
        ram: "",
        ssd: "",
        vga: "",
        man_hinh: "",
        is_hot: false,
      });
      setPreviews([]);
      setFiles([]);
    }
  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // hiển thị preview
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return [];
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post(UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrls.push(res.data.image_url);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải ảnh lên!");
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrls = product?.images || [];
    if (files.length > 0) {
      const uploadedUrls = await handleUpload();
      if (uploadedUrls.length > 0) imageUrls = [...imageUrls, ...uploadedUrls];
    }

    try {
      if (product) {
        await axios.put(`${API_URL}/${product.product_id}`, { ...form, images: imageUrls });
        toast.success("✅ Đã cập nhật sản phẩm!");
      } else {
        await axios.post(API_URL, { ...form, images: imageUrls });
        toast.success("🎉 Đã thêm sản phẩm mới!");
      }
      onClose();
      refresh?.();
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi lưu sản phẩm!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-700">
          {product ? "🛠️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200" required />

          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" placeholder="Giá (₫)" value={form.price} onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full" required />
            <input name="stock" type="number" placeholder="Tồn kho" value={form.stock} onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="brand_id" placeholder="Thương hiệu ID" value={form.brand_id} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
            <input name="promo_id" placeholder="Mã khuyến mãi ID" value={form.promo_id} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="cpu" placeholder="CPU" value={form.cpu} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
            <input name="ram" placeholder="RAM" value={form.ram} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="ssd" placeholder="SSD" value={form.ssd} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
            <input name="vga" placeholder="VGA" value={form.vga} onChange={handleChange}
              className="border rounded-lg px-3 py-2" />
          </div>

          <input name="man_hinh" placeholder="Màn hình" value={form.man_hinh} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2" />

          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_hot" checked={form.is_hot} onChange={handleChange} />
            <span className="text-sm">🔥 Sản phẩm nổi bật</span>
          </label>

          {/* Hiển thị nhiều ảnh */}
          <div className="border rounded-lg p-3">
            <p className="text-sm font-semibold mb-2">Ảnh sản phẩm:</p>
            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt={`preview-${i}`} className="w-full h-24 object-cover rounded-lg border" />
                ))}
              </div>
            ) : (
              <div className="w-full h-32 border rounded-lg flex items-center justify-center text-gray-400 bg-gray-50 mb-2">
                Chưa có ảnh
              </div>
            )}

            <label className="flex items-center justify-center gap-2 border border-dashed border-blue-400 rounded-lg py-2 cursor-pointer hover:bg-blue-50 transition">
              <Upload size={18} className="text-blue-600" />
              <span className="text-blue-600 font-medium">Chọn nhiều ảnh</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-3">
            💾 Lưu
          </button>
        </form>
      </div>
    </div>
  );
}
