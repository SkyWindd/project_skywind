import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Màu trạng thái
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

  const loadOrders = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Không thể tải đơn hàng.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/api/orders/update-status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_status: status }),
    })
      .then(() => loadOrders())
      .catch(() => alert("Không thể cập nhật trạng thái!"));
  };

  const filtered =
    filter === "Tất cả" ? orders : orders.filter((o) => o.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Quản lý đơn hàng</h2>

      {/* Tabs lọc */}
      <div className="flex gap-3 mb-3 overflow-auto">
        {["Tất cả", ...STATUS_LIST].map((stt) => (
          <button
            key={stt}
            onClick={() => setFilter(stt)}
            className={`px-5 py-2 rounded-full font-medium transition whitespace-nowrap
              ${
                filter === stt
                  ? "bg-red-500 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {stt}
          </button>
        ))}
      </div>

      {/* Bảng đơn hàng FIX căn thẳng */}
      <Card className="shadow-lg border rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-lg">Danh sách đơn hàng</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center text-blue-600 font-medium">Đang tải...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-700 h-12 text-center">
                  <th className="w-[80px]">Mã đơn</th>
                  <th className="w-[110px]">Người dùng</th>
                  <th className="w-[150px]">Tổng tiền</th>
                  <th className="w-[210px]">Ngày đặt</th>
                  <th className="w-[150px]">Trạng thái</th>
                  <th className="w-[180px]">Cập nhật</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.order_id}
                    className="border-b h-14 text-center hover:bg-gray-50 transition"
                  >
                    <td className="font-semibold">#{order.order_id}</td>

                    <td>{order.user_id}</td>

                    <td className="text-green-600 font-bold">
                      {order.total_amount.toLocaleString()}₫
                    </td>

                    <td className="text-gray-600">
                      {new Date(order.order_date).toLocaleString("vi-VN")}
                    </td>

                    {/* Badge trạng thái */}
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold inline-block ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Dropdown cập nhật */}
                    <td>
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus(order.order_id, v)}
                      >
                        <SelectTrigger className="w-[150px] bg-gray-50 text-gray-700">
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>

                        <SelectContent>
                          {STATUS_LIST.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
