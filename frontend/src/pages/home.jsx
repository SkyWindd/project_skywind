
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/productcard";
import CategorySection from "@/components/categorysection";
import Banner from "@/components/banner";


function Home() {
   const categories = [
    { name: "Asus", image: "/public/logo_product/Asus_Logo.png", link: "/laptop" },
    { name: "Acer", image: "/public/logo_product/Acer_Logo.png", link: "/headphones" },
    { name: "Dell", image: "/public/logo_product/Dell_Logo.png", link: "/phone" },
    { name: "HP", image: "/public/logo_product/HP_Logo.png", link: "/accessories" },
    { name: "Lenovo", image: "/public/logo_product/Lenovo_Logo.png", link: "/accessories" },
    { name: "MSI", image: "/public/logo_product/MSI_Logo.png", link: "/accessories" },
  ];

  const products = [
  {
    id: 1,
    name: "Laptop Acer Aspire Lite AL15 72P 7232",
    cpu: "i7-13620H",
    ram: "16 GB",
    storage: "512 GB",
    display: "15.6 inch FHD",
    refreshRate: "60 Hz",
    oldPrice: "16.990.000₫",
    newPrice: "15.990.000₫",
    discount: "-6%",
    rating: "0.0",
    reviews: "0",
    isGift: true,
    image: "/products/laptop1.jpg",
  },
  {
    id: 2,
    name: "Màn hình ASUS VZ249HG 24'' IPS 120Hz viền mỏng",
    cpu: "24 inch",
    ram: "Full HD",
    storage: "(1920 × 1080)",
    display: "IPS",
    refreshRate: "120 Hz",
    oldPrice: "2.990.000₫",
    newPrice: "2.350.000₫",
    discount: "-21%",
    rating: "0.0",
    reviews: "0",
    isGift: false,
    image: "/products/product1.jpg",
  },
]
  const banners = [
    "/public/banner/banner1.jpg",
    "/public/logo_product/Acer_Logo.png",
    "/banners/banner3.jpg",
  ];
  const [index, setIndex] = useState(0);

 // Tự động chuyển banner sau 4 giây
  
  const next = () => setIndex((index + 1) % banners.length);
  const prev = () => setIndex((index - 1 + banners.length) % banners.length);

  return (
    
      <div className="w-full">

        {/* ---------- 🧭 Banner quảng cáo ---------- */}
         <div className="max-w-screen-xl mx-auto px-4 mt-6">
          <Banner />
        </div>
      <div className="max-w-screen-xl mx-auto px-4">
       <CategorySection categories={categories} />
      </div>

        {/* ---------- 🛒 Danh sách sản phẩm ---------- */}
        <section className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm max-w-screen-xl mx-auto px-4 mt-10 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 border-l-4 border-blue-600 pl-3">
          Sản phẩm nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
      </div>
   
  );
}

export default Home;
