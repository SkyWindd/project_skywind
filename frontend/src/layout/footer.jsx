import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="w-full px-[5vw] py-10 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        
        {/* Cột 1 - Logo và thông tin công ty */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="/logo.png"
              alt="BROSHOP Logo"
              className="h-10 w-auto mr-2"
            />
            <span className="text-2xl font-bold">
              <span className="text-orange-600">BRO</span>SHOP
              <span className="text-sm font-normal">.VN</span>
            </span>
          </div>

          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-600 mt-0.5" />
              150 Hoàng Trọng Mậu, KDC Him Lam, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-600" />
              <span className="text-orange-600 font-semibold">0969999997</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-600" />
              <span>broshophcm@gmail.com</span>
            </li>
          </ul>

          <p className="mt-3 text-xs text-gray-600">
            Công ty TNHH TM BRO - MST: 0310617427 do Sở KH&ĐT TPHCM cấp ngày 29/1/2011
          </p>

          <div className="flex gap-3 mt-4">
            <img src="/icons/facebook.svg" alt="Facebook" className="w-7 h-7" />
            <img src="/icons/youtube.svg" alt="YouTube" className="w-7 h-7" />
            <img src="/icons/tiktok.svg" alt="TikTok" className="w-7 h-7" />
            <img src="/icons/instagram.svg" alt="Instagram" className="w-7 h-7" />
            <img src="/icons/zalo.svg" alt="Zalo" className="w-7 h-7" />
          </div>
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
              <span className="font-semibold text-orange-600">09.6999.9997</span>{" "}
              (8h - 21h)
            </li>
          </ul>
        </div>

        {/* Cột 4 - Thanh toán */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Miễn phí thanh toán</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <img src="/icons/visa.png" alt="Visa" className="h-8" />
            <img src="/icons/mastercard.png" alt="MasterCard" className="h-8" />
            <img src="/icons/momo.png" alt="MoMo" className="h-8" />
            <img src="/icons/vnpay.png" alt="VNPay" className="h-8" />
          </div>
          <img
            src="/icons/dathongbao.png"
            alt="Đã thông báo Bộ Công Thương"
            className="h-10 mt-3"
          />
        </div>
      </div>

      {/* Bản quyền */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-600">
        © Copyright 2011–2024{" "}
        <span className="font-semibold text-gray-800">BROSHOP</span>. All Rights Reserved
      </div>
    </footer>
  );
}
