
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { motion } from "framer-motion";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import AdminOrderDetailModal from "./AdminOrderDetailModal";

/* =========================================
   STATUS COLORS
========================================= */
const STATUS_COLORS = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
  "Đã xác nhận": "bg-blue-100 text-blue-700",
  "Đang vận chuyển": "bg-indigo-100 text-indigo-700",
  "Đã giao hàng": "bg-green-100 text-green-700",
  "Đã hủy": "bg-red-100 text-red-700",
};

const STATUS_LIST = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Đã hủy",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [filter, setFilter] = useState("Tất cả");

  const [loading, setLoading] = useState(true);

  // MODAL
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  /* =========================================
     LOAD ORDERS
  ========================================= */
  const loadOrders = async () => {
    try {
      setLoading(true);

      // ⭐ FIX GATEWAY
      const response = await fetch(
        "http://localhost:8000/orders/api/orders"
      );

      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng");
      }

      const data = await response.json();

      // ⭐ chống crash
      const orderList = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(orderList);

    } catch (error) {
      console.error("❌ Load Orders Error:", error);

      alert("Không thể tải danh sách đơn hàng.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* =========================================
     UPDATE STATUS
  ========================================= */
  const updateStatus = async (
    orderId,
    status
  ) => {
    try {

      // ⭐ FIX GATEWAY
      const response = await fetch(
        `http://localhost:8000/orders/api/orders/update-status/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            order_status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      // reload
      loadOrders();

    } catch (error) {
      console.error("❌ Update Status Error:", error);

      alert("Không thể cập nhật trạng thái!");
    }
  };

  /* =========================================
     FILTER
  ========================================= */
  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter(
          (order) => order.status === filter
        );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* TITLE */}
        <div>
          <h2 className="text-3xl font-bold text-blue-700">
            Quản lý đơn hàng
          </h2>

          <p className="text-gray-500 mt-1">
            Theo dõi và cập nhật trạng thái đơn hàng
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 overflow-x-auto pb-2">

          {["Tất cả", ...STATUS_LIST].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition ${
                filter === status
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}

        </div>

        {/* TABLE */}
        <Card className="shadow-lg border-0 rounded-2xl bg-white">

          <CardHeader>
            <CardTitle className="text-blue-700 text-xl">
              Danh sách đơn hàng
            </CardTitle>
          </CardHeader>

          <CardContent>

            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-blue-600 animate-pulse">
                  Đang tải đơn hàng...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-blue-50 text-blue-700 h-12 text-center">
                      <th className="px-3">Mã đơn</th>
                      <th className="px-3">Người dùng</th>
                      <th className="px-3">Tổng tiền</th>
                      <th className="px-3">Ngày đặt</th>
                      <th className="px-3">Trạng thái</th>
                      <th className="px-3">Cập nhật</th>
                      <th className="px-3">Chi tiết</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-b h-14 text-center hover:bg-gray-50 transition"
                        >
                          <td className="font-semibold">
                            #{order.order_id}
                          </td>

                          <td>
                            {order.user_id}
                          </td>

                          <td className="text-green-600 font-bold">
                            {Number(
                              order.total_amount || 0
                            ).toLocaleString("vi-VN")}₫
                          </td>

                          <td className="text-gray-600">
                            {order.order_date
                              ? new Date(
                                  order.order_date
                                ).toLocaleString("vi-VN")
                              : "N/A"}
                          </td>

                          {/* STATUS */}
                          <td>
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold inline-block ${
                                STATUS_COLORS[
                                  order.status
                                ] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          {/* UPDATE */}
                          <td>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                updateStatus(
                                  order.order_id,
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[160px] bg-gray-50">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>

                              <SelectContent>
                                {STATUS_LIST.map((status) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>

                          {/* DETAIL */}
                          <td>
                            <button
                              onClick={() => {
                                setSelectedOrderId(
                                  order.order_id
                                );

                                setOpenDetail(true);
                              }}
                              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-10 text-center text-gray-500"
                        >
                          Không có đơn hàng nào
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>

      {/* MODAL */}
      <AdminOrderDetailModal
        open={openDetail}
        orderId={selectedOrderId}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}

