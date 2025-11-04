import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import PaymentSummary from "@/components/Payment/PaymentSummary";
import PaymentMethodCard from "@/components/Payment/PaymentMethodCard";
import PaymentInfoBox from "@/components/Payment/PaymentInfoBox";
import PaymentTransferModal from "@/components/Payment/PaymentTransferModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [method, setMethod] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);

  // 🧮 Lấy tổng tiền và phương thức đã chọn từ localStorage
  useEffect(() => {
    const savedTotal = localStorage.getItem("checkout_total_price");
    const savedMethod = localStorage.getItem("payment_method_id");

    if (savedTotal) setTotal(Number(savedTotal));
    if (savedMethod) setMethod(savedMethod);
  }, []);

  // 💰 Khi nhấn nút Thanh toán
  const handlePayment = () => {
    if (!method) {
      toast.error("Vui lòng chọn phương thức thanh toán trước khi tiếp tục!");
      return;
    }

    if (method === "qr") {
      setTransferOpen(true); // 🔓 mở modal chuyển khoản
    } else if (method === "cod") {
      toast.success("✅ Đặt hàng thành công! Nhân viên sẽ liên hệ sớm.");
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error("Phương thức thanh toán không hợp lệ!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* 🧭 Thanh tiến trình */}
      <CheckoutProgress step={2} />

      {/* 💳 Tổng kết đơn hàng */}
      <PaymentSummary />

      {/* 💰 Phương thức thanh toán */}
      <PaymentMethodCard />

      {/* 📦 Thông tin nhận hàng */}
      <PaymentInfoBox />

      {/* 💸 Tổng tiền + nút thanh toán */}
      <div className="bg-white border border-gray-100 shadow-md rounded-2xl mt-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-lg transition-all duration-200">
        <div className="text-center sm:text-left">
          <p className="text-gray-500 text-sm">Tổng tiền tạm tính</p>
          <p className="text-blue-700 font-bold text-xl mt-1">
            {total.toLocaleString()}₫
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* ← Quay lại */}
          <Button
            onClick={() => navigate("/checkout-info")}
            variant="outline"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition rounded-lg py-6"
          >
            <ArrowLeft size={16} />
            Chỉnh sửa thông tin
          </Button>

          {/* Thanh toán */}
          <Button
            onClick={handlePayment}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <CreditCard size={18} />
            Thanh toán ngay
          </Button>
        </div>
      </div>

      {/* 💵 Modal chuyển khoản (chỉ mở khi chọn QR và nhấn Thanh toán) */}
      <PaymentTransferModal open={transferOpen} onClose={setTransferOpen} />
    </div>
  );
}
