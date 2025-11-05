import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductActionBox({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  const outOfStock = !product?.stock || product.stock <= 0; // ✅ Kiểm tra hết hàng

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng 🔒");
      return;
    }

    const isExist = cartItems.some((item) => item.id === product.id);
    addToCart(product, quantity);

    if (isExist) {
      toast.info("Đã cập nhật số lượng sản phẩm 🛒", {
        description: `${product.name} × ${quantity}`,
        duration: 2500,
      });
    } else {
      toast.success("Đã thêm sản phẩm vào giỏ hàng 🛒", {
        description: `${product.name} × ${quantity}`,
        duration: 2500,
      });
    }
  };

  // 💳 Mua ngay → yêu cầu đăng nhập
  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng 🔒");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const isExist = cartItems.some((item) => item.id === product.id);
    if (!isExist) addToCart(product, quantity);

    toast.success("Chuyển đến trang thanh toán 💳", {
      description: `${product.name} × ${quantity}`,
      duration: 1500,
    });

    setTimeout(() => navigate("/checkout-info"), 1200);
  };

  return (
    <div className="space-y-4">
      {/* Bộ chọn số lượng */}
      <div className="flex items-center justify-start gap-3">
        <span className="font-medium text-gray-700 text-sm">Số lượng:</span>
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={decrease}
            disabled={outOfStock}
            className={`w-8 h-8 flex items-center justify-center border-r transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-100 active:scale-95"
            }`}
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
            disabled={outOfStock}
            className={`w-8 h-8 flex items-center justify-center border-l transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-100 active:scale-95"
            }`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Nếu hết hàng → chỉ hiện 1 nút "Hết hàng" */}
      {outOfStock ? (
        <Button
          disabled
          className="w-full bg-gray-400 text-white font-semibold text-base py-6 rounded-md opacity-70 cursor-not-allowed"
        >
          HẾT HÀNG
        </Button>
      ) : (
        <>
          {/* Nút Mua ngay */}
          <Button
            onClick={handleBuyNow}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-6 rounded-md"
          >
            <CreditCard className="mr-2 w-4 h-4" /> MUA NGAY
          </Button>

          {/* Nút thêm giỏ hàng */}
          <Button
            variant="outline"
            className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-6 rounded-md"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 w-4 h-4" /> THÊM VÀO GIỎ HÀNG
          </Button>
        </>
      )}
    </div>
  );
}
