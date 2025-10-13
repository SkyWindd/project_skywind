import { Outlet } from "react-router-dom";
import Footer from '@/layout/footer';
import Header from '@/layout/header';
import BreadcrumbNav from "@/layout/breadcrumb";
import React from 'react';
import ChatBox from '../chatbox';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định trên đầu */}
      <header>
        <Header />
      </header>

      {/* Thanh breadcrumb */}
      <BreadcrumbNav />

      {/* Nội dung chính */}
      <main className="flex-grow bg-secondary">
        <Outlet /> {/* nơi render Home, Laptop,... */}
      </main>

      {/* Chatbox hiển thị ở góc phải dưới */}
      <ChatBox />

      {/* Footer luôn ở cuối trang */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default MainLayout;
