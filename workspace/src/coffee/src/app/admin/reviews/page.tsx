import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Reviews</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Đánh giá khách hàng</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2b160c]">{review.name}</h2>
                  <p className="mt-2 font-bold text-[#75543d]">{review.product?.name ?? "Sản phẩm đã xoá"} · {formatDate(review.createdAt)}</p>
                </div>
                <p className="rounded-full bg-[#2b160c] px-4 py-2 font-black text-[#f7c873]">{review.status}</p>
              </div>
              <p className="mt-4 font-black text-[#d9863d]">{"★".repeat(review.rating)}</p>
              <p className="mt-3 leading-7 text-[#75543d]">{review.comment}</p>
            </article>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
