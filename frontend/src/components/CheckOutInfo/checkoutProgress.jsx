import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutProgress({ step = 1 }) {
  const navigate = useNavigate();

  const goToInfo = () => {
    // Chỉ cho phép quay lại nếu đang ở bước thanh toán
    if (step === 2) navigate("/checkout-info");
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2">
        {/* Bước 1 */}
        <button
          onClick={goToInfo}
          disabled={step === 1}
          className={`transition-colors ${
            step === 1
              ? "text-blue-600 font-semibold"
              : "text-gray-400 hover:text-blue-500"
          } ${step === 1 ? "cursor-default" : "cursor-pointer"}`}
        >
          1. Thông tin
        </button>

        <span className="text-gray-300">›</span>

        {/* Bước 2 */}
        <span
          className={`${
            step === 2 ? "text-blue-600 font-semibold" : "text-gray-400"
          }`}
        >
          2. Thanh toán
        </span>
      </div>
    </div>
  );
}
