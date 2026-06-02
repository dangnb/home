import Link from "next/link";
import { getPublishedNewsPosts } from "@/features/news/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getPublishedNewsPosts();

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="animate-fade-up rounded-[3rem] bg-gradient-to-br from-[#2b160c] via-[#6f3f20] to-[#d9863d] p-8 text-white shadow-2xl shadow-[#8a4f25]/25 sm:p-12">
        <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Tin tức</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-[-0.04em] sm:text-7xl">
          Chuyện cà phê, món mới và những góc nhỏ ở Mộc.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f2ddc7]">
          Cập nhật công thức mới, câu chuyện sau quầy pha chế và các hoạt động tuyển dụng/cộng đồng của Mộc Coffee.
        </p>
      </section>

      <section className="grid gap-6 py-14 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="animate-fade-up group rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_70px_rgba(86,48,25,0.12)] backdrop-blur transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_90px_rgba(86,48,25,0.2)]"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="mb-5 h-44 rounded-[1.5rem] bg-gradient-to-br from-[#f5c17f] via-[#fff4e4] to-[#8cac68] transition duration-500 group-hover:scale-[1.02]" />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b56b2a]">
              {post.publishedAt ? formatDate(post.publishedAt) : "Mộc Coffee"}
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#2b160c]">{post.title}</h2>
            <p className="mt-3 leading-7 text-[#75543d]">{post.excerpt}</p>
            <span className="mt-6 inline-flex font-black text-[#8a4f25] transition group-hover:text-[#2b160c]">Đọc tiếp →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
