import { MapPin, Phone, Mail, CreditCard, Wallet, Banknote, Smartphone} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t shadow-sm border-gray-200">
      <div className="w-full px-[5vw] py-10 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        
        {/* Cột 1 - Logo và thông tin công ty */}
        <div>
          <div className="flex items-center mb-4">
              <span className="text-blue-600 font-extrabold md:text-5xl text-3xl font-[Birthstone]">SkyWind</span>
          </div>

          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
              273 An Dương Vương, phường Chợ Quán, Thành phố Hồ Chí Minh
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold">01.2345.6789</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>skywind@gmail.com</span>
            </li>
          </ul>

        </div>

        {/* Cột 2 - Thông tin */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Thông tin</h3>
          <ul className="space-y-2 text-sm">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Tuyển dụng</li>
          </ul>
        </div>

        {/* Cột 3 - Chính sách */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Chính sách</h3>
          <ul className="space-y-2 text-sm">
            <li>Đặt hàng online giao hàng tận nơi</li>
            <li>
              HOTLINE:{" "}
              <span className="font-semibold text-blue-600">01.2345.6789</span>{" "}
              (8h - 21h)
            </li>
          </ul>
        </div>

        {/* Cột 4 - Thanh toán */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Miễn phí thanh toán</h3>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Thanh toán bằng tiền mặt */}
          <div className="flex items-center gap-2">
            <Banknote className="w-7 h-7" />
            <span className="text-sm font-medium">Tiền mặt</span>
          </div>

          {/* Thanh toán bằng thẻ */}
          <div className="flex items-center gap-2">
            <CreditCard className="w-7 h-7" />
            <span className="text-sm font-medium">Thẻ</span>
          </div>

          {/* Thanh toán chuyển khoản */}
          <div className="flex items-center gap-2">
            <Smartphone className="w-7 h-7" />
            <span className="text-sm font-medium">Chuyển khoản</span>
          </div>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-600">
        © Copyright 2025–2026{" "}
        <span className="font-semibold text-gray-800">SkyWind</span>. All Rights Reserved
      </div>
    </footer>
  );
}
