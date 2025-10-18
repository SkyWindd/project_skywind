import { useState, useEffect } from "react";
import productApi from "@/api/productApi";
import FilterMenu from "@/components/FilterMenu";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productApi.getAll().then(setProducts);
  }, []);

  return (
    <div className="p-4">
      <FilterMenu onFilter={setProducts} />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {products.map((p) => (
          <div key={p.product_id} className="border rounded-lg p-3">
            <img src={p.images[0]} alt={p.name} className="h-32 w-full object-cover mb-2" />
            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-red-500 font-bold">{p.price.toLocaleString()}₫</p>
          </div>
        ))}
      </div>
    </div>
  );
}
