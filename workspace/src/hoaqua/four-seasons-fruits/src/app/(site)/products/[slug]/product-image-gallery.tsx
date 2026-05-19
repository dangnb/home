"use client";

// Product Image Gallery with thumbnail navigation
// Shows main image + clickable thumbnails below

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isOnSale: boolean;
  discountPercent: number;
}

export function ProductImageGallery({
  images,
  productName,
  isOnSale,
  discountPercent,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
        {isOnSale && discountPercent > 0 && (
          <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white border-0 text-sm px-3 py-1.5 rounded-full shadow-md">
            -{discountPercent}%
          </Badge>
        )}

        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[activeIndex]}
                alt={`${productName} - Ảnh ${activeIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[120px] bg-gradient-to-br from-emerald-50 to-orange-50">
              🍊
            </div>
          )}
        </AnimatePresence>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-emerald-500 ring-2 ring-emerald-100 scale-105"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
