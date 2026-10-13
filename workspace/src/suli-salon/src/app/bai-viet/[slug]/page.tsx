import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailPage from "@/components/PostDetailPage";
import { getPublishedPostBySlug } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) return { title: "Không tìm thấy bài viết | Suli Salon" };

    return {
        title: `${post.title} | Suli Salon`,
        description: post.excerpt || "Chia sẻ từ Suli Salon.",
        openGraph: {
            title: post.title,
            description: post.excerpt || "Chia sẻ từ Suli Salon.",
            images: post.thumbnail ? [{ url: post.thumbnail }] : [],
        },
    };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) notFound();

    return <PostDetailPage post={post} />;
}
