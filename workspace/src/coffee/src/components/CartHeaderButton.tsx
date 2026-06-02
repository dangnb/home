"use client";

import { useCart } from "@/components/CartProvider";

export function CartHeaderButton() {
  const { hasHydrated, itemCount, openCart } = useCart();
  const displayCount = hasHydrated ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative rounded-full border border-[#ead8c5] bg-white/70 px-5 py-3 text-sm font-black text-[#2b160c] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
      aria-label={`Mở giỏ hàng, ${displayCount} món`}
    >
      Giỏ hàng
      {displayCount > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#2b160c] px-1 text-xs text-[#f7c873]">
          {displayCount}
        </span>
      )}
    </button>
  );
}
