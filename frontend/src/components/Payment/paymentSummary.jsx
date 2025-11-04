import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Package } from "lucide-react";

export default function PaymentSummary() {
  const { cartItems, total } = useCart();
  const [totalPrice, setTotalPrice] = useState(total || 0);

  useEffect(() => {
    const savedTotal = localStorage.getItem("checkout_total_price");
    if (savedTotal) setTotalPrice(Number(savedTotal));
  }, []);

  return (
    <Card className="p-6 mb-8 border border-gray-100 shadow-md rounded-2xl bg-white hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* 🧾 Tiêu đề */}
      <div className="flex items-center gap-2 mb-4">
        <Package size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Thông tin thanh toán</h2>
      </div>

      {/* 🌈 Đường phân cách gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-400/20 via-gray-200 to-blue-400/20 mb-5"></div>

      <CardContent className="space-y-5 p-0">
        {/* 🎟️ Mã giảm giá */}
        <div className="flex gap-2">
          <Input
            placeholder="Nhập mã giảm giá (nếu có)"
            className="rounded-lg h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <Button
            variant="outline"
            className="text-blue-600 border-blue-500 hover:bg-blue-50 transition rounded-lg h-11 font-medium"
          >
            Áp dụng
          </Button>
        </div>

        {/* 💵 Chi tiết thanh toán */}
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Số lượng sản phẩm</span>
            <span className="font-medium text-gray-800">{cartItems?.length || 0}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-600">Tổng tiền hàng</span>
            <span className="font-semibold text-gray-800">
              {totalPrice.toLocaleString()}₫
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="text-green-600 font-medium">Miễn phí</span>
          </div>

          {/* Đường ngăn và tổng cộng */}
          <div className="h-[1px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 my-2"></div>

          <div className="flex justify-between items-center font-semibold text-base">
            <span className="text-gray-800">Tổng tiền</span>
            <span className="text-blue-700 text-lg font-bold">
              {totalPrice.toLocaleString()}₫
            </span>
          </div>
        </div>

        {/* 🧾 Ghi chú nhỏ */}
        <p className="text-xs text-gray-500 italic mt-3 text-right">
          * Giá đã bao gồm VAT và được làm tròn.
        </p>
      </CardContent>
    </Card>
  );
}
