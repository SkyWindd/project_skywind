import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import CheckoutProductList from "@/components/CheckOutInfo/checkoutProductList";
import CheckoutCustomerInfo from "@/components/CheckOutInfo/checkoutCustomerInfo";
import CheckoutDeliveryInfo from "@/components/CheckOutInfo/checkoutDeliveryInfo";
import { Toaster, toast } from "sonner";

export default function CheckoutInfo() {
  const { total } = useCart();
  const navigate = useNavigate();

  // 🚚 Loại giao hàng (giao tận nơi, nhận tại cửa hàng)
  const [deliveryType, setDeliveryType] = useState("delivery");

  // 🧾 Thông tin form khách hàng
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  // 🧠 Khôi phục dữ liệu khi quay lại trang
  useEffect(() => {
    const saved = localStorage.getItem("checkout_delivery_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed);
      } catch (err) {
        console.warn("⚠️ Lỗi đọc dữ liệu localStorage:", err);
      }
    }
  }, []);

  // 💾 Lưu dữ liệu mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("checkout_delivery_form", JSON.stringify(form));
  }, [form]);

  // ✏️ Cập nhật dữ liệu form
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Xác thực trước khi chuyển bước
  const handleNext = () => {
    const missingFields = [];
    if (!form.name.trim()) missingFields.push("Họ tên");
    if (!form.phone.trim()) missingFields.push("Số điện thoại");
    if (!form.province) missingFields.push("Tỉnh / Thành phố");
    if (!form.ward) missingFields.push("Phường / Xã");
    if (!form.address.trim()) missingFields.push("Địa chỉ");

    if (missingFields.length > 0) {
      toast.error(
        `Vui lòng điền ${missingFields.join(", ")} trước khi tiếp tục.`,
        { position: "top-center" }
      );
      return;
    }

    // ✅ Lưu cả form & tổng tiền
  localStorage.setItem("checkout_delivery_form", JSON.stringify(form));
  localStorage.setItem("checkout_total_price", total.toString());

    toast.success("✅ Thông tin hợp lệ! Đang chuyển đến trang thanh toán...", {
      position: "top-center",
      duration: 1800,
    });

    // ⏳ Chuyển sang trang thanh toán sau 1.5 giây
    setTimeout(() => navigate("/checkoutPayment"), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* 🔔 Sonner Toaster */}
      <Toaster richColors position="top-center" expand />

      {/* 🧭 Thanh tiến trình */}
      <div className="mb-8">
        <CheckoutProgress step={1} />
      </div>

      {/* 🛒 Danh sách sản phẩm */}
      <CheckoutProductList />

      {/* 👤 Thông tin khách hàng */}
      <CheckoutCustomerInfo form={form} onChange={handleChange} />

      {/* 🚚 Thông tin giao hàng */}
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
        Tiếp tục thanh toán
      </Button>
    </div>
  );
}
