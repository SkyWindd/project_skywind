import React, { useState } from "react";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderDetailModal({
  open,
  onClose,
  order,
  onCancelSuccess,
}) {
  const [loadingCancel, setLoadingCancel] = useState(false);

  if (!order) return null;

  // ===== FIX TOÀN BỘ ITEMS =====
  const items =
    order.items?.length > 0
      ? order.items
      : order.products?.length > 0
      ? order.products
      : [
          {
            product_name:
              order.product_name ||
              order.name ||
              order.product?.name ||
              "Sản phẩm",

            image_url:
              order.image_url ||
              order.image ||
              order.thumbnail ||
              order.product?.image_url ||
              order.product?.image ||
              "https://placehold.co/200x200?text=No+Image",

            quantity:
              order.quantity ||
              order.qty ||
              order.product_quantity ||
              1,

            unit_price:
              order.unit_price ||
              order.price ||
              order.product_price ||
              order.total_amount ||
              0,
          },
        ];

  // ===== TỔNG SỐ LƯỢNG =====
  const totalQuantity = items.reduce((sum, item) => {
    return (
      sum +
      Number(
        item.quantity ||
          item.qty ||
          item.product_quantity ||
          1
      )
    );
  }, 0);

  // ===== TỔNG TIỀN =====
  const totalAmount =
    order.total_amount ||
    order.total ||
    order.totalPrice ||
    items.reduce((sum, item) => {
      const qty =
        item.quantity ||
        item.qty ||
        item.product_quantity ||
        1;

      const price =
        item.unit_price ||
        item.price ||
        item.product_price ||
        0;

      return sum + qty * price;
    }, 0);

  // ===== CUSTOMER INFO =====
  const customerName =
    order.customer_name ||
    order.full_name ||
    order.receiver_name ||
    order.name ||
    order.user_name ||
    order.customer?.name ||
    localStorage.getItem("customer_name") ||
    "Người dùng";

  const customerEmail =
    order.email ||
    order.customer_email ||
    order.user_email ||
    order.customer?.email ||
    localStorage.getItem("customer_email") ||
    "Không có";

  const customerPhone =
    order.phone ||
    order.phone_number ||
    order.customer_phone ||
    order.customer?.phone ||
    localStorage.getItem("customer_phone") ||
    "Không có";

  const customerAddress =
    order.address ||
    order.shipping_address ||
    order.customer_address ||
    order.customer?.address ||
    localStorage.getItem("customer_address") ||
    "Không có";

  // ===== CHO PHÉP HỦY =====
  const canCancel =
    order.status === "Chờ xác nhận" ||
    order.status === "Đã xác nhận";

  // ===== HỦY ĐƠN =====
  const handleCancelOrder = async () => {
    try {
      const confirmCancel = window.confirm(
        "Bạn có chắc muốn hủy đơn hàng này không?"
      );

      if (!confirmCancel) return;

      setLoadingCancel(true);

      await axios.put(
        `http://localhost:5000/api/orders/${order.order_id}/cancel`
      );

      alert("Hủy đơn hàng thành công");

      if (onCancelSuccess) {
        onCancelSuccess();
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Không thể hủy đơn hàng"
      );
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent
            className="
              w-[95vw]
              sm:w-[90vw]
              md:max-w-5xl
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              bg-gray-50
              p-0
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 40,
              }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 space-y-6"
            >
              {/* ===== TITLE ===== */}
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Chi tiết đơn hàng #
                  {order.order_id || order.id}
                </DialogTitle>
              </DialogHeader>

              {/* ===== TỔNG QUAN ===== */}
              <Card className="p-4 sm:p-6 border bg-white rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-medium text-gray-800">
                      Đơn hàng:
                      <span className="text-blue-600 font-semibold ml-1">
                        #
                        {order.order_id || order.id}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Ngày đặt:
                      {" "}
                      {order.order_date
                        ? new Date(
                            order.order_date
                          ).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Không có"}
                    </p>
                  </div>

                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      order.status === "Đã hủy"
                        ? "bg-red-50 text-red-600"
                        : order.status === "Đã nhận hàng"
                        ? "bg-green-50 text-green-700"
                        : order.status === "Đã xác nhận"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-yellow-50 text-yellow-700"
                    )}
                  >
                    {order.status ||
                      "Chờ xác nhận"}
                  </Badge>
                </div>

                {/* ===== PRODUCTS ===== */}
                <div className="space-y-5">
                  {items.map((item, index) => {
                    const quantity =
                      item.quantity ||
                      item.qty ||
                      item.product_quantity ||
                      1;

                    const price =
                      item.unit_price ||
                      item.price ||
                      item.product_price ||
                      0;

                    const image =
                      item.image_url ||
                      item.image ||
                      item.thumbnail ||
                      item.product_image ||
                      item.product?.image_url ||
                      "https://placehold.co/200x200?text=No+Image";

                    const productName =
                      item.product_name ||
                      item.name ||
                      item.title ||
                      item.product?.name ||
                      "Sản phẩm";

                    return (
                      <div
                        key={index}
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          gap-4
                          border-b
                          pb-4
                        "
                      >
                        <img
                          src={image}
                          alt={productName}
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/200x200?text=No+Image";
                          }}
                          className="
                            w-28
                            h-28
                            object-cover
                            rounded-lg
                            border
                            bg-gray-100
                          "
                        />

                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-base">
                            {productName}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            Giá:
                            {" "}
                            {formatCurrency(price)}
                          </p>

                          <p className="text-sm text-gray-500">
                            Số lượng:
                            {" "}
                            {quantity}
                          </p>

                          <p className="text-sm font-medium text-red-600 mt-1">
                            Thành tiền:
                            {" "}
                            {formatCurrency(
                              quantity * price
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ===== TOTAL ===== */}
                <div className="flex justify-between items-center mt-6">
                  <div>
                    {canCancel && (
                      <Button
                        variant="destructive"
                        disabled={loadingCancel}
                        onClick={handleCancelOrder}
                      >
                        {loadingCancel
                          ? "Đang hủy..."
                          : "Hủy đơn hàng"}
                      </Button>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Tổng cộng
                    </p>

                    <p className="text-red-600 font-bold text-2xl">
                      {formatCurrency(
                        totalAmount
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              {/* ===== INFO ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ===== CUSTOMER ===== */}
                <Card className="p-4 border bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold mb-4 text-lg">
                    Thông tin khách hàng
                  </h4>

                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Họ và tên:
                      </span>

                      <span className="font-medium text-right">
                        {customerName}
                      </span>
                    </p>

                    <p className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Email:
                      </span>

                      <span className="font-medium text-right break-all">
                        {customerEmail}
                      </span>
                    </p>

                    <p className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Số điện thoại:
                      </span>

                      <span className="font-medium text-right">
                        {customerPhone}
                      </span>
                    </p>

                    <p className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Địa chỉ:
                      </span>

                      <span className="font-medium text-right">
                        {customerAddress}
                      </span>
                    </p>
                  </div>
                </Card>

                {/* ===== PAYMENT ===== */}
                <Card className="p-4 border bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold mb-4 text-lg">
                    Thông tin thanh toán
                  </h4>

                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">
                        Số lượng sản phẩm:
                      </span>

                      <span className="font-medium">
                        {totalQuantity}
                      </span>
                    </p>

                    <p className="flex justify-between">
                      <span className="text-gray-500">
                        Tổng tiền hàng:
                      </span>

                      <span className="font-medium">
                        {formatCurrency(
                          totalAmount
                        )}
                      </span>
                    </p>

                    <Separator className="my-3" />

                    <p className="flex justify-between font-semibold text-base">
                      <span>
                        Tổng số tiền:
                      </span>

                      <span className="text-red-600">
                        {formatCurrency(
                          totalAmount
                        )}
                      </span>
                    </p>

                    <p className="flex justify-between">
                      <span className="text-gray-500">
                        Đã thanh toán:
                      </span>

                      <span className="font-medium">
                        {order.payment
                          ?.status ===
                        "Đã thanh toán"
                          ? formatCurrency(
                              totalAmount
                            )
                          : "0đ"}
                      </span>
                    </p>

                    <p className="flex justify-between">
                      <span className="text-gray-500">
                        Còn lại:
                      </span>

                      <span className="text-red-600 font-medium">
                        {order.payment
                          ?.status ===
                        "Đã thanh toán"
                          ? "0đ"
                          : formatCurrency(
                              totalAmount
                            )}
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