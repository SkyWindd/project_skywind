import React, { useState } from "react";
import { Card } from "@/components/ui/card";

export default function ProductImages({ images }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border shadow-sm">
        <img
          src={images[selected]}
          alt="product"
          className="w-full h-[400px] object-contain"
        />
      </Card>

      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt="thumb"
            onClick={() => setSelected(idx)}
            className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition
              ${selected === idx ? "border-red-500 scale-105" : "border-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
