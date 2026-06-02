"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export function ProductOrderPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b56b2a]">Đặt món nhanh</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full bg-[#f7eadb] p-1">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="grid h-10 w-10 place-items-center rounded-full bg-white font-black text-[#70411f] transition hover:bg-[#2b160c] hover:text-white"
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span className="grid h-10 min-w-12 place-items-center px-3 font-black text-[#2b160c]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            className="grid h-10 w-10 place-items-center rounded-full bg-white font-black text-[#70411f] transition hover:bg-[#2b160c] hover:text-white"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => addItem(product, quantity)}
          className="rounded-full bg-[#d9863d] px-7 py-4 font-black text-white shadow-xl shadow-[#d9863d]/20 transition hover:-translate-y-1 hover:bg-[#bd6f2d]"
        >
          Thêm {quantity} món vào giỏ
        </button>
      </div>
    </div>
  );
}
