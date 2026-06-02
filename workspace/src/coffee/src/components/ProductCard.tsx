import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article
      className="group rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_24px_70px_rgba(86,48,25,0.12)] backdrop-blur transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_90px_rgba(86,48,25,0.2)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative mb-5 h-48 overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.tone}`}>
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 shadow-inner transition duration-500 group-hover:scale-110" />
          <div className="absolute left-1/2 top-[45%] h-20 w-28 -translate-x-1/2 rounded-b-[3rem] rounded-t-lg bg-[#5b341f] shadow-[0_14px_35px_rgba(69,38,20,0.25)] transition duration-500 group-hover:rotate-3">
            <div className="absolute -right-7 top-4 h-10 w-9 rounded-r-full border-[10px] border-[#5b341f] bg-transparent" />
            <div className="absolute left-5 top-3 h-2 w-16 rounded-full bg-white/35" />
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#70411f]">
            {product.badge ?? product.category}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#b56b2a]">{product.category}</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-[#2b160c]">{product.name}</h3>
            </div>
            <p className="rounded-full bg-[#2b160c] px-3 py-1 text-sm font-bold text-white">{product.price}</p>
          </div>
          <p className="text-sm leading-6 text-[#75543d]">{product.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {product.tastingNotes.slice(0, 2).map((note) => (
              <span key={note} className="rounded-full bg-[#f7eadb] px-3 py-1 text-xs font-semibold text-[#70411f]">
                {note}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#ead8c5] pt-4">
        <Link href={`/products/${product.slug}`} className="font-black text-[#8a4f25] transition hover:text-[#2b160c]">
          Chi tiết →
        </Link>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
