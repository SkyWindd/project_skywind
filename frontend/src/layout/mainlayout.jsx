import { Outlet } from "react-router-dom";
import Footer from '@/layout/footer'
import Header from '@/layout/header'
import BreadcrumbNav from "@/layout/breadcrumb"
import React from 'react'

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner luôn ở đầu trang */}
    

      {/* Header dính trên đầu khi cuộn */}
      <header>
        <Header />
      </header>
       <BreadcrumbNav />
      <main className="flex-grow bg-secondary">
        <Outlet /> {/* nơi render Home, Laptop,... */}
      </main>

      {/* Footer luôn ở cuối trang */}
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout
