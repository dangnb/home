import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductOrderPanel } from "@/components/ProductOrderPanel";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const averageRating = product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length;
  const relatedProducts = getRelatedProducts(product.slug);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <Link href="/products" className="font-black text-[#8a4f25] transition hover:text-[#2b160c]">
        ← Quay lại thực đơn
      </Link>

      <section className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className={`animate-float-slow relative min-h-[520px] overflow-hidden rounded-[3rem] bg-gradient-to-br ${product.tone} p-8 shadow-2xl shadow-[#8a4f25]/20`}>
          <div className="absolute left-1/2 top-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-b-[7rem] rounded-t-[2rem] bg-[#5b341f] shadow-[0_34px_90px_rgba(65,36,19,0.35)]">
            <div className="absolute -right-20 top-16 h-32 w-24 rounded-r-full border-[20px] border-[#5b341f]" />
            <div className="absolute left-12 top-12 h-5 w-56 rounded-full bg-white/30" />
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-[#70411f]">{product.badge}</div>
        </div>

        <div className="animate-fade-up">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">{product.category}</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-[#2b160c] sm:text-7xl">{product.name}</h1>
          <p className="mt-6 text-lg leading-8 text-[#75543d]">{product.longDescription}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-[#2b160c] px-6 py-3 text-xl font-black text-white">{product.price}</span>
            <span className="rounded-full bg-white/75 px-6 py-3 font-black text-[#70411f] shadow-sm">★ {averageRating.toFixed(1)} từ {product.reviews.length} đánh giá</span>
          </div>
          <ProductOrderPanel product={product} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-white/70 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-black text-[#2b160c]">Tasting notes</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tastingNotes.map((note) => (
                  <span key={note} className="rounded-full bg-[#f7eadb] px-3 py-2 text-sm font-bold text-[#70411f]">{note}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/70 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-black text-[#2b160c]">Gợi ý thêm</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.addOns.map((addOn) => (
                  <span key={addOn} className="rounded-full bg-[#eef3df] px-3 py-2 text-sm font-bold text-[#5b733c]">{addOn}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-20 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Đánh giá</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Khách hàng nói gì?</h2>
          <form className="mt-8 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="grid gap-4">
              <input className="rounded-2xl border border-[#ead8c5] bg-white px-4 py-3 outline-none transition focus:border-[#d9863d]" placeholder="Tên của bạn" />
              <select className="rounded-2xl border border-[#ead8c5] bg-white px-4 py-3 outline-none transition focus:border-[#d9863d]" defaultValue="5">
                <option value="5">5 sao - Rất thích</option>
                <option value="4">4 sao - Hài lòng</option>
                <option value="3">3 sao - Tạm ổn</option>
              </select>
              <textarea className="min-h-32 rounded-2xl border border-[#ead8c5] bg-white px-4 py-3 outline-none transition focus:border-[#d9863d]" placeholder="Chia sẻ cảm nhận về sản phẩm" />
              <button type="button" className="rounded-full bg-[#d9863d] px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-[#bd6f2d]">
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-4">
          {product.reviews.map((review) => (
            <article key={`${review.name}-${review.date}`} className="rounded-[2rem] bg-white/75 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-[#2b160c]">{review.name}</h3>
                  <p className="text-sm font-semibold text-[#a66a34]">{review.date}</p>
                </div>
                <p className="rounded-full bg-[#2b160c] px-4 py-2 font-black text-[#f7c873]">{"★".repeat(review.rating)}</p>
              </div>
              <p className="mt-4 leading-8 text-[#75543d]">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="mb-8">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Có thể bạn thích</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Món liên quan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item, index) => (
            <ProductCard key={item.slug} product={item} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
