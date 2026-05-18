import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ProductModal({
  open,
  onClose,
  product,
  refresh,
}) {
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

  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  // 🔥 Flask backend
  const API_URL = "http://localhost:5001/api/products";
  const BASE_URL = "http://localhost:5001";

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

      if (product.images?.length > 0) {
        setPreviews(
          product.images.map((img) =>
            img.startsWith("http")
              ? img
              : `${BASE_URL}/${img}`
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

  // =========================
  // 🔥 INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // 🔥 IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    setFiles(selectedFiles);

    const newPreviews =
      selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setPreviews(newPreviews);
  };

  // =========================
  // 🔥 SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // 🔥 append fields
      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      // 🔥 append images
      files.forEach((file) => {
        formData.append("images", file);
      });

      // 🔥 UPDATE
      if (product) {
        await axios.put(
          `${API_URL}/${product.product_id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "✅ Đã cập nhật sản phẩm!"
        );
      }

      // 🔥 CREATE
      else {
        await axios.post(
          API_URL,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "🎉 Đã thêm sản phẩm mới!"
        );
      }

      refresh?.();
      onClose();
    } catch (err) {
      console.log(err);

      toast.error(
        "❌ Lỗi khi lưu sản phẩm!"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-700">
          {product
            ? "🛠️ Sửa sản phẩm"
            : "➕ Thêm sản phẩm mới"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              placeholder="Giá (₫)"
              value={form.price}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />

            <input
              name="stock"
              type="number"
              placeholder="Tồn kho"
              value={form.stock}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="brand_id"
              placeholder="Thương hiệu ID"
              value={form.brand_id}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <input
              name="promo_id"
              placeholder="Mã khuyến mãi ID"
              value={form.promo_id}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="cpu"
              placeholder="CPU"
              value={form.cpu}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <input
              name="ram"
              placeholder="RAM"
              value={form.ram}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="ssd"
              placeholder="SSD"
              value={form.ssd}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <input
              name="vga"
              placeholder="VGA"
              value={form.vga}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <input
            name="man_hinh"
            placeholder="Màn hình"
            value={form.man_hinh}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_hot"
              checked={form.is_hot}
              onChange={handleChange}
            />

            <span className="text-sm">
              🔥 Sản phẩm nổi bật
            </span>
          </label>

          {/* 🔥 IMAGE */}
          <div className="border rounded-lg p-3">
            <p className="text-sm font-semibold mb-2">
              Ảnh sản phẩm:
            </p>

            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-32 border rounded-lg flex items-center justify-center text-gray-400 bg-gray-50 mb-2">
                Chưa có ảnh
              </div>
            )}

            <label className="flex items-center justify-center gap-2 border border-dashed border-blue-400 rounded-lg py-2 cursor-pointer hover:bg-blue-50 transition">
              <Upload
                size={18}
                className="text-blue-600"
              />

              <span className="text-blue-600 font-medium">
                Chọn nhiều ảnh
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-3"
          >
            💾 Lưu
          </button>
        </form>
      </div>
    </div>
  );
}