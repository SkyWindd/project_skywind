import Footer from '@/layout/footer'
import Header from '@/layout/header'
import React from 'react'
import ChatBox from '../chatbox'

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header dính trên đầu khi cuộn */}
      <header>
        <Header />
      </header>

      {/* Nội dung chính */}
      <main className="flex-1">
        {/* ...nếu bạn dùng <Outlet /> để hiển thị các trang */}
      </main>

      {/* Chatbox hiển thị ở góc phải dưới */}
      <ChatBox />

      {/* Footer luôn ở cuối trang */}
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout
