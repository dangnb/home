import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailPage from "@/components/PostDetailPage";
import { getPublishedPostBySlug, getSettings } from "@/lib/db";
import { createBlogPostingJsonLd, getAbsoluteUrl, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) return { title: "Không tìm thấy bài viết | Mộc Salon" };

    const canonicalUrl = getAbsoluteUrl(`/bai-viet/${post.slug}`);
    const description = post.excerpt || "Chia sẻ từ Mộc Salon.";
    const images = post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : undefined;

    return {
        title: post.title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: post.title,
            description,
            url: canonicalUrl,
            type: "article",
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
            images,
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) notFound();

    const settings = await getSettings();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(createBlogPostingJsonLd(post, settings)) }}
            />
            <PostDetailPage post={post} />
        </>
    );
}
