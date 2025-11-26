import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import OrderCard from "./OrderCard";
import { useAuth } from "@/context/AuthContext";

export default function ProfileOrders() {
  const { user } = useAuth();
  const userId = user?.id; // lấy từ AuthContext

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: "2020-12-01",
    to: "2025-11-06",
  });

  // 🔹 Map key tab -> các trạng thái thực trong DB
  const statusMapping = {
    all: null,
    pending: [ "Chờ xác nhận"],
    confirmed: ["Đã xác nhận"],
    shipping: ["Đang vận chuyển"],
    delivered: ["Đã giao hàng"],
    cancelled: ["Đã hủy"],
  };

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang vận chuyển" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  // Nếu chưa load xong user
  if (!userId) {
    return (
      <p className="text-center py-6 text-gray-500">Đang tải tài khoản...</p>
    );
  }

  // 🛰 Lấy đơn hàng thật
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`
        );

        const formatted = res.data.map((order) => {
          const firstItem =
            Array.isArray(order.items) && order.items.length > 0
              ? order.items[0]
              : null;

          return {
            order_id: order.order_id,
            order_date: order.order_date,
            status: order.status,
            total_amount: order.total_amount,

            product_name: firstItem?.product_name || "Không có sản phẩm",
            price: firstItem?.price || 0,
            quantity: firstItem?.quantity || 0,
            image_url: firstItem?.image_url
              ? `http://localhost:5000/${firstItem.image_url}`
              : "/no-image.png",
          };
        });

        setOrders(formatted);
      } catch (err) {
        console.error("❌ Lỗi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  // 🔍 Filter theo trạng thái
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => {
          const validStatuses = statusMapping[statusFilter];
          if (!validStatuses) return true;
          return validStatuses.includes(o.status);
        });

  if (loading) {
    return (
      <p className="text-center py-6 text-gray-500">Đang tải đơn hàng...</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center sm:items-start gap-4 pb-4 group">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/20 ring-1 ring-blue-200 shadow-inner group-hover:shadow-md transition-all">
          <Package size={22} className="text-blue-600" />
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-700">
            Đơn hàng của tôi
          </h3>
          <p className="text-gray-500 text-sm mt-1 hidden sm:block">
            Quản lý các đơn hàng bạn đã đặt
          </p>
        </div>
      </div>

      {/* Tabs trạng thái */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-2 border-b border-gray-200 pb-2",
            "max-lg:overflow-x-auto whitespace-nowrap scrollbar-hide"
          )}
        >
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-all flex-shrink-0 shadow-sm",
                statusFilter === tab.key
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ lọc thời gian (chưa áp logic, chỉ UI) */}
      <div className="mt-4 w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Label className="text-gray-700 font-semibold min-w-[150px] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            Lọc theo thời gian
          </Label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-full sm:w-40 text-sm"
            />

            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-full sm:w-40 text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Danh sách đơn hàng */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Không có đơn hàng nào
          </p>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
