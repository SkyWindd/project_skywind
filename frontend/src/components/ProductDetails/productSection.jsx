import React from "react";
import SpecsTable from "@/components/ProductDetails/productSpecsTable";
import Rating from "@/components/rating";
import { Separator } from "@/components/ui/separator";

export default function ProductSection({ product }) {
  return (
    <div className="mt-10 space-y-6">
      <SpecsTable specs={product.specs} />
      <Separator />
      <Rating productId={product.id} />
    </div>
  );
}
