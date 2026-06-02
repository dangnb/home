import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="animate-fade-up rounded-[3rem] bg-gradient-to-br from-[#2b160c] via-[#6f3f20] to-[#d9863d] p-8 text-white shadow-2xl shadow-[#8a4f25]/25 sm:p-12">
        <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Thanh toán</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.04em] sm:text-7xl">
          Xác nhận đơn và để Mộc Coffee chuẩn bị cho bạn.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f2ddc7]">
          Chọn nhận tại quán hoặc giao hàng, để lại số điện thoại để team liên hệ xác nhận trong ít phút.
        </p>
      </section>

      <CheckoutForm />
    </main>
  );
}
