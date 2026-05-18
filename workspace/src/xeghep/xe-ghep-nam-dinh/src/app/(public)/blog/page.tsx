import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import BlogSidebar from "@/components/blog/BlogSidebar";

export const metadata = generateSEO({
  title: "Tin Tức - Xe Ghép Nam Định – Xe Ghép Nam Định Hà Nội | Đặt xe nhanh 24/7",
  description: "Cập nhật tin tức, kinh nghiệm đặt xe ghép Nam Định Hà Nội, bảng giá mới nhất, lộ trình chi tiết.",
  url: "https://xeghepnamdinh.vn/blog",
});

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true } }, category: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Tin tức</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 uppercase">
            Lưu trữ danh mục: Tin Tức
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main - Post List */}
          <div className="lg:col-span-2">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row gap-0">
                      {/* Thumbnail */}
                      <div className="sm:w-72 sm:min-w-[288px] h-48 sm:h-auto bg-gray-100 overflow-hidden shrink-0">
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[180px]">
                            <span className="text-5xl">📄</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col justify-center">
                        <h2 className="font-bold text-gray-900 text-lg md:text-xl leading-snug hover:text-blue-600 transition-colors line-clamp-2 uppercase">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-3 text-gray-500 text-sm line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                          <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                          {post.category && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">{post.category.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500">Chưa có bài viết nào.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <BlogSidebar posts={posts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
