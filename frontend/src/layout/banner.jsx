import React from "react";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Banner() {
     const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )
  const banners = [
    { id: 1, src: "/banner/banner1.jpg", alt: "Banner chính" },
    { id: 2, src: "/banner/banner2.png", alt: "Ảnh nhỏ 1" },
    { id: 3, src: "/banner/banner3.png", alt: "Ảnh nhỏ 2" },
  ];

  return (
    <div className="w-full">
      {/* Layout Desktop */}
      <div className="hidden md:flex flex-row gap-4 rounded-xl overflow-hidden">
        {/* Ảnh lớn bên trái */}
        <div className="w-2/3">
          <img
            src="/banner/banner1.jpg"
            alt="Banner chính"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Hai ảnh nhỏ bên phải */}
        <div className="w-1/3 flex flex-col gap-4">
          <img
            src="banner/banner2.png"
            alt="Ảnh nhỏ 1"
            className="w-full h-[49%] object-cover rounded-xl shadow-md"
          />
          <img
            src="banner/banner3.png"
            alt="Ảnh nhỏ 2"
            className="w-full h-[49%] object-cover rounded-xl shadow-md"
          />
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="md:hidden relative mt-3">
        <Carousel
         opts={{
            align: "start",
            loop: true, // 🔁 Cho phép lặp vô hạn
        }}
        plugins={[plugin.current]} // 🔧 Gắn plugin autoplay
        className="w-full">
          <CarouselContent>
            {banners.map((item) => (
              <CarouselItem key={item.id} className="flex justify-center">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain rounded-xl shadow-md"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Nút điều hướng */}
          <CarouselPrevious className="left-3 bg-white/70 hover:bg-white text-gray-800" />
          <CarouselNext className="right-3 bg-white/70 hover:bg-white text-gray-800" />
        </Carousel>
      </div>
    </div>
  );
}
