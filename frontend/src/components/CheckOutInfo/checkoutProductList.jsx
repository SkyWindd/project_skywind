import React from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutProductList() {
  const { cartItems } = useCart();

  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8 transition-all duration-200 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
        🛒 Sản phẩm trong giỏ hàng
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 italic text-sm text-center py-3">
          Giỏ hàng của bạn đang trống
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 transition-all hover:bg-blue-50/50 rounded-lg px-2"
            >
              {/* Hình và thông tin sản phẩm */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                    x{item.quantity}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Giá:{" "}
                    <span className="font-medium text-blue-600">
                      {item.price.toLocaleString()}₫
                    </span>
                  </p>
                </div>
              </div>

              {/* Thành tiền */}
              <p className="text-blue-700 font-bold text-sm sm:text-base min-w-20 text-right">
                {(item.price * item.quantity).toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
