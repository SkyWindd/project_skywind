import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductImages from "@/components/ProductDetails/productImages";
import ProductPriceBox from "@/components/ProductDetails/productPriceBox";
import ProductPromoBox from "@/components/ProductDetails/productPromoBox";
import ProductActionBox from "@/components/ProductDetails/productActionBox";
import ProductSpecsTable from "@/components/ProductDetails/productSpecsTable";
import ProductRatingBox from "@/components/ProductDetails/productRatingBox";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟡 Dùng ref cho phần đánh giá
  const ratingRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  // 🧭 Hàm scroll mượt xuống phần đánh giá
  const scrollToRating = () => {
    if (ratingRef.current) {
      ratingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlight(true);
      // Tắt highlight sau 2 giây
      setTimeout(() => setHighlight(false), 2000);
    }
  };

  // Mock dữ liệu
  const mockProduct = {
    id: 1,
    name: "Laptop ASUS Gaming V16 V3607VM-RP044W",
    description:
      "CORE i7-240H / 32GB / 1TB SSD / VGA RTX 5060 8GB / 16.0” WUXGA",
    price: 33490000,
    old_price: 37900000,
    trade_price: 30490000,
    discount: 3000000,
    images: [
      "https://via.placeholder.com/600x400.png?text=ASUS+V16",
      "https://via.placeholder.com/600x400.png?text=Side+Angle",
      "https://via.placeholder.com/600x400.png?text=Back+View",
      "https://via.placeholder.com/600x400.png?text=Keyboard+View",
    ],
    promos: [
      "Tặng ngay 1 x Tai nghe HyperX Cloud Stinger Core II trị giá 790.000đ",
      "Tặng ngay 1 x Lót chuột DareU ESP108 Black TLX_450x400x5mm trị giá 180.000đ",
      "Tặng ngay 1 x Túi chống sốc GearVN 15'' trị giá 100.000đ",
    ],
    specs: {
      "Loại card đồ họa": "NVIDIA GeForce RTX 5060 8GB GDDR7\nIntel Graphics",
      "Dung lượng RAM": "32GB",
      "Loại RAM": "DDR5 SO-DIMM",
      "Số khe ram":
        "Máy nguyên bản 16GB, được tặng 16GB, nâng cấp tối đa 32GB",
      "Ổ cứng": "1TB M.2 NVMe PCIe 4.0 SSD",
      "Kích thước màn hình": "16 inches",
      "Công nghệ màn hình":
        "Độ sáng 300nits\nĐộ phủ màu 45% NTSC\nMàn hình chống chói",
      "Pin": "63WHrs, 3S1P, 3-cell Li-ion",
      "Hệ điều hành": "Windows 11 Home",
      "Độ phân giải màn hình": "1920 x 1200 pixels (WUXGA)",
      "Loại CPU":
        "Intel Core i7 240H 2.5 GHz (24MB Cache, up to 5.2 GHz, 10 lõi, 16 luồng)",
      "Cổng giao tiếp":
        "1x USB-C hỗ trợ hiển thị / sạc\n2x USB-A Gen1\n1x HDMI 2.1\n1x jack 3.5mm\n1x DC-in",
    },
    rating: 4.8,
    reviews: 32,
  };

  useEffect(() => {
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 800);
  }, [slug]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Đang tải sản phẩm...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề sản phẩm */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.description}</p>
      </div>

      {/* --- Phần trên: Hình ảnh + Giá / Khuyến mãi / Nút --- */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bên trái: Hình ảnh */}
        <div className="w-full lg:w-7/12">
          <ProductImages images={product.images} />
        </div>

        {/* Bên phải: Giá, khuyến mãi, nút */}
        <div className="w-full lg:w-5/12 flex flex-col gap-5">
          {/* Truyền hàm scrollToRating xuống ProductPriceBox */}
          <ProductPriceBox product={product} onViewRating={scrollToRating} />
          <ProductPromoBox promos={product.promos} />
          <ProductActionBox product={product} />
        </div>
      </div>

      {/* --- Phần dưới: Thông số kỹ thuật + Đánh giá --- */}
      <div className="mt-10 flex flex-col gap-6">
        <ProductSpecsTable specs={product.specs} />
        {/* Gắn ref vào phần đánh giá */}
        <div
          ref={ratingRef}
          className={`transition-all duration-700 ${
            highlight ? "ring-4 ring-yellow-300 rounded-xl" : ""
          }`}
        >
          <ProductRatingBox product={product} />
        </div>
      </div>
    </div>
  );
}
