// src/pages/Checkout/CheckoutPayment.jsx
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
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, total } = useCart();

  const [method, setMethod] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧮 Lấy tổng tiền và phương thức thanh toán
  useEffect(() => {
    const savedMethod = localStorage.getItem("payment_method_id");
    if (savedMethod) setMethod(savedMethod);
  }, []);

  // 💰 Xử lý khi thanh toán
  const handlePayment = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      return navigate("/login");
    }

    if (!method) {
      toast.error("Vui lòng chọn phương thức thanh toán trước khi tiếp tục!");
      return;
    }

    switch (method) {
      case "qr":
        // 🔹 Chỉ mở modal khi chọn “Chuyển khoản ngân hàng qua mã QR”
        setTransferOpen(true);
        break;

      case "cod":
        toast.success("✅ Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
        setTimeout(() => navigate("/"), 2000);
        break;

      case "vnpay":
        toast.info("🌐 Chuyển hướng sang cổng thanh toán VNPay...");
        // Giả lập redirect
        setTimeout(() => {
          toast.success("Thanh toán VNPay thành công!");
          navigate("/");
        }, 2000);
        break;

      case "momo":
        toast.info("📱 Đang mở ứng dụng MoMo...");
        setTimeout(() => {
          toast.success("Thanh toán MoMo thành công!");
          navigate("/");
        }, 2000);
        break;

      default:
        toast.error("Phương thức thanh toán không hợp lệ!");
        break;
    }
  };

  useEffect(() => {
  const updateMethod = (e) => setMethod(e.detail);
  window.addEventListener("paymentMethodChanged", updateMethod);
  return () => window.removeEventListener("paymentMethodChanged", updateMethod);
}, []);

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔹 1. Gửi đơn hàng lên backend
      const response = await axios.post("http://127.0.0.1:5000/api/orders/create", {
        user_id: user.user_id, // Hoặc user.user_id tùy backend bạn đặt
        cart_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (response.status === 201) {
        // ✅ Lưu thành công
        clearCart();

        toast.success("Đặt hàng thành công 🎉");

        if (method === "qr") {
          setTransferOpen(true); // mở modal chuyển khoản
        } else if (method === "cod") {
          setTimeout(() => navigate("/profile?tab=orders"), 1500);
        }
      } else {
        toast.error("Không thể tạo đơn hàng, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Đã xảy ra lỗi khi xử lý thanh toán!");
    } finally {
      setIsSubmitting(false);
    }

  // ⚙️ UI giữ nguyên hoàn toàn
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <CheckoutProgress step={2} />
      <PaymentSummary />
      <PaymentMethodCard />
      <PaymentInfoBox />

      <div className="bg-white border border-gray-100 shadow-md rounded-2xl mt-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-lg transition-all duration-200">
        <div className="text-center sm:text-left">
          <p className="text-gray-500 text-sm">Tổng tiền tạm tính</p>
          <p className="text-blue-700 font-bold text-xl mt-1">
            {total.toLocaleString()}₫
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/checkout-info")}
            variant="outline"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition rounded-lg py-6"
          >
            <ArrowLeft size={16} />
            Chỉnh sửa thông tin
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={handlePayment}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <CreditCard size={18} />
            {isSubmitting ? "Đang xử lý..." : "Thanh toán ngay"}
          </Button>
        </div>
      </div>

      {/* 💵 Modal chuyển khoản (chỉ mở khi chọn QR) */}
      <PaymentTransferModal open={transferOpen} onClose={setTransferOpen} />
    </div>
  );
}
