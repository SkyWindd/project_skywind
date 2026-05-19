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
  const [loadingCancel, setLoadingCancel] =
    useState(false);

  if (!order) return null;

  // ===== PRODUCTS =====
  const items =
    order.items?.length > 0
      ? order.items
      : [
          {
            product_name:
              order.product_name ||
              "Sản phẩm",

            image_url:
              order.image_url
                ? order.image_url.startsWith(
                    "http"
                  )
                  ? order.image_url
                  : `http://localhost:8000/products/${order.image_url}`
                : "/no-image.png",

            quantity:
              order.quantity || 1,

            price:
              order.price ||
              order.total_amount ||
              0,
          },
        ];

  // ===== TOTAL =====
  const totalQuantity = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 1),
    0
  );

  const totalAmount =
    order.total_amount ||
    items.reduce(
      (sum, item) =>
        sum +
        item.quantity * item.price,
      0
    );

  // ===== CANCEL =====
  const canCancel =
    order.status === "Chờ xác nhận" ||
    order.status === "Đã xác nhận";

  // ===== CANCEL ORDER =====
  const handleCancelOrder =
    async () => {
      const confirmCancel =
        window.confirm(
          "Bạn có chắc muốn hủy đơn hàng này không?"
        );

      if (!confirmCancel) return;

      try {
        setLoadingCancel(true);

        await axios.put(
          `http://localhost:5004/api/orders/cancel/${order.order_id}`
        );

        // ===== UPDATE UI =====
        if (onCancelSuccess) {
          onCancelSuccess(
            order.order_id
          );
        }

        alert(
          "Hủy đơn hàng thành công"
        );

        onClose();
      } catch (error) {
        console.error(error);

        alert(
          error?.response?.data
            ?.error ||
            "Không thể hủy đơn hàng"
        );
      } finally {
        setLoadingCancel(false);
      }
    };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onOpenChange={onClose}
        >
          <DialogContent
            aria-describedby={
              undefined
            }
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
              transition={{
                duration: 0.3,
              }}
              className="p-4 sm:p-6 space-y-6"
            >
              {/* ===== TITLE ===== */}
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Chi tiết đơn hàng #
                  {order.order_id ||
                    order.id}
                </DialogTitle>
              </DialogHeader>

              {/* ===== ORDER INFO ===== */}
              <Card className="p-4 sm:p-6 border bg-white rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-medium text-gray-800">
                      Đơn hàng:
                      <span className="text-blue-600 font-semibold ml-1">
                        #
                        {order.order_id ||
                          order.id}
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
                      order.status ===
                        "Đã hủy"
                        ? "bg-red-50 text-red-600"
                        : order.status ===
                          "Đã giao hàng"
                        ? "bg-green-50 text-green-700"
                        : order.status ===
                          "Đã xác nhận"
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
                  {items.map(
                    (item, index) => {
                      const imageSrc =
                        item.image_url?.startsWith(
                          "http"
                        )
                          ? item.image_url
                          : `http://localhost:8000/products/${item.image_url}`;

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
                          {/* IMAGE */}
                          <img
                            src={imageSrc}
                            alt={
                              item.product_name
                            }
                            onError={(
                              e
                            ) => {
                              e.target.src =
                                "/no-image.png";
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

                          {/* INFO */}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-base">
                              {
                                item.product_name
                              }
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                              Giá:
                              {" "}
                              {formatCurrency(
                                item.price
                              )}
                            </p>

                            <p className="text-sm text-gray-500">
                              Số lượng:
                              {" "}
                              {
                                item.quantity
                              }
                            </p>

                            <p className="text-sm font-medium text-red-600 mt-1">
                              Thành tiền:
                              {" "}
                              {formatCurrency(
                                item.quantity *
                                  item.price
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* ===== TOTAL ===== */}
                <div className="flex justify-between items-center mt-6">
                  <div>
                    {canCancel && (
                      <Button
                        variant="destructive"
                        disabled={
                          loadingCancel
                        }
                        onClick={
                          handleCancelOrder
                        }
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
                </div>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}