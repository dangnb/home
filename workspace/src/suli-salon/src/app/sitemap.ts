import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/db";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sulisalon.vn").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getPublishedPosts();
    const now = new Date();

    const routes = [
        { path: "", changeFrequency: "weekly" as const, priority: 1 },
        { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
        { path: "/gallery", changeFrequency: "weekly" as const, priority: 0.8 },
        { path: "/bai-viet", changeFrequency: "weekly" as const, priority: 0.8 },
        { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
        { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
        { path: "/booking", changeFrequency: "monthly" as const, priority: 0.5 },
    ].map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    const postUrls = posts.map((post) => ({
        url: `${BASE_URL}/bai-viet/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...routes, ...postUrls];
}
