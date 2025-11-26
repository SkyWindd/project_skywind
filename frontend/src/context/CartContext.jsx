// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🧩 Load giỏ hàng khi user login/logout
  useEffect(() => {
    if (user) {
      try {
        const stored = localStorage.getItem(`cart_${user.email}`);
        const parsed = stored ? JSON.parse(stored) : [];

        // 🔥 Nếu stock backend thay đổi → đồng bộ giỏ hàng
        const synced = parsed.map((item) => {
          if (item.quantity > item.stock) {
            return { ...item, quantity: item.stock };
          }
          return item;
        });

        setCartItems(synced);
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // 💾 Lưu giỏ hàng theo user
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // ➕ Thêm sản phẩm vào giỏ (tự động giới hạn theo stock)
  const addToCart = (product, quantity = 1) => {
    if (!user) return false;

    let updated = [];
    const existing = cartItems.find((item) => item.id === product.id);

    // Chuẩn hóa ảnh
    let imagePath = "";
    if (product.image) {
      imagePath = product.image.startsWith("http")
        ? product.image
        : product.image.startsWith("/")
        ? product.image
        : `/uploads/${product.image}`;
    } else {
      imagePath = product.thumbnail || product.images?.[0] || "/no-image.png";
    }

    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, product.stock);

      if (newQty === existing.quantity) {
        toast.error(`⚠️ Chỉ còn ${product.stock} sản phẩm trong kho!`);
        return false;
      }

      updated = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: newQty } : item
      );
    } else {
      updated = [
        ...cartItems,
        {
          ...product,
          image: imagePath,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }

    setCartItems(updated);
    return !existing;
  };

  // ❌ Xóa sản phẩm
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  // 🔢 Cập nhật số lượng theo stock
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const limitedQty = Math.min(Math.max(quantity, 1), item.stock);

        if (quantity > item.stock) {
          toast.error(`⚠️ Chỉ còn ${item.stock} sản phẩm trong kho!`);
        }

        return { ...item, quantity: limitedQty };
      })
    );
  };

  // 💰 Tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🧹 Xóa toàn bộ giỏ
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
