import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext"; // ✅ import

export default function ProductActionBox({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // ✅ dùng context giỏ hàng

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addToCart(product, quantity); // ✅ Gửi tới giỏ hàng thật

    toast.success("Đã thêm vào giỏ hàng 🛒", {
      description: `${product.name} × ${quantity}`,
      duration: 2500,
    });
  };

  return (
    <div className="space-y-4">
      {/* Bộ chọn số lượng */}
      <div className="flex items-center justify-start gap-3">
        <span className="font-medium text-gray-700 text-sm">Số lượng:</span>
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={decrease}
            className="w-8 h-8 flex items-center justify-center border-r hover:bg-gray-100 active:scale-95 transition"
          >
            <Minus size={14} />
          </button>
          <input
            type="text"
            readOnly
            value={quantity}
            className="w-10 text-center text-sm font-medium focus:outline-none"
          />
          <button
            onClick={increase}
            className="w-8 h-8 flex items-center justify-center border-l hover:bg-gray-100 active:scale-95 transition"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-6 rounded-md">
        <CreditCard className="mr-2 w-4 h-4" /> MUA NGAY
      </Button>

      <Button
        variant="outline"
        className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-6 rounded-md"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 w-4 h-4" /> THÊM VÀO GIỎ HÀNG
      </Button>
    </div>
  );
}
