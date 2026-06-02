import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const posts = await db.newsPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Tin tức</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Quản lý bài viết</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b56b2a]">{post.status} · {post.publishedAt ? formatDate(post.publishedAt) : "Chưa đăng"}</p>
              <h2 className="mt-3 text-2xl font-black text-[#2b160c]">{post.title}</h2>
              <p className="mt-3 leading-7 text-[#75543d]">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
