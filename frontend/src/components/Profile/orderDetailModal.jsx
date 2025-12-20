import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderDetailModal({ open, onClose, order }) {
  if (!order) return null;

  // ---- LẤY ĐÚNG DỮ LIỆU ----
  const item = order.items?.[0]; 
  const quantity = item?.quantity || 1;
  const price = item?.unit_price || 0; // đã sửa
  const total = order.total_amount || 0;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent
            className="
              w-[95vw] sm:w-[90vw] md:max-w-4xl 
              max-h-[90vh] 
              overflow-y-auto 
              rounded-2xl 
              bg-gray-50 
              p-0
            "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 space-y-6"
            >
              {/* Title */}
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Chi tiết đơn hàng #{order.order_id}
                </DialogTitle>
              </DialogHeader>

              {/* Tổng quan */}
              <Card className="p-4 sm:p-6 border bg-white rounded-xl shadow-sm">
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div>
                    <p>
                      <span className="font-medium text-gray-800">Đơn hàng:</span>{" "}
                      <span className="text-blue-600 font-semibold">#{order.order_id}</span>
                    </p>
                    <p>Ngày đặt: {new Date(order.order_date).toLocaleDateString("vi-VN")}</p>
                  </div>

                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      order.status === "Đã hủy"
                        ? "bg-red-50 text-red-600"
                        : order.status === "Đã nhận hàng"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    )}
                  >
                    {order.status}
                  </Badge>
                </div>

                {/* Sản phẩm */}
                <div className="flex gap-4">
                  <img
                    src={item?.image_url}
                    alt={item?.product_name}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />

                  <div>
                    <p className="font-medium text-gray-800 text-base">
                      {item?.product_name}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Giá: {formatCurrency(price)}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Số lượng: {quantity}
                    </p>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-sm text-gray-500">Tổng cộng</p>
                    <p className="text-red-600 font-bold text-lg">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Thông tin khách hàng */}
                <Card className="p-4 border bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold mb-3">Thông tin khách hàng</h4>

                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Họ và tên:</span>
                      <span>{order.customer_name || "Người dùng"}</span>
                    </p>

                    <p className="flex justify-between">
                      <span>Email:</span>
                      <span>{order.email || "Không có"}</span>
                    </p>

                    {/* Vì backend chưa có phone, address */}
                    <p className="flex justify-between">
                      <span>Số điện thoại:</span>
                      <span>Không có</span>
                    </p>

                    <p className="flex justify-between">
                      <span>Địa chỉ:</span>
                      <span>Không có</span>
                    </p>
                  </div>
                </Card>

                {/* Thanh toán */}
                <Card className="p-4 border bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold mb-3">Thông tin thanh toán</h4>

                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Số lượng sản phẩm:</span>
                      <span>{quantity}</span>
                    </p>

                    <p className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <span>{formatCurrency(price * quantity)}</span>
                    </p>

                    <Separator className="my-3" />

                    <p className="flex justify-between font-semibold">
                      <span>Tổng số tiền:</span>
                      <span className="text-red-600">{formatCurrency(total)}</span>
                    </p>

                    <p className="flex justify-between">
                      <span>Đã thanh toán:</span>
                      <span>
                        {order.payment?.status === "Đã thanh toán"
                          ? formatCurrency(total)
                          : "0đ"}
                      </span>
                    </p>

                    <p className="flex justify-between">
                      <span>Còn lại:</span>
                      <span className="text-red-600">
                        {order.payment?.status === "Đã thanh toán"
                          ? "0đ"
                          : formatCurrency(total)}
                      </span>
                    </p>

                  </div>
                </Card>

              </div>

            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
