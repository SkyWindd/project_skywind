import React from "react";
import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import PaymentSummary from "@/components/Checkout/PaymentSummary";
import PaymentMethodCard from "@/components/Checkout/PaymentMethodCard";
import PaymentInfoBox from "@/components/Checkout/PaymentInfoBox";
import { Button } from "@/components/ui/button";

export default function CheckoutPayment() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Thanh tiến trình */}
      <CheckoutProgress step={2} />

      {/* Bảng tổng kết thanh toán */}
      <PaymentSummary />

      {/* Thông tin thanh toán */}
      <PaymentMethodCard />

      {/* Thông tin nhận hàng */}
      <PaymentInfoBox />

      {/* Tổng tiền và nút thanh toán */}
      <div className="bg-white rounded-xl border shadow-sm mt-8 p-5 flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">Tổng tiền tạm tính:</p>
          <p className="text-red-600 font-bold text-lg">14.540.000₫</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-8 py-6 rounded-lg"
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}
