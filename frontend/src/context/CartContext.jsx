// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🧩 Load giỏ hàng khi user login/logout
  useEffect(() => {
    if (user) {
      try {
        const stored = localStorage.getItem(`cart_${user.email}`);
        setCartItems(stored ? JSON.parse(stored) : []);
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

  // ➕ Thêm sản phẩm (không hiện toast trong context)
  const addToCart = (product, quantity = 1) => {
    if (!user) return false; // 🚫 Không cho thêm nếu chưa đăng nhập

    let updated = [];
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      updated = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Chuẩn hoá ảnh
      let imagePath = "";
      if (product.image) {
        if (product.image.startsWith("http")) imagePath = product.image;
        else if (product.image.startsWith("/")) imagePath = product.image;
        else imagePath = `/uploads/${product.image}`;
      } else {
        imagePath = product.thumbnail || product.images?.[0] || "/no-image.png";
      }

      updated = [...cartItems, { ...product, image: imagePath, quantity }];
    }

    setCartItems(updated);
    return !existing; // ✅ Trả về true nếu là sản phẩm mới
  };

  // ❌ Xóa sản phẩm
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  // 🔢 Cập nhật số lượng
  const updateQuantity = (id, quantity) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );

  // 💰 Tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
