import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CheckoutProgress from "@/components/Checkout/checkoutProgress";
import CheckoutProductList from "@/components/Checkout/checkoutProductList";
import CheckoutCustomerInfo from "@/components/Checkout/checkoutCustomerInfo";
import CheckoutDeliveryInfo from "@/components/Checkout/checkoutDeliveryInfo";
import { Toaster, toast } from "sonner";

export default function CheckoutInfo() {
  const { total } = useCart();
  const navigate = useNavigate();

  // 🚚 Loại giao hàng
  const [deliveryType, setDeliveryType] = useState("delivery");

  // 📝 Form thông tin
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  // 🔄 Cập nhật form
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 💾 Lưu vào localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem("checkout_delivery_form");
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch {
        console.warn("⚠️ Lỗi parse localStorage: checkout_delivery_form");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkout_delivery_form", JSON.stringify(form));
  }, [form]);

  // ✅ Kiểm tra dữ liệu
  const handleNext = () => {
    const missingFields = [];
    if (!form.name.trim()) missingFields.push("họ tên");
    if (!form.phone.trim()) missingFields.push("số điện thoại");
    if (!form.province) missingFields.push("tỉnh / thành phố");
    if (!form.ward) missingFields.push("phường / xã");
    if (!form.address.trim()) missingFields.push("địa chỉ");

    if (missingFields.length > 0) {
      toast.error(`Vui lòng nhập ${missingFields.join(", ")} trước khi tiếp tục`, {
        position: "top-center",
      });
      return;
    }

    toast.success("✅ Thông tin hợp lệ! Đang chuyển đến trang thanh toán...", {
      position: "top-center",
      duration: 2000,
    });

    setTimeout(() => {
      navigate("/checkout/payment");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Toaster Sonner */}
      <Toaster richColors expand position="top-center" />

      {/* 🧭 Tiến trình */}
      <div className="mb-8">
        <CheckoutProgress step={1} />
      </div>

      {/* 🛒 Giỏ hàng */}
      <CheckoutProductList />

      {/* 👤 Khách hàng */}
      <CheckoutCustomerInfo form={form} onChange={handleChange} />

      {/* 🚚 Giao hàng */}
      <CheckoutDeliveryInfo
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        form={form}
        onChange={handleChange}
      />

      {/* 💰 Tổng tiền */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center text-base font-semibold text-gray-800">
          <span>Tổng tiền tạm tính</span>
          <span className="text-blue-600 text-lg">
            {total.toLocaleString()}₫
          </span>
        </div>
      </div>

      {/* 🔘 Nút Tiếp tục */}
      <Button
        onClick={handleNext}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
      >
        Tiếp tục
      </Button>
    </div>
  );
}
