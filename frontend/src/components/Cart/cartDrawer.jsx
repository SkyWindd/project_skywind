import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext"; // ✅ import context

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart(); // ✅ lấy dữ liệu thật
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative text-gray-700 hover:text-blue-600 transition" aria-label="Giỏ hàng">
          <ShoppingCart className="h-5 w-5" />
          <span
            className={`absolute -top-2 -right-2 text-white text-xs rounded-full px-1.5 ${
              cartItems.length === 0 ? "bg-gray-400" : "bg-red-500"
            }`}
          >
            {cartItems.length}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-lg font-semibold">Giỏ hàng</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-lg font-semibold mb-2">Giỏ hàng chưa có gì!</h3>
              <p className="text-sm text-gray-500 mb-4">Hãy tìm sản phẩm ưng ý và thêm vào giỏ hàng bạn nhé</p>
              <Button onClick={() => setOpen(false)} className="bg-blue-500 hover:bg-blue-600">
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 items-start border rounded-lg p-2 hover:shadow-sm transition">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium line-clamp-2 w-[80%]">{item.name}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      aria-label="Xoá sản phẩm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-blue-600 font-semibold text-sm mt-1">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="p-4">
              <div className="w-full">
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-gray-600">Tổng cộng</span>
                  <span className="font-bold text-blue-600">{total.toLocaleString()}₫</span>
                </div>
                <Link to="/checkout-info" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Thanh toán →</Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
