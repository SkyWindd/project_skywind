import React, { useState, useEffect } from "react";
import ProductCard from "@/components/Product/productcard";
import Banner from "@/components/Home/banner";
import axios from "axios";
function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const banners = [
    "/banner/banner1.jpg",
    "/banner/banner2.jpg",
    "/banner/banner3.jpg",
  ];

   
  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const res = await axios.get("http://localhost:5000/api/product");
      setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto px-4 mt-6">
        <Banner images={banners} />
      </div>

      <section className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm max-w-screen-xl mx-auto px-4 mt-10 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 border-l-4 border-blue-600 pl-3">
            Sản phẩm nổi bật
          </h2>
        </div>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item.product_id} product={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

