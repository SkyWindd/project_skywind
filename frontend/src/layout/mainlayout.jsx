import { Outlet } from "react-router-dom";
import Footer from '@/layout/footer'
import Header from '@/layout/header'
import BreadcrumbNav from "@/layout/breadcrumb"
import React from 'react'
import Header_t from './header'

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header dính trên đầu khi cuộn */}
      <header>
        <Header />
      </header>

     

      {/* Footer luôn ở cuối trang */}
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout
