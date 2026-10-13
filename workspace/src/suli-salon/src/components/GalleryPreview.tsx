"use client";

import Image from "next/image";
import { useEffect } from "react";
import { setupReveal } from "@/lib/animations";

const images = Array.from({ length: 10 }, () => "/uploads/banner.png");
const imageClassName = "object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700";
const smallTileSizes = "(max-width: 768px) calc((100vw - 48px) / 2), (max-width: 1280px) calc((100vw - 176px) / 4), 288px";
const wideTileSizes = "(max-width: 768px) 100vw, (max-width: 1280px) calc((100vw - 112px) / 2), 592px";

interface GalleryTileProps {
  image: string;
  className?: string;
  sizes: string;
}

function GalleryTile({ image, className = "", sizes }: GalleryTileProps) {
  return (
    <div className={`relative overflow-hidden hover:opacity-95 transition-opacity group ${className}`}>
      <Image
        src={image}
        alt=""
        fill
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}

export default function GalleryPreview() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 bg-surface px-margin-desktop reveal">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-headline-md text-display-lg text-primary italic mb-2">Mộc Salon</h2>
          <p className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Luxury Nail Gallery in Prague</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
          <GalleryTile image={images[0]} className="row-span-2" sizes={smallTileSizes} />
          <GalleryTile image={images[1]} sizes={smallTileSizes} />
          <GalleryTile image={images[2]} className="row-span-2 col-span-2" sizes={wideTileSizes} />
          <GalleryTile image={images[3]} sizes={smallTileSizes} />
          <GalleryTile image={images[4]} sizes={smallTileSizes} />
          <GalleryTile image={images[5]} className="row-span-2" sizes={smallTileSizes} />
          <GalleryTile image={images[6]} sizes={smallTileSizes} />
          <GalleryTile image={images[7]} sizes={smallTileSizes} />
          <GalleryTile image={images[8]} className="col-span-2" sizes={wideTileSizes} />
          <GalleryTile image={images[9]} sizes={smallTileSizes} />
        </div>
      </div>
    </section>
  );
}
