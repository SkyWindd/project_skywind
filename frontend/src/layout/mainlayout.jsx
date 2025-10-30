import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import BreadcrumbNav from "@/components/mainLayout/breadCrumb";
import ChatBox from "../chatbox";
import { Toaster } from "sonner";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 🧭 Header cố định trên đầu khi cuộn */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Header /> {/* Header chứa menu và logo */}
      </header>

      {/* 🧱 Breadcrumb (chỉ hiển thị khi không ở trang Home) */}
      <BreadcrumbNav />

      {/* 🧩 Nội dung chính */}
      <main className="flex-grow bg-secondary min-h-[70vh] p-4">
        <Outlet /> {/* Render các trang như Home, Login, Upload... */}
      </main>

      {/* ⚓ Footer */}
      <footer className="bg-white border-t">
        <Footer />
      </footer>

      {/* 🔔 Toast thông báo */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default MainLayout;
