import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import BreadcrumbNav from "@/components/mainLayout/breadCrumb";
import ChatBox from "../chatbox";
import { Toaster } from "sonner";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 🧭 Header cố định */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </header>

      {/* 🧱 Breadcrumb */}
      <BreadcrumbNav />

      {/* 🧩 Nội dung chính */}
      <main className="flex-grow bg-secondary min-h-[70vh] p-4">
        <Outlet />
      </main>

      {/* ⚓ Footer */}
      <footer className="bg-white border-t">
        <Footer />
      </footer>

      {/* 🔔 Toast thông báo */}
      <Toaster position="top-right" richColors />

      {/* 💬 Chatbox nổi góc phải */}
      <div className="fixed bottom-6 right-6 z-[999]">
        <ChatBox />
      </div>
    </div>
  );
}

export default MainLayout;
