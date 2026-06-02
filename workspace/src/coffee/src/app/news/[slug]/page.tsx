import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedNewsPostBySlug, getPublishedNewsPosts } from "@/features/news/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedNewsPostBySlug(slug);

  return {
    title: `${post.title} | Mộc Coffee`,
    description: post.excerpt,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedNewsPostBySlug(slug);
  const recentPosts = (await getPublishedNewsPosts()).filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <Link href="/news" className="font-black text-[#8a4f25] transition hover:text-[#2b160c]">
        ← Quay lại tin tức
      </Link>

      <article className="mt-8 rounded-[3rem] bg-white/75 p-7 shadow-2xl shadow-[#8a4f25]/10 backdrop-blur sm:p-12">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">
          {post.publishedAt ? formatDate(post.publishedAt) : "Tin Mộc"}
        </p>
        <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-[#2b160c] sm:text-7xl">{post.title}</h1>
        <p className="mt-6 text-xl leading-8 text-[#75543d]">{post.excerpt}</p>
        <div className="my-10 h-72 rounded-[2.5rem] bg-gradient-to-br from-[#f5c17f] via-[#fff4e4] to-[#8cac68]" />
        <div className="space-y-6 text-lg leading-9 text-[#4f321f]">
          {post.content.split("\n").filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      {recentPosts.length > 0 && (
        <section className="py-14">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Tin khác</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {recentPosts.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="rounded-[2rem] bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white">
                <p className="text-sm font-bold text-[#b56b2a]">{item.publishedAt ? formatDate(item.publishedAt) : "Mộc Coffee"}</p>
                <h2 className="mt-3 text-xl font-black text-[#2b160c]">{item.title}</h2>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
