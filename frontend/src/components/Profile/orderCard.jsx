import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import OrderDetailModal from "./OrderDetailModal";

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="
          p-4 sm:p-5 
          rounded-2xl 
          border border-gray-200 
          shadow-sm hover:shadow-md 
          transition-all duration-300 
          bg-white hover:bg-gray-50
        "
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 text-xs sm:text-sm text-gray-600">
          <p className="truncate">
            <span className="font-medium text-gray-800">Đơn hàng:</span>{" "}
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              #{order.order_id}
            </span>
          </p>
          <p className="mt-1 sm:mt-0 text-gray-500">
            Ngày đặt hàng:{" "}
            <span className="text-gray-700 font-medium">
              {new Date(order.order_date).toLocaleDateString("vi-VN")}
            </span>
          </p>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Ảnh sản phẩm */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={order.image_url}
              alt={order.product_name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border"
            />
          </div>

          {/* Nội dung */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="font-semibold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2">
              {order.product_name}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Giá: {order.price.toLocaleString()}₫
            </p>

            {/* Tổng tiền + trạng thái */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm font-medium text-gray-700">
                Tổng thanh toán:{" "}
                <span className="text-red-600 font-semibold">
                  {order.total_amount.toLocaleString()}₫
                </span>
              </p>

              <Badge
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium w-fit mx-auto sm:mx-0",
                  order.status === "Đã hủy"
                    ? "bg-red-100 text-red-600"
                    : order.status === "Đã nhận hàng"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {order.status}
              </Badge>
            </div>

            {/* Nút xem chi tiết */}
            <div className="mt-3 flex justify-center sm:justify-end">
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={() => setOpen(true)}
              >
                Xem chi tiết →
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal chi tiết */}
      <OrderDetailModal
        open={open}
        onClose={() => setOpen(false)}
        order={order}
      />
    </>
  );
}
