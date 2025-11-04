import React from "react";

export default function CheckoutProgress({ step = 1 }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2">
        <span
          className={`${
            step === 1 ? "text-blue-600 font-semibold" : "text-gray-400"
          }`}
        >
          1. Thông tin
        </span>
        <span className="text-gray-300">›</span>
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
