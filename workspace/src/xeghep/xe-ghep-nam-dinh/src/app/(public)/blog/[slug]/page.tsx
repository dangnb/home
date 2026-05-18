import { notFound } from "next/navigation";
import BlogContent from "@/components/blog/BlogContent";
import { generateSEO } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: { OR: [{ slug }, { id: slug }], published: true },
      include: { author: { select: { name: true } }, category: true },
    });
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return generateSEO({
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || "",
    url: `https://xeghepnamdinh.vn/blog/${post.slug}`,
    image: post.ogImage || post.thumbnail || undefined,
    type: "article",
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author?.name },
    publisher: {
      "@type": "Organization",
      name: "Xe Ghép Nam Định",
      url: "https://xeghepnamdinh.vn",
    },
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>Bởi {post.author?.name}</span>
            <span>•</span>
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {post.thumbnail && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <BlogContent content={post.content} />

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Đặt xe ghép Nam Định ngay</h3>
          <p className="text-blue-100 mb-6">Đón tận nhà, giá trọn gói, xe đời mới 100%</p>
          <a
            href="tel:0379803990"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-shadow"
          >
            Gọi ngay: 0379.803.990
          </a>
        </div>
      </article>
    </div>
  );
}
