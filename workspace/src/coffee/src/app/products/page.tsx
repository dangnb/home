import { ProductExplorer } from "@/components/ProductExplorer";
import { bestSellingProducts, featuredProducts, newProducts, products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="animate-fade-up rounded-[3rem] bg-gradient-to-br from-[#2b160c] via-[#6f3f20] to-[#d9863d] p-8 text-white shadow-2xl shadow-[#8a4f25]/25 sm:p-12">
        <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Thực đơn</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.04em] sm:text-7xl">
          Chọn món theo mood hôm nay của bạn.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f2ddc7]">
          Từ cà phê đậm vị, cold brew mát lành đến matcha và bánh ngọt nướng mới mỗi ngày.
        </p>
      </section>

      <ProductExplorer products={products} />

      <section className="grid gap-6 py-8 lg:grid-cols-3">
        {[
          ["Nổi bật", featuredProducts.length, "Những món tạo dấu ấn riêng của Mộc Coffee."],
          ["Bán chạy", bestSellingProducts.length, "Các lựa chọn được khách quay lại đặt nhiều nhất."],
          ["Món mới", newProducts.length, "Công thức mới cho team thích khám phá."],
        ].map(([title, count, desc]) => (
          <div key={title} className="rounded-[2rem] bg-white/70 p-7 shadow-sm backdrop-blur">
            <p className="text-4xl font-black text-[#d9863d]">{count}</p>
            <h3 className="mt-3 text-2xl font-black text-[#2b160c]">{title}</h3>
            <p className="mt-3 leading-7 text-[#75543d]">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
