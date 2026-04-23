import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CheckoutProgress from "@/components/CheckOutInfo/checkoutProgress";
import CheckoutProductList from "@/components/CheckOutInfo/checkoutProductList";
import CheckoutCustomerInfo from "@/components/CheckOutInfo/checkoutCustomerInfo";
import CheckoutDeliveryInfo from "@/components/CheckOutInfo/checkoutDeliveryInfo";
import { Toaster, toast } from "sonner";
import axiosClient from "@/api/axiosClient";

export default function CheckoutInfo() {
  const { total } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user_id || user?.id;

  const [deliveryType, setDeliveryType] = useState("delivery");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  // 🚀 Load địa chỉ mặc định từ DB
  useEffect(() => {
  if (!userId) return;

  const loadDefaultAddress = async () => {
    try {
      const res = await axiosClient.get(
        `/users/api/address/user/${userId}`
      );

      console.log("📦 RAW:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      if (data.length === 0) {
        const saved = localStorage.getItem("checkout_delivery_form");
        if (saved) setForm(JSON.parse(saved));
        return;
      }

      const addr = data[0];

      setForm({
        name: "",
        phone: "",
        email: "",
        province: addr.city || "",
        district: addr.state || "",
        ward: addr.zip_code || "",
        address: addr.street || "",
      });
    } catch (error) {
      console.error("❌ Load address error:", error);
    }
  };

  loadDefaultAddress();
}, [userId]);
  // 💾 Lưu form vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("checkout_delivery_form", JSON.stringify(form));
  }, [form]);

  // Cập nhật form
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Next step
  const handleNext = () => {
    const required = ["name", "phone", "province", "ward", "address"];
    const missing = required.filter((f) => !form[f] || !form[f].trim());

    if (missing.length > 0) {
      toast.error(`Vui lòng điền đủ thông tin trước khi tiếp tục.`, {
        position: "top-center",
      });
      return;
    }

    localStorage.setItem("checkout_total_price", total.toString());

    setTimeout(() => navigate("/checkoutPayment"), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <Toaster richColors position="top-center" expand />

      <div className="mb-8">
        <CheckoutProgress step={1} />
      </div>

      <CheckoutProductList />

      <CheckoutCustomerInfo form={form} onChange={handleChange} />

      <CheckoutDeliveryInfo form={form} onChange={handleChange} />

      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center text-base font-semibold">
          <span>Tổng tiền tạm tính</span>
          <span className="text-blue-600 text-lg">{total.toLocaleString()}₫</span>
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg"
      >
        Tiếp tục thanh toán
      </Button>
    </div>
  );
}
