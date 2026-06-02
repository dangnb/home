"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { formatVnd } from "@/lib/cart";

export function CartDrawer() {
  const { clearCart, closeCart, hasHydrated, isOpen, items, removeItem, subtotal, updateQuantity } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-[#2b160c]/45 backdrop-blur-sm" onClick={closeCart} aria-label="Đóng giỏ hàng" type="button" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#fff8ef] p-5 shadow-2xl shadow-[#2b160c]/25 sm:p-7"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#ead8c5] pb-5">
          <div>
            <p className="font-bold uppercase tracking-[0.22em] text-[#b56b2a]">Mộc Coffee</p>
            <h2 className="mt-1 text-3xl font-black text-[#2b160c]">Giỏ hàng của bạn</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-11 w-11 place-items-center rounded-full bg-white font-black text-[#2b160c] shadow-sm transition hover:bg-[#2b160c] hover:text-white"
            aria-label="Đóng giỏ hàng"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          {!hasHydrated ? (
            <p className="rounded-[2rem] bg-white/70 p-6 text-center font-bold text-[#75543d]">Đang tải giỏ hàng...</p>
          ) : items.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-[#d9bfa5] bg-white/70 p-8 text-center">
              <p className="text-2xl font-black text-[#2b160c]">Giỏ hàng đang trống.</p>
              <p className="mt-3 leading-7 text-[#75543d]">Chọn vài món signature để Mộc Coffee chuẩn bị cho bạn nhé.</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-6 inline-flex rounded-full bg-[#d9863d] px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-[#bd6f2d]"
              >
                Xem thực đơn
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.slug} className="rounded-[2rem] bg-white/75 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#b56b2a]">{item.category}</p>
                      <h3 className="mt-1 text-xl font-black text-[#2b160c]">{item.name}</h3>
                      <p className="mt-2 font-bold text-[#75543d]">{item.price}</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.slug)} className="font-black text-[#a66a34] transition hover:text-[#2b160c]">
                      Xóa
                    </button>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center rounded-full bg-[#f7eadb] p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white font-black text-[#70411f] transition hover:bg-[#2b160c] hover:text-white"
                        aria-label={`Giảm ${item.name}`}
                      >
                        −
                      </button>
                      <span className="grid h-9 min-w-11 place-items-center px-2 font-black text-[#2b160c]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white font-black text-[#70411f] transition hover:bg-[#2b160c] hover:text-white"
                        aria-label={`Tăng ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-black text-[#2b160c]">{formatVnd(item.unitPrice * item.quantity)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {hasHydrated && items.length > 0 && (
          <div className="border-t border-[#ead8c5] pt-5">
            <div className="flex items-center justify-between text-xl font-black text-[#2b160c]">
              <span>Tạm tính</span>
              <span>{formatVnd(subtotal)}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={clearCart} className="rounded-full border border-[#d9bfa5] px-5 py-3 font-black text-[#70411f] transition hover:bg-white">
                Xóa giỏ
              </button>
              <Link href="/checkout" onClick={closeCart} className="rounded-full bg-[#2b160c] px-5 py-3 text-center font-black text-white transition hover:-translate-y-1 hover:bg-[#4a2a18]">
                Đi thanh toán
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
