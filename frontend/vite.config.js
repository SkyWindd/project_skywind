import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Tailwind v4 tích hợp trực tiếp qua plugin
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Dễ import component
    },
  },

  server: {
    host: true,        // Cho phép truy cập qua IP LAN
    port: 5173,        // Giữ port cố định để tránh lỗi "port in use"
    strictPort: false, // Cho phép tự đổi port khi bị chiếm
  },
});
