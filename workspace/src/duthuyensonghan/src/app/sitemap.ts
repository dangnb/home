import { MetadataRoute } from 'next';
import { getCruises, getPosts } from '@/lib/db';

const BASE_URL = 'https://duthuyensonghan.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const cruises = await getCruises();
    const posts = await getPosts();

    const cruiseUrls = cruises.map((c) => ({
        url: `${BASE_URL}/du-thuyen/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const postUrls = posts.filter(p => p.status === 'published').map((p) => ({
        url: `${BASE_URL}/bai-viet/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const routes = ['', '/du-thuyen', '/bai-viet', '/gia-ve', '/lien-he'].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...routes, ...cruiseUrls, ...postUrls];
}
