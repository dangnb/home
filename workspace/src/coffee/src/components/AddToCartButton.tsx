"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ product, quantity = 1, className = "" }: { product: Product; quantity?: number; className?: string }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product, quantity);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1200);
      }}
      className={`rounded-full bg-[#d9863d] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#d9863d]/20 transition hover:-translate-y-1 hover:bg-[#bd6f2d] ${className}`}
    >
      {justAdded ? "Đã thêm ✓" : "Thêm vào giỏ"}
    </button>
  );
}
