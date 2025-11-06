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

  // 🧮 Lấy phương thức thanh toán từ localStorage
  useEffect(() => {
    const savedMethod = localStorage.getItem("payment_method_id");
    if (savedMethod) setMethod(savedMethod);
  }, []);

  // 🔁 Nghe sự kiện thay đổi phương thức
  useEffect(() => {
    const updateMethod = (e) => setMethod(e.detail);
    window.addEventListener("paymentMethodChanged", updateMethod);
    return () => window.removeEventListener("paymentMethodChanged", updateMethod);
  }, []);

  // ✅ Chỉ gọi API khi người dùng xác nhận “Tôi đã chuyển tiền”
  const handleConfirmTransfer = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      return navigate("/login");
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/orders/create", {
        user_id: user.user_id,
        cart_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: method,
      });

      if (response.status === 201) {
        toast.success("💸 Thanh toán chuyển khoản thành công!");
        clearCart();
        setTransferOpen(false);
        navigate("/profile?tab=orders");
      } else {
        toast.error("Không thể tạo đơn hàng, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      toast.error("Đã xảy ra lỗi trong quá trình xử lý!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🧾 Khi người dùng bấm “Thanh toán ngay”
  const handlePayment = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      return navigate("/login");
    }

    if (!method) {
      toast.error("Vui lòng chọn phương thức thanh toán trước khi tiếp tục!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    // ✅ Nếu là QR thì chỉ mở modal, chưa gửi API
    if (method === "qr") {
      setTransferOpen(true);
      return;
    }

    // ✅ Nếu là COD, tạo đơn hàng ngay
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/orders/create", {
        user_id: user.user_id,
        cart_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: method,
      });

      if (response.status === 201) {
        toast.success("✅ Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
        clearCart();
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng COD:", error);
      toast.error("Không thể tạo đơn hàng, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⚙️ Giao diện
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <CheckoutProgress step={2} />
      <PaymentSummary />
      <PaymentMethodCard />
      <PaymentInfoBox />

      {/* Tổng tiền + nút thanh toán */}
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <CreditCard size={18} />
            {isSubmitting ? "Đang xử lý..." : "Thanh toán ngay"}
          </Button>
        </div>
      </div>

      {/* 💵 Modal chuyển khoản */}
      <PaymentTransferModal
        open={transferOpen}
        onClose={setTransferOpen}
        onConfirm={handleConfirmTransfer} // ✅ chỉ thêm vào DB khi nhấn "Tôi đã chuyển tiền"
      />
    </div>
  );
}
