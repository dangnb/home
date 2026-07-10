"use client";
import React, { useEffect } from "react";
import { setupReveal } from "@/lib/animations";

const images = [
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png",
  "/uploads/banner.png"
];

export default function GalleryPreview() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 bg-surface px-margin-desktop reveal">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-headline-md text-display-lg text-primary italic mb-2">Suli Salon</h2>
          <p className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Luxury Nail Gallery in Prague</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {/* Bento Gallery Items with Hover Interaction */}
          <div className="row-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[0]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[1]} />
          </div>
          <div className="row-span-2 col-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[2]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[3]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[4]} />
          </div>
          <div className="row-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[5]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[6]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[7]} />
          </div>
          <div className="col-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[8]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[9]} />
          </div>
        </div>
      </div>
    </section>
  );
}
