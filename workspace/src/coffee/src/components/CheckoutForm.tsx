"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatVnd, type CartItem, type CustomerInfo } from "@/lib/cart";

type SubmittedOrder = {
  code: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  customer: CustomerInfo;
};

const initialCustomer: CustomerInfo = {
  name: "",
  phone: "",
  address: "",
  note: "",
  fulfillment: "pickup",
  payment: "cash",
};

export function CheckoutForm() {
  const { clearCart, hasHydrated, items, subtotal, updateQuantity } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(initialCustomer);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  function updateCustomer<K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Giỏ hàng đang trống, bạn chọn món trước nhé.");
      return;
    }

    if (!customer.name.trim()) {
      setError("Bạn nhập họ tên giúp Mộc Coffee nhé.");
      return;
    }

    if (!customer.phone.trim()) {
      setError("Bạn nhập số điện thoại để team xác nhận đơn nhé.");
      return;
    }

    if (customer.fulfillment === "delivery" && !customer.address.trim()) {
      setError("Bạn nhập địa chỉ giao hàng nhé.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
          customer,
          idempotencyKey,
        }),
      });
      const payload = (await response.json()) as { order?: { code: string; subtotal: number; total: number }; error?: string };

      if (!response.ok || !payload.order) {
        setError(payload.error || "Không thể tạo đơn hàng lúc này.");
        return;
      }

      setSubmittedOrder({
        code: payload.order.code,
        items,
        subtotal: payload.order.subtotal,
        total: payload.order.total,
        customer,
      });
      clearCart();
    } catch {
      setError("Không thể kết nối backend đặt hàng. Bạn thử lại giúp Mộc nhé.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return <p className="mt-10 rounded-[2rem] bg-white/70 p-6 text-center font-bold text-[#75543d]">Đang tải giỏ hàng...</p>;
  }

  if (submittedOrder) {
    return (
      <section className="mt-10 rounded-[3rem] bg-white/75 p-8 shadow-xl shadow-[#8a4f25]/10 backdrop-blur sm:p-12">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Đặt món thành công</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Mã đơn {submittedOrder.code}</h2>
        <p className="mt-5 max-w-2xl leading-8 text-[#75543d]">
          Cảm ơn {submittedOrder.customer.name}. Team Mộc Coffee sẽ liên hệ qua số {submittedOrder.customer.phone} để xác nhận đơn trong ít phút.
        </p>
        <div className="mt-8 rounded-[2rem] bg-[#fff8ef] p-6">
          <div className="space-y-3">
            {submittedOrder.items.map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-4 text-[#2b160c]">
                <span className="font-bold">{item.name} × {item.quantity}</span>
                <span className="font-black">{formatVnd(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#ead8c5] pt-5 text-xl font-black text-[#2b160c]">
            <span>Tổng cộng</span>
            <span>{formatVnd(submittedOrder.total)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="rounded-full bg-[#d9863d] px-6 py-4 text-center font-black text-white transition hover:-translate-y-1 hover:bg-[#bd6f2d]">
            Tiếp tục xem menu
          </Link>
          <Link href="/" className="rounded-full border border-[#d9bfa5] px-6 py-4 text-center font-black text-[#2b160c] transition hover:-translate-y-1 hover:bg-white">
            Về trang chủ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="h-fit rounded-[2.5rem] bg-white/75 p-6 shadow-xl shadow-[#8a4f25]/10 backdrop-blur sm:p-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Đơn của bạn</p>
        <h2 className="mt-3 text-3xl font-black text-[#2b160c]">Tóm tắt giỏ hàng</h2>

        {items.length === 0 ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-[#d9bfa5] p-6 text-center">
            <p className="font-bold text-[#75543d]">Bạn chưa chọn món nào.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-full bg-[#d9863d] px-5 py-3 font-black text-white">
              Chọn món ngay
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article key={item.slug} className="rounded-[2rem] bg-[#fff8ef] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#b56b2a]">{item.category}</p>
                    <h3 className="mt-1 font-black text-[#2b160c]">{item.name}</h3>
                  </div>
                  <p className="font-black text-[#2b160c]">{formatVnd(item.unitPrice * item.quantity)}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white font-black text-[#70411f]">−</button>
                  <span className="grid h-9 min-w-10 place-items-center font-black text-[#2b160c]">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white font-black text-[#70411f]">+</button>
                </div>
              </article>
            ))}
            <div className="flex items-center justify-between border-t border-[#ead8c5] pt-5 text-xl font-black text-[#2b160c]">
              <span>Tạm tính</span>
              <span>{formatVnd(subtotal)}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-[2.5rem] bg-[#2b160c] p-6 text-white shadow-2xl shadow-[#2b160c]/20 sm:p-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Thông tin nhận món</p>
        <h2 className="mt-3 text-3xl font-black">Để lại thông tin đặt hàng</h2>
        <div className="mt-6 grid gap-4">
          <input value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Họ và tên" />
          <input value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Số điện thoại" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-white/10 bg-white/10 p-4 font-bold"><input type="radio" checked={customer.fulfillment === "pickup"} onChange={() => updateCustomer("fulfillment", "pickup")} className="mr-2" />Nhận tại quán</label>
            <label className="rounded-2xl border border-white/10 bg-white/10 p-4 font-bold"><input type="radio" checked={customer.fulfillment === "delivery"} onChange={() => updateCustomer("fulfillment", "delivery")} className="mr-2" />Giao hàng</label>
          </div>
          {customer.fulfillment === "delivery" && (
            <input value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Địa chỉ giao hàng" />
          )}
          <select value={customer.payment} onChange={(event) => updateCustomer("payment", event.target.value as CustomerInfo["payment"])} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#f7c873]">
            <option value="cash" className="text-[#2b160c]">Thanh toán tiền mặt</option>
            <option value="transfer" className="text-[#2b160c]">Chuyển khoản</option>
          </select>
          <textarea value={customer.note} onChange={(event) => updateCustomer("note", event.target.value)} className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Ghi chú: ít đá, ít ngọt, giờ nhận món..." />
          {error && <p className="rounded-2xl bg-red-500/15 px-4 py-3 font-bold text-red-100">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#f7c873] px-6 py-4 font-black text-[#2b160c] transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
          </button>
        </div>
      </form>
    </section>
  );
}
