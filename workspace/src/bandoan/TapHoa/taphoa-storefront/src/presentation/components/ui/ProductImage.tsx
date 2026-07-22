'use client';
import { useState, useEffect } from 'react';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

// Fallback SVG Data URI in case network is completely offline
const SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f3f4f6"/><g transform="translate(110, 110)"><path fill="%239ca3af" d="M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 15c13.8 0 25 11.2 25 25S53.8 65 40 65 15 53.8 15 40s11.2-25 25-25z"/><path fill="%239ca3af" d="M25 30h30v20H25z"/></g><text x="150" y="200" font-family="sans-serif" font-size="14" fill="%239ca3af" text-anchor="middle">Sản phẩm Tạp Hóa</text></svg>`;

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className = '',
  fill = false,
  width,
  height,
}: ProductImageProps) {
  const initialSrc = src && src.trim() !== '' ? src : DEFAULT_PRODUCT_IMAGE;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src && src.trim() !== '' ? src : DEFAULT_PRODUCT_IMAGE);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(DEFAULT_PRODUCT_IMAGE);
    } else {
      setImgSrc(SVG_FALLBACK);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${fill ? 'w-full h-full object-cover' : ''} ${className}`}
      onError={handleError}
      loading="lazy"
    />
  );
}
