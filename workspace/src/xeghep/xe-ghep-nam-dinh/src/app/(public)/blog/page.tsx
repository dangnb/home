import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata = generateSEO({
  title: "Blog Xe Ghép Nam Định - Tin tức, kinh nghiệm đặt xe",
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
      take: 12,
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Blog Xe Ghép Nam Định
          </h1>
          <p className="mt-4 text-gray-600">
            Tin tức, kinh nghiệm đặt xe và bảng giá mới nhất
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {post.thumbnail && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-bold text-gray-900 text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-3 text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>Chưa có bài viết nào. Hãy quay lại sau!</p>
          </div>
        )}
      </div>
    </div>
  );
}
