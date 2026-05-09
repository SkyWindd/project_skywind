import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import PaymentSummary from "@/components/Payment/paymentSummary";
import PaymentMethodCard from "@/components/Payment/paymentMethodCard";
import PaymentInfoBox from "@/components/Payment/paymentInfoBox";
import PaymentTransferModal from "@/components/Payment/paymentTransferModal";

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  CreditCard,
} from "lucide-react";

import { toast } from "sonner";

import axiosClient from "@/api/axiosClient";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPayment() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    cartItems,
    clearCart,
    total,
  } = useCart();

  const [method, setMethod] =
    useState("");

  const [transferOpen, setTransferOpen] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================
  // LOAD PAYMENT METHOD
  // =========================
  useEffect(() => {

    const savedMethod =
      localStorage.getItem(
        "payment_method_id"
      );

    if (savedMethod) {
      setMethod(savedMethod);
    }

  }, []);

  // =========================
  // LISTEN PAYMENT CHANGE
  // =========================
  useEffect(() => {

    const updateMethod = (e) => {
      setMethod(e.detail);
    };

    window.addEventListener(
      "paymentMethodChanged",
      updateMethod
    );

    return () => {

      window.removeEventListener(
        "paymentMethodChanged",
        updateMethod
      );
    };

  }, []);

  // =========================
  // VALIDATE CHECKOUT
  // =========================
  const validateCheckout = () => {

    if (!user) {

      toast.error(
        "Vui lòng đăng nhập!"
      );

      navigate("/login");

      return false;
    }

    if (!method) {

      toast.error(
        "Vui lòng chọn phương thức thanh toán!"
      );

      return false;
    }

    if (
      !cartItems ||
      cartItems.length === 0
    ) {

      toast.error(
        "Giỏ hàng đang trống!"
      );

      return false;
    }

    return true;
  };

  // =========================
  // CREATE PAYMENT
  // =========================
  const createPayment = async (
    paymentStatus = "pending"
  ) => {

    if (isSubmitting) return;

    try {

      setIsSubmitting(true);

      // =========================
      // CREATE ORDER
      // =========================
      const orderPayload = {

        user_id:
          user?.user_id ||
          user?.id,

        cart_items:
          cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),

        payment_method: method,

        payment_status: paymentStatus,
      };

      console.log(
        "📦 CREATE ORDER:",
        orderPayload
      );

      const orderRes =
        await axiosClient.post(
          "/orders/api/orders/create",
          orderPayload
        );

      console.log(
        "✅ ORDER RESPONSE:",
        orderRes.data
      );

      if (
        !orderRes.data ||
        (!orderRes.data.order_id &&
          !orderRes.data.id)
      ) {

        throw new Error(
          "Không tạo được đơn hàng"
        );
      }

      const orderId =
        orderRes.data.order_id ||
        orderRes.data.id;

      // =========================
      // CREATE PAYMENT
      // =========================
      const paymentPayload = {

        order_id: orderId,

        amount: Number(total),

        payment_method: method,
      };

      console.log(
        "💳 CREATE PAYMENT:",
        paymentPayload
      );

      // ✅ FIX ROUTE
      const paymentRes =
        await axiosClient.post(
          "/payment/api/payments/create",
          paymentPayload
        );

      console.log(
        "✅ PAYMENT RESPONSE:",
        paymentRes.data
      );

      // =========================
      // SUCCESS
      // =========================
      clearCart();

      localStorage.removeItem(
        "checkout_delivery_form"
      );

      localStorage.removeItem(
        "payment_method_id"
      );

      if (method === "cod") {

        toast.success(
          "✅ Đặt hàng thành công!"
        );

      } else {

        toast.success(
          "💸 Thanh toán thành công!"
        );
      }

      setTimeout(() => {

        navigate(
          "/profile?tab=orders"
        );

      }, 1500);

    } catch (error) {

      console.error(
        "❌ PAYMENT ERROR:",
        error
      );

      console.error(
        "❌ RESPONSE:",
        error?.response?.data
      );

      toast.error(

        error?.response?.data?.error ||

        error?.response?.data?.message ||

        error?.message ||

        "Thanh toán thất bại!"
      );

    } finally {

      setIsSubmitting(false);

      setTransferOpen(false);
    }
  };

  // =========================
  // CLICK PAYMENT
  // =========================
  const handlePayment = async () => {

    const isValid =
      validateCheckout();

    if (!isValid) return;

    // QR
    if (method === "qr") {

      setTransferOpen(true);

      return;
    }

    // COD
    await createPayment(
      "pending"
    );
  };

  // =========================
  // CONFIRM QR
  // =========================
  const handleConfirmTransfer =
    async () => {

      await createPayment(
        "paid"
      );
    };

  return (

    <div className="max-w-4xl mx-auto p-6 md:p-8">

      <CheckoutProgress step={2} />

      <PaymentSummary />

      <PaymentMethodCard />

      <PaymentInfoBox />

      <div className="bg-white border border-gray-100 shadow-md rounded-2xl mt-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">

        <div className="text-center sm:text-left">

          <p className="text-gray-500 text-sm">
            Tổng tiền tạm tính
          </p>

          <p className="text-blue-700 font-bold text-xl mt-1">

            {Number(total || 0)
              .toLocaleString()}₫

          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          <Button
            onClick={() =>
              navigate("/checkout-info")
            }
            variant="outline"
            className="flex items-center gap-2"
          >

            <ArrowLeft size={16} />

            Chỉnh sửa thông tin

          </Button>

          <Button
            disabled={isSubmitting}
            onClick={handlePayment}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >

            <CreditCard size={18} />

            {isSubmitting
              ? "Đang xử lý..."
              : "Thanh toán ngay"}

          </Button>

        </div>
      </div>

      <PaymentTransferModal
        open={transferOpen}
        onClose={() =>
          setTransferOpen(false)
        }
        onConfirm={
          handleConfirmTransfer
        }
      />

    </div>
  );
}