import { X } from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";

export default function AdminOrderDetailModal({ open, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;

    setLoading(true);
    axiosClient
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [open, orderId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-700">
          📦 Chi tiết đơn hàng #{orderId}
        </h2>

        {loading || !order ? (
          <p>Đang tải...</p>
        ) : (
          <>
            {/* Thông tin chung */}
            <div className="mb-4 space-y-1 text-sm">
              <p><b>Người dùng:</b> {order.user_id}</p>
              <p><b>Ngày đặt:</b> {order.order_date}</p>
              <p><b>Trạng thái:</b> {order.status}</p>
              <p><b>Tổng tiền:</b> {order.total_amount.toLocaleString()}₫</p>
              <p>
                <b>Thanh toán:</b> {order.payment.method} – {order.payment.status}
              </p>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 border rounded-lg p-3 items-center"
                >
                  <img
                    src={
                      item.image_url
                        ? `http://localhost:5000/${item.image_url}`
                        : "/no-image.png"
                    }
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      SL: {item.quantity} × {item.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
