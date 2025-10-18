import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import BreadcrumbNav from "@/components/breadcrumb";
import ChatBox from "../chatbox";
import { Toaster } from "sonner";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định trên đầu khi cuộn */}
      <header className="sticky top-0 z-50 bg-white">
        <Header />
      </header>

      {/* Thanh breadcrumb (chỉ hiển thị khi không ở trang Home) */}
      <BreadcrumbNav />

      {/* Nội dung chính */}
      <main className="flex-grow bg-secondary">
        <Outlet /> {/* Nơi render Home, Login, Register... */}
      </main>

      {/* Chatbox hiển thị ở góc phải dưới */}
      <ChatBox />

      {/* Footer luôn ở cuối trang */}
      <footer>
        <Footer />
      </footer>

      {/* Toast thông báo */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default MainLayout;
