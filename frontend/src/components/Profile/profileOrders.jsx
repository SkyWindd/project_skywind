import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import OrderCard from "./OrderCard";

export default function ProfileOrders() {
  const [orders] = useState([
    {
      order_id: "WN0303785464",
      order_date: "2025-11-04",
      status: "Đã hủy",
      product_name:
        "LAPTOP LENOVO IDEAPAD SLIM 3 14IRH10 I5-13420H/16GB/512GB/14.0 WUXGA/WIN11/XÁM",
      price: 16990000,
      total_amount: 14540000,
      image_url:
        "https://cdn.tgdd.vn/Products/Images/44/322052/Slider/laptop-lenovo-ideapad-slim-3-14irh10-i5-83k00008vn-1.jpg",
    },
    {
      order_id: "0157S2511000385",
      order_date: "2025-11-03",
      status: "Đã nhận hàng",
      product_name:
        "PIN DỰ PHÒNG ANKER 25.000MAH 165W TÍCH HỢP CÁP RÚT GỌN A1695 BẠC",
      price: 2490000,
      total_amount: 1634000,
      image_url:
        "https://cdn.tgdd.vn/Products/Images/57/322288/pin-sac-du-phong-anker-a1695-bac-thumb-600x600.jpg",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: "2020-12-01",
    to: "2025-11-06",
  });

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang vận chuyển" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (o) => o.status?.toLowerCase().includes(statusFilter)
        );

  return (
    <div className="space-y-6">
     {/* Header */}
        <div className="flex items-center sm:items-start gap-4 pb-4 group transition-all duration-300">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/20 ring-1 ring-blue-200 shadow-inner group-hover:shadow-md transition-all duration-300">
            <Package size={22} className="text-blue-600 group-hover:scale-110 transition-transform duration-200" />
        </div>

        {/* Title */}
        <div className="flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-700 tracking-tight leading-snug">
            Đơn hàng của tôi
            </h3>
            <p className="hidden sm:block text-gray-500 text-sm mt-1">
            Quản lý các đơn hàng bạn đã đặt
            </p>
            <p className="sm:hidden text-gray-500 text-xs mt-1">
            Xem đơn hàng của bạn
            </p>
        </div>
        </div>



      {/* Tabs trạng thái */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-2 border-b border-gray-200 pb-2",
            "max-lg:overflow-x-auto max-lg:scroll-smooth max-lg:whitespace-nowrap max-lg:snap-x max-lg:snap-mandatory scrollbar-hide",
            "lg:flex-wrap lg:justify-start"
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex-shrink-0 snap-start whitespace-nowrap shadow-sm",
                statusFilter === tab.key
                  ? "bg-red-500 text-white shadow-md scale-[1.02]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ lọc thời gian */}
      <div className="mt-4 w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Label className="text-gray-700 font-semibold min-w-[150px] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            Lọc theo thời gian
          </Label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
                className="w-full sm:w-40 text-sm"
              />
              <span className="text-gray-500 hidden sm:inline">→</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
                className="w-full sm:w-40 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="bg-white hover:bg-gray-50 shadow-sm flex-shrink-0"
              >
                <Calendar className="w-4 h-4 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Danh sách đơn hàng */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Không có đơn hàng nào trong khoảng thời gian này.
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
