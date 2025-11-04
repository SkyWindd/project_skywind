import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, User, Phone, Mail, Package } from "lucide-react";

export default function PaymentInfoBox() {
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    ward: "",
    address: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("checkout_delivery_form");
    if (saved) {
      try {
        setInfo(JSON.parse(saved));
      } catch (err) {
        console.warn("⚠️ Lỗi khi đọc dữ liệu giao hàng:", err);
      }
    }
  }, []);

  return (
    <Card className="p-6 mb-8 border border-gray-100 shadow-md rounded-2xl bg-white hover:shadow-lg transition-all duration-300 animate-fade-in">
      {/* 🧾 Tiêu đề */}
      <div className="flex items-center gap-2 mb-3">
        <Package size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Thông tin nhận hàng</h3>
      </div>

      {/* 🌈 Đường phân cách gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-400/20 via-gray-200 to-blue-400/20 mb-2"></div>

      {/* 🧍 Chi tiết */}
      <div className="space-y-3 text-sm text-gray-700">
        {/* 👤 Tên khách hàng */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition">
          <User size={18} className="text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-gray-800">{info.name || "Chưa nhập họ tên"}</p>
            <p className="text-gray-500 text-xs">Khách hàng</p>
          </div>
        </div>

        {/* ☎️ Số điện thoại */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition">
          <Phone size={18} className="text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-gray-800">{info.phone || "Chưa nhập số điện thoại"}</p>
            <p className="text-gray-500 text-xs">Số điện thoại liên hệ</p>
          </div>
        </div>

        {/* 📧 Email (nếu có) */}
        {info.email && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition">
            <Mail size={18} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{info.email}</p>
              <p className="text-gray-500 text-xs">Email</p>
            </div>
          </div>
        )}

        {/* 📍 Địa chỉ */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition">
          <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-gray-800 leading-snug">
              {info.address
                ? `${info.address}, ${info.ward || ""}, ${info.province || ""}`
                : "Chưa nhập địa chỉ"}
            </p>
            <p className="text-gray-500 text-xs">Địa chỉ giao hàng</p>
          </div>
        </div>

        {/* 🚚 Người nhận */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition">
          <User size={18} className="text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-gray-800">
              {info.name || "Chưa nhập"} {info.phone && `- ${info.phone}`}
            </p>
            <p className="text-gray-500 text-xs">Người nhận hàng</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
