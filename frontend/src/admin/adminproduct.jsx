import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Save,
} from "lucide-react";

import { toast } from "sonner";

import ProductModal from "@/admin/productmodal";

export default function AdminProduct() {
  const [products, setProducts] = useState([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [savingId, setSavingId] =
    useState(null);

  const [editedProducts, setEditedProducts] =
    useState({});

  const API_URL =
    "http://localhost:5001/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // LOAD PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}?include=images`
      );

      const fixedProducts = (res.data || []).map(
        (p) => ({
          ...p,

          // luôn giữ giá gốc
          old_price:
            p.old_price || p.price,

          // % giảm mặc định
          discount_percent:
            p.discount_percent || 0,
        })
      );

      setProducts(fixedProducts);
    } catch (err) {
      console.error(
        "GET PRODUCTS ERROR:",
        err
      );

      toast.error(
        "Không thể tải sản phẩm ❌"
      );
    }
  };

  // =========================
  // TÍNH GIÁ SAU GIẢM
  // =========================
  const calcDiscountPrice = (
    oldPrice,
    discountPercent
  ) => {
    const basePrice = Number(
      oldPrice || 0
    );

    const discount = Number(
      discountPercent || 0
    );

    if (!basePrice) return 0;

    return Math.round(
      basePrice -
        (basePrice * discount) / 100
    );
  };

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    product,
    field,
    value
  ) => {
    let updatedProduct = {
      ...product,
    };

    // STOCK
    if (field === "stock") {
      updatedProduct.stock =
        Number(value);
    }

    // DISCOUNT
    if (
      field === "discount_percent"
    ) {
      const discount =
        Number(value);

      updatedProduct.discount_percent =
        discount;

      // QUAN TRỌNG:
      // luôn tính từ GIÁ GỐC
      updatedProduct.price =
        calcDiscountPrice(
          updatedProduct.old_price,
          discount
        );
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.product_id ===
        product.product_id
          ? updatedProduct
          : p
      )
    );

    setEditedProducts((prev) => ({
      ...prev,
      [product.product_id]: true,
    }));
  };

  // =========================
  // SAVE
  // =========================
  const handleRowSave = async (
    product
  ) => {
    try {
      setSavingId(product.product_id);

      const payload = {
        stock: Number(product.stock),

        // GIÁ GỐC KHÔNG ĐỔI
        old_price: Number(
          product.old_price
        ),

        // % GIẢM
        discount_percent: Number(
          product.discount_percent
        ),

        // GIÁ SAU GIẢM
        price: Number(product.price),
      };

      console.log(
        "SAVE PAYLOAD:",
        payload
      );

      await axios.put(
        `${API_URL}/${product.product_id}`,
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      toast.success(
        `💾 Đã lưu "${product.name}"`
      );

      // remove edited state
      setEditedProducts((prev) => {
        const updated = {
          ...prev,
        };

        delete updated[
          product.product_id
        ];

        return updated;
      });

      // reload
      fetchProducts();
    } catch (err) {
      console.error(
        "SAVE ERROR:",
        err
      );

      toast.error(
        "Không thể lưu sản phẩm ❌"
      );
    } finally {
      setSavingId(null);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xoá sản phẩm này không?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/${id}`
      );

      toast.success(
        "🗑️ Đã xoá sản phẩm!"
      );

      fetchProducts();
    } catch (err) {
      console.error(
        "DELETE ERROR:",
        err
      );

      toast.error(
        "Không thể xoá sản phẩm ❌"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg min-h-screen">
      {/* HEADER */}
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
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="p-3">
              ID
            </th>

            <th className="p-3">
              Tên
            </th>

            <th className="p-3">
              Tồn kho
            </th>

            <th className="p-3">
              Giá gốc
            </th>

            <th className="p-3">
              % Giảm
            </th>

            <th className="p-3">
              Giá sau giảm
            </th>

            <th className="p-3 text-center">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr
                key={p.product_id}
                className="border-t hover:bg-gray-50"
              >
                {/* ID */}
                <td className="p-3">
                  {p.product_id}
                </td>

                {/* NAME */}
                <td className="p-3 font-medium">
                  {p.name}
                </td>

                {/* STOCK */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={
                        p.stock || 0
                      }
                      onChange={(e) =>
                        handleChange(
                          p,
                          "stock",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1 w-24 text-center"
                    />

                    {savingId ===
                      p.product_id && (
                      <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </td>

                {/* GIÁ GỐC */}
                <td className="p-3 text-gray-600 font-medium">
                  {Number(
                    p.old_price
                  ).toLocaleString()}
                  ₫
                </td>

                {/* % GIẢM */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      step="1"
                      value={
                        p.discount_percent
                      }
                      onChange={(e) =>
                        handleChange(
                          p,
                          "discount_percent",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1 w-20 text-center"
                    />

                    <span>%</span>
                  </div>
                </td>

                {/* GIÁ SAU GIẢM */}
                <td className="p-3 text-green-600 font-bold">
                  {Number(
                    p.price
                  ).toLocaleString()}
                  ₫
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex gap-3 justify-center">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setSelectedProduct(
                          p
                        );

                        setOpenModal(
                          true
                        );
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* SAVE */}
                    {editedProducts[
                      p.product_id
                    ] && (
                      <button
                        onClick={() =>
                          handleRowSave(
                            p
                          )
                        }
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(
                          p.product_id
                        )
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-gray-500"
              >
                Không có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      <ProductModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);

          setSelectedProduct(
            null
          );

          fetchProducts();
        }}
        product={selectedProduct}
      />
    </div>
  );
}