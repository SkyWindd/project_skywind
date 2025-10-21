// src/components/product/ProductImages.jsx
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ProductImages
 * - images: array of image URLs
 *
 * Uses shadcn Carousel. Thumbnails below. Clicking a thumbnail sets the current slide.
 * The carousel's internal slider is controlled via 'opts.initial' on mount.
 *
 * Note: shadcn Carousel (keen-slider based) accepts "opts" prop; implementation below uses
 * a local index state and relies on slider's slideChanged callback via opts.slideChanged.
 * If your shadcn version doesn't accept opts.slideChanged, you can use a ref/imperative API.
 */
export default function ProductImages({ images = [] }) {
  const [current, setCurrent] = useState(0);
  // track re-render when user clicks thumbnail
  const [forceKey, setForceKey] = useState(0);

  // When current changes by thumbnail click, we bump forceKey so Carousel re-inits to that slide.
  const handleThumbClick = (index) => {
    setCurrent(index);
    // re-render Carousel with new initial slide
    setForceKey((k) => k + 1);
  };

  // Format: ensure there's at least one image
  const imgs = images && images.length ? images : ["/images/placeholder.png"];

  return (
    <div>
      <div className="relative">
        <Carousel
          // key forces remount and initial slide update when clicking thumbnails
          key={forceKey}
          className="w-full"
          opts={{
            loop: false,
            initial: current,
            slideChanged: (slider) => {
              // slider.track.details.rel gives current index
              const idx = slider.track?.details?.rel ?? 0;
              setCurrent(idx);
            },
          }}
        >
          <CarouselContent>
            {imgs.map((src, idx) => (
              <CarouselItem key={idx}>
                <div className="bg-white rounded-lg p-4 flex items-center justify-center min-h-[360px]">
                  <img
                    src={src}
                    alt={`product-${idx}`}
                    className="max-h-[360px] object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
            aria-label="Previous"
            onClick={() => {
              // find carousel previous button element (shadcn provides CarouselPrevious component but we keep custom handlers safe)
              const prev = document.querySelector(".shadcn-carousel-prev");
              if (prev) prev.click();
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
            aria-label="Next"
            onClick={() => {
              const next = document.querySelector(".shadcn-carousel-next");
              if (next) next.click();
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* These components come from shadcn; they render control buttons */}
          <CarouselPrevious className="hidden shadcn-carousel-prev" />
          <CarouselNext className="hidden shadcn-carousel-next" />
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 overflow-x-auto">
        {imgs.map((src, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbClick(idx)}
            className={`rounded-md p-1 border transition-shadow flex-shrink-0 ${
              current === idx ? "border-blue-600 shadow-lg" : "border-gray-200"
            }`}
            aria-label={`thumbnail-${idx}`}
          >
            <img src={src} alt={`thumb-${idx}`} className="h-16 w-24 object-cover rounded-sm" />
          </button>
        ))}
      </div>
    </div>
  );
}
