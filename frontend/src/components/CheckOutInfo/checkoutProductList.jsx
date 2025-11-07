import React from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutProductList() {
  const { cartItems } = useCart();

  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-200 hover:shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-gray-800 flex items-center gap-2">
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 px-2 sm:px-3 transition-all hover:bg-blue-50/40 rounded-lg"
            >
              {/* Hình ảnh + thông tin */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Hình ảnh */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow">
                    x{item.quantity}
                  </span>
                </div>

                {/* Thông tin */}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    Giá:{" "}
                    <span className="font-medium text-blue-600">
                      {item.price.toLocaleString()}₫
                    </span>
                  </p>
                </div>
              </div>

              {/* Thành tiền */}
              <div className="text-right sm:text-end">
                <p className="text-blue-700 font-bold text-sm sm:text-base whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
