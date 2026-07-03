import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://home-theta-blue.vercel.app';

    // Lấy các ngôn ngữ đang hoạt động
    const activeLangs = await prisma.language.findMany({
        where: { isActive: true },
        select: { code: true }
    });

    const langs = activeLangs.length > 0 ? activeLangs.map(l => l.code) : ['vi', 'en'];

    // Lấy các danh mục (bài viết/ trang con)
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true }
    });

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 1. Sinh URL cho Home Page theo từng ngôn ngữ
    langs.forEach(lang => {
        sitemapEntries.push({
            url: `${baseUrl}/${lang}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        });

        // Trang liên hệ
        sitemapEntries.push({
            url: `${baseUrl}/${lang}/lien-he`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        });
    });

    // 2. Sinh URL cho tất cả Danh Mục (Categories) / Bài viết
    categories.forEach(category => {
        langs.forEach(lang => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/category/${category.slug}`,
                lastModified: category.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    });

    return sitemapEntries;
}
