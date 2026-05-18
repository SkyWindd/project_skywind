
import { X, Package } from "lucide-react";

import { useEffect, useState } from "react";

import axiosClient from "@/api/axiosClient";

export default function AdminOrderDetailModal({
  open,
  onClose,
  orderId,
}) {

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD ORDER DETAIL
  // =========================
  useEffect(() => {

    if (!open || !orderId) return;

    const fetchOrderDetail = async () => {

      try {

        setLoading(true);

        // ⭐ FIX URL
        const res = await axiosClient.get(
          `/orders/api/orders/${orderId}`
        );

        console.log(
          "ORDER DETAIL:",
          res.data
        );

        setOrder(res.data);

      } catch (error) {

        console.error(
          "ORDER DETAIL ERROR:",
          error.response?.data || error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchOrderDetail();

  }, [open, orderId]);

  // CLOSE
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white w-[850px] max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-red-500 transition"
        >
          <X size={28} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <Package className="text-blue-600" />

          <h2 className="text-3xl font-bold text-blue-700">
            Chi tiết đơn hàng #{orderId}
          </h2>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="py-20 text-center text-gray-500 text-lg">
            Đang tải...
          </div>

        ) : !order ? (

          <div className="py-20 text-center text-red-500 text-lg">
            Không tìm thấy đơn hàng
          </div>

        ) : (

          <>
            {/* ORDER INFO */}
            <div className="grid grid-cols-2 gap-5 mb-8">

              <div className="bg-gray-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Mã đơn hàng
                </p>

                <p className="font-bold text-xl">
                  #{order.order_id}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Người dùng
                </p>

                <p className="font-bold text-xl">
                  {order.user_id}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Tổng tiền
                </p>

                <p className="font-bold text-2xl text-green-600">
                  {Number(
                    order.total_amount || 0
                  ).toLocaleString("vi-VN")}₫
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Trạng thái
                </p>

                <p className="font-bold text-xl text-blue-600">
                  {order.status}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-5 col-span-2">

                <p className="text-sm text-gray-500">
                  Ngày đặt
                </p>

                <p className="font-bold text-lg">
                  {order.order_date
                    ? new Date(
                        order.order_date
                      ).toLocaleString("vi-VN")
                    : "N/A"}
                </p>

              </div>

              {/* PAYMENT */}
              {order.payment && (

                <div className="bg-gray-50 rounded-2xl p-5 col-span-2">

                  <p className="text-sm text-gray-500">
                    Thanh toán
                  </p>

                  <p className="font-bold text-lg">
                    {order.payment.method}
                    {" — "}
                    {order.payment.status}
                  </p>

                </div>

              )}

            </div>

            {/* PRODUCTS */}
            <div>

              <h3 className="text-2xl font-bold mb-5 text-blue-700">
                Sản phẩm
              </h3>

              {order.items &&
              order.items.length > 0 ? (

                <div className="space-y-4">

                  {order.items.map(
                    (item, i) => (

                      <div
                        key={i}
                        className="flex gap-4 border rounded-2xl p-4 items-center hover:bg-gray-50 transition"
                      >

                        {/* IMAGE */}
                        <img
                          src={
                            item.image_url
                              ? `http://localhost:8000/products/${item.image_url}`
                              : "/no-image.png"
                          }
                          alt=""
                          className="w-24 h-24 object-cover rounded-xl border"
                        />

                        {/* INFO */}
                        <div className="flex-1">

                          <p className="font-bold text-lg">
                            {item.product_name}
                          </p>

                          <p className="text-gray-500 mt-1">
                            Số lượng:
                            {" "}
                            {item.quantity}
                          </p>

                          <p className="text-gray-500">
                            Giá:
                            {" "}
                            {Number(
                              item.price
                            ).toLocaleString("vi-VN")}₫
                          </p>

                        </div>

                        {/* TOTAL */}
                        <div className="text-right">

                          <p className="text-sm text-gray-500">
                            Thành tiền
                          </p>

                          <p className="text-xl font-bold text-green-600">

                            {Number(
                              item.price *
                              item.quantity
                            ).toLocaleString("vi-VN")}₫

                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div className="text-gray-500">
                  Không có sản phẩm
                </div>

              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

