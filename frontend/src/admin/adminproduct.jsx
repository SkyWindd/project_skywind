
import { useEffect, useState } from "react";

import axios from "axios";

import { toast } from "sonner";

import {
  Save,
  Package,
} from "lucide-react";

// ======================================
// API
// ======================================
const API_URL =
  "http://localhost:8000/products/api/products";

// ======================================
// CALC DISCOUNT PRICE
// ======================================
const calcDiscountPrice = (
  price,
  discount
) => {

  const p = Number(price) || 0;

  const d = Number(discount) || 0;

  return Math.round(
    p - (p * d) / 100
  );
};

export default function AdminProduct() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [editedProducts, setEditedProducts] =
    useState({});

  // ======================================
  // LOAD PRODUCTS
  // ======================================
  const fetchProducts = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        API_URL
      );

      console.log(
        "RAW PRODUCT API:",
        res.data
      );

      let productList = [];

      // ======================================
      // PARSE RESPONSE
      // ======================================
      if (
        Array.isArray(res.data)
      ) {

        productList = res.data;

      } else if (
        Array.isArray(
          res.data.products
        )
      ) {

        productList =
          res.data.products;

      } else if (
        Array.isArray(
          res.data.data
        )
      ) {

        productList =
          res.data.data;

      } else {

        productList = [];
      }

      console.log(
        "PARSED PRODUCTS:",
        productList
      );

      setProducts(productList);

    } catch (error) {

      console.error(
        "GET PRODUCTS ERROR:",
        error.response?.data || error
      );

      toast.error(
        "Không thể tải sản phẩm ❌"
      );

    } finally {

      setLoading(false);

    }
  };

  // ======================================
  // LOAD
  // ======================================
  useEffect(() => {

    fetchProducts();

  }, []);

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (
    p,
    field,
    value
  ) => {

    const updated = {

      ...p,

      [field]:
        value === ""
          ? ""
          : Number(value),
    };

    // ======================================
    // REALTIME DISCOUNT
    // ======================================
    if (
      field === "discount_percent"
    ) {

      const originalPrice =
        Number(
          p.old_price || p.price
        );

      updated.discount_percent =
        Number(value) || 0;

      updated.price =
        calcDiscountPrice(
          originalPrice,
          updated.discount_percent
        );
    }

    // ======================================
    // STOCK
    // ======================================
    if (field === "stock") {

      updated.stock =
        value === ""
          ? ""
          : Number(value);
    }

    setProducts((prev) =>
      prev.map((prod) =>
        prod.product_id === p.product_id
          ? updated
          : prod
      )
    );

    setEditedProducts((prev) => ({
      ...prev,
      [p.product_id]: true,
    }));
  };

  // ======================================
  // SAVE PRODUCT
  // ======================================
  const handleSave = async (p) => {

    try {

      const payload = {

        stock:
          Number(p.stock) || 0,

        discount_percent:
          Number(
            p.discount_percent
          ) || 0,

        discount_price:
          calcDiscountPrice(
            Number(
              p.old_price || p.price
            ),
            Number(
              p.discount_percent || 0
            )
          ),
      };

      console.log(
        "UPDATE PRODUCT:",
        payload
      );

      const res = await axios.put(
        `${API_URL}/${p.product_id}`,
        payload
      );

      console.log(
        "UPDATE RESPONSE:",
        res.data
      );

      toast.success(
        "Cập nhật thành công ✅"
      );

      setEditedProducts((prev) => ({
        ...prev,
        [p.product_id]: false,
      }));

      fetchProducts();

    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.error ||
        "Không thể cập nhật ❌"
      );
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {

    return (
      <div className="flex items-center justify-center h-60">

        <p className="text-lg text-gray-500 animate-pulse">
          Đang tải sản phẩm...
        </p>

      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="flex items-center gap-3 mb-6">

        <Package
          className="text-blue-600"
          size={32}
        />

        <div>

          <h2 className="text-3xl font-bold text-blue-700">
            Quản lý sản phẩm
          </h2>

          <p className="text-gray-500 mt-1">
            Chỉnh sửa tồn kho và giảm giá
          </p>

        </div>

      </div>

      {/* ======================================
          TABLE
      ====================================== */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow">

        <table className="w-full">

          {/* ======================================
              HEAD
          ====================================== */}
          <thead className="bg-blue-600 text-white">

            <tr className="h-14 text-center">

              <th>ID</th>

              <th>Ảnh</th>

              <th>Tên SP</th>

              <th>Giá gốc</th>

              <th>% Giảm</th>

              <th>Giá sau giảm</th>

              <th>Tồn kho</th>

              <th>Lưu</th>

            </tr>

          </thead>

          {/* ======================================
              BODY
          ====================================== */}
          <tbody>

            {products.length > 0 ? (

              products.map((p) => (

                <tr
                  key={p.product_id}
                  className="border-b text-center hover:bg-gray-50 transition h-24"
                >

                  {/* ID */}
                  <td>
                    #{p.product_id}
                  </td>

                  {/* IMAGE */}
                  <td>

                    <img
                      src={
                        p.image_url
                          ? `http://localhost:8000/products/${p.image_url}`
                          : "/no-image.png"
                      }
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border mx-auto"
                    />

                  </td>

                  {/* NAME */}
                  <td className="font-semibold">
                    {p.name}
                  </td>

                  {/* OLD PRICE */}
                  <td className="text-gray-600">

                    {Number(
                      p.old_price ?? p.price
                    ).toLocaleString("vi-VN")} ₫

                  </td>

                  {/* DISCOUNT */}
                  <td>

                    <input
                      type="number"

                      min={0}

                      max={100}

                      value={
                        p.discount_percent || 0
                      }

                      onChange={(e) =>
                        handleChange(
                          p,
                          "discount_percent",
                          e.target.value
                        )
                      }

                      className="w-24 border rounded-lg px-3 py-2 text-center"
                    />

                  </td>

                  {/* DISCOUNT PRICE */}
                  <td className="text-green-600 font-bold">

                    {calcDiscountPrice(
                      Number(
                        p.old_price ?? p.price
                      ),
                      Number(
                        p.discount_percent || 0
                      )
                    ).toLocaleString("vi-VN")} ₫

                  </td>

                  {/* STOCK */}
                  <td>

                    <input
                      type="number"

                      min={0}

                      value={p.stock || 0}

                      onChange={(e) =>
                        handleChange(
                          p,
                          "stock",
                          e.target.value
                        )
                      }

                      className="w-24 border rounded-lg px-3 py-2 text-center"
                    />

                  </td>

                  {/* SAVE */}
                  <td>

                    <button
                      onClick={() =>
                        handleSave(p)
                      }

                      disabled={
                        !editedProducts[
                          p.product_id
                        ]
                      }

                      className={`px-4 py-2 rounded-xl flex items-center gap-2 mx-auto transition ${
                        editedProducts[
                          p.product_id
                        ]
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >

                      <Save size={18} />

                      Lưu

                    </button>

                  </td>

                </tr>
              ))

            ) : (

              <tr>

                <td
                  colSpan={8}
                  className="py-12 text-gray-500 text-center"
                >
                  Không có sản phẩm
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

