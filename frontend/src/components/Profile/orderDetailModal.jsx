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

export default function OrderDetailModal({ open, onClose, order }) {
  return (
    <AnimatePresence>
      {open && order && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent
            className="
              w-[95vw] sm:w-[90vw] md:max-w-4xl 
              max-h-[90vh] 
              overflow-y-auto 
              rounded-2xl 
              bg-gray-50 
              p-0
              scroll-smooth
            "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-4 sm:p-6 space-y-6"
            >
              {/* Tiêu đề */}
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight text-center sm:text-left">
                  Chi tiết đơn hàng #{order.order_id}
                </DialogTitle>
              </DialogHeader>

              {/* Tổng quan đơn hàng */}
              <Card className="p-4 sm:p-6 border border-gray-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 text-sm text-gray-600">
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium text-gray-800">
                        Đơn hàng:
                      </span>{" "}
                      <span className="text-blue-600 font-semibold">
                        #{order.order_id}
                      </span>
                    </p>
                    <p>
                      Ngày đặt hàng:{" "}
                      {new Date(order.order_date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-0 flex justify-end">
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium shadow-sm",
                        order.status === "Đã hủy"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : order.status === "Đã nhận hàng"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={order.image_url}
                      alt={order.product_name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <div>
                      <p className="font-medium text-gray-800 leading-snug text-sm sm:text-base">
                        {order.product_name}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {order.price.toLocaleString()}₫
                      </p>
                      <p className="text-gray-500 text-sm">Số lượng: 1</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Tổng cộng</p>
                    <p className="text-lg font-semibold text-red-600">
                      {order.total_amount.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              </Card>

              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Cột trái */}
                <Card className="p-4 sm:p-5 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <h4 className="font-semibold mb-3 text-gray-800 text-base">
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Họ và tên:</span>
                      <span className="font-medium text-gray-900">
                        Minh Quan Nguyen
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Số điện thoại:</span>
                      <span className="font-medium text-gray-900">0918684954</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Địa chỉ:</span>
                      <span className="text-gray-900 text-right truncate max-w-[150px] sm:max-w-none">
                        Đường Chính
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Ghi chú:</span>
                      <span className="text-gray-500">-</span>
                    </div>
                  </div>
                </Card>

                {/* Cột phải */}
                <Card className="p-4 sm:p-5 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <h4 className="font-semibold mb-3 text-gray-800 text-base">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Số lượng sản phẩm:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <span className="font-medium">
                        {order.price.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-2.450.000₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="text-green-600 font-medium">
                        Miễn phí
                      </span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between font-semibold">
                      <span>Tổng số tiền:</span>
                      <span className="text-red-600 text-base">
                        14.540.000₫
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Đã thanh toán:</span>
                      <span>0₫</span>
                    </div>
                    <div className="flex justify-between text-gray-800 font-medium">
                      <span>Còn lại:</span>
                      <span className="text-red-600 text-base">
                        14.540.000₫
                      </span>
                    </div>
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
