import type { Metadata } from "next";
import PostListPage from "@/components/PostListPage";
import { getPublishedPosts } from "@/lib/db";

export const metadata: Metadata = {
    title: "Góc chia sẻ | Mộc Salon",
    description: "Cập nhật xu hướng và bí quyết chăm sóc móng từ Mộc Salon.",
};

export default async function PostsPage() {
    const posts = await getPublishedPosts();
    return <PostListPage posts={posts} />;
}
