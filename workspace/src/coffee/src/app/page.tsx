import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { bestSellingProducts, featuredProducts, newProducts, products } from "@/lib/products";

function ProductSection({ title, eyebrow, items }: { title: string; eyebrow: string; items: typeof products }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2b160c] sm:text-4xl">{title}</h2>
        </div>
        <Link href="/products" className="font-black text-[#8a4f25] transition hover:text-[#2b160c]">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((product, index) => (
          <div key={product.slug} className="animate-fade-up">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(217,134,61,0.28),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(107,143,78,0.18),transparent_24rem)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <p className="inline-flex rounded-full border border-[#edcda8] bg-white/60 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-[#a65f25] shadow-sm">
              Coffee • Brunch • Creative corner
            </p>
            <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#2b160c] sm:text-7xl lg:text-8xl">
              Cà phê ngon, vibe trẻ, ngày nào cũng muốn ghé.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#75543d] sm:text-xl">
              Mộc Coffee là nơi ly cà phê rang mộc gặp không gian hiện đại, âm nhạc nhẹ và những câu chuyện đang chờ được bắt đầu.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className="rounded-full bg-[#2b160c] px-7 py-4 text-center font-black text-white shadow-xl shadow-[#2b160c]/20 transition hover:-translate-y-1 hover:bg-[#4a2a18]">
                Khám phá thực đơn
              </Link>
              <Link href="/about" className="rounded-full border border-[#d7b99b] bg-white/55 px-7 py-4 text-center font-black text-[#2b160c] transition hover:-translate-y-1 hover:bg-white">
                Câu chuyện của quán
              </Link>
            </div>
          </div>
          <div className="relative min-h-[520px]">
            <div className="animate-gradient animate-glow absolute inset-6 rounded-[3rem] bg-gradient-to-br from-[#f4b66d] via-[#f7dfbd] to-[#8cac68]" />
            <div className="animate-float absolute left-4 top-6 rounded-[2rem] bg-white/80 p-5 shadow-2xl backdrop-blur">
              <p className="text-sm font-bold text-[#b56b2a]">Signature</p>
              <p className="mt-2 text-2xl font-black text-[#2b160c]">Cà phê sữa đá Mộc</p>
            </div>
            <div className="animate-float-slow absolute bottom-10 right-2 rounded-[2rem] bg-[#2b160c] p-5 text-white shadow-2xl">
              <p className="text-sm text-[#f7c873]">Rating hôm nay</p>
              <p className="mt-1 text-3xl font-black">4.9/5</p>
            </div>
            <div className="absolute left-1/2 top-1/2 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-b-[6rem] rounded-t-[2rem] bg-[#5b341f] shadow-[0_34px_90px_rgba(65,36,19,0.35)]">
              <div className="absolute -right-16 top-14 h-28 w-20 rounded-r-full border-[18px] border-[#5b341f]" />
              <div className="absolute left-12 top-10 h-4 w-48 rounded-full bg-white/30" />
              <div className="absolute -top-14 left-10 h-24 w-6 rounded-full bg-white/45 blur-sm" />
              <div className="absolute -top-20 left-32 h-32 w-6 rounded-full bg-white/35 blur-sm" />
              <div className="absolute -top-12 right-16 h-20 w-6 rounded-full bg-white/30 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-4">
        {[
          ["18h", "Cold brew ủ chậm"],
          ["40+", "Món đồ uống & bánh"],
          ["4.9", "Điểm khách hàng"],
          ["08:00", "Mở cửa mỗi ngày"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur">
            <p className="text-3xl font-black text-[#2b160c]">{value}</p>
            <p className="mt-2 font-semibold text-[#75543d]">{label}</p>
          </div>
        ))}
      </section>

      <ProductSection eyebrow="Must try" title="Sản phẩm nổi bật" items={featuredProducts} />
      <ProductSection eyebrow="Best sellers" title="Bán chạy nhất tuần" items={bestSellingProducts} />
      <ProductSection eyebrow="Fresh drops" title="Món mới vừa lên kệ" items={newProducts} />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div className="rounded-[2.5rem] bg-[#2b160c] p-8 text-white shadow-2xl shadow-[#2b160c]/20 sm:p-12">
          <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Về quán</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Một góc nhỏ cho năng lượng mới.</h2>
          <p className="mt-5 leading-8 text-[#e6cfb7]">
            Chúng mình chọn hạt kỹ, pha chế chỉn chu và thiết kế không gian mở để bạn có thể làm việc, gặp bạn bè hoặc đơn giản là tận hưởng một ly đồ uống thật ngon.
          </p>
          <Link href="/about" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-black text-[#2b160c] transition hover:-translate-y-1">
            Tìm hiểu thêm
          </Link>
        </div>
        <div className="rounded-[2.5rem] border border-[#ead8c5] bg-white/70 p-8 shadow-xl backdrop-blur sm:p-12">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Tuyển dụng</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#2b160c]">Gia nhập team Mộc Coffee.</h2>
          <p className="mt-5 leading-8 text-[#75543d]">
            Nếu bạn thích cà phê, thích giao tiếp và muốn làm trong môi trường trẻ trung, chúng mình đang tìm barista, phục vụ và content creator part-time.
          </p>
          <Link href="/recruitment" className="mt-8 inline-flex rounded-full bg-[#d9863d] px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-[#bd6f2d]">
            Xem vị trí mở
          </Link>
        </div>
      </section>
    </main>
  );
}
