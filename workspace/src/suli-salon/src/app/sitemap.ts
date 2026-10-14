import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/db";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { getLocalizedPath, getLocalizedPostPath, type PublicRoute } from "@/lib/i18n/routes";
import { getSiteUrl } from "@/lib/seo";

const BASE_URL = getSiteUrl();

const STATIC_ROUTES: Array<{
  route: PublicRoute;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}> = [
  { route: "home", changeFrequency: "weekly", priority: 1.0 },
  { route: "services", changeFrequency: "weekly", priority: 0.9 },
  { route: "gallery", changeFrequency: "weekly", priority: 0.8 },
  { route: "posts", changeFrequency: "weekly", priority: 0.8 },
  { route: "about", changeFrequency: "monthly", priority: 0.6 },
  { route: "contact", changeFrequency: "monthly", priority: 0.6 },
  { route: "booking", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts().catch(() => []);
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const item of STATIC_ROUTES) {
    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${BASE_URL}${getLocalizedPath(locale, item.route)}`,
        lastModified: now,
        changeFrequency: item.changeFrequency,
        priority: locale === "vi" ? item.priority : Math.max(0.3, item.priority - 0.1),
        alternates: {
          languages: {
            vi: `${BASE_URL}${getLocalizedPath("vi", item.route)}`,
            en: `${BASE_URL}${getLocalizedPath("en", item.route)}`,
          },
        },
      });
    }
  }

  for (const post of posts) {
    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${BASE_URL}${getLocalizedPostPath(locale, post.slug)}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            vi: `${BASE_URL}${getLocalizedPostPath("vi", post.slug)}`,
            en: `${BASE_URL}${getLocalizedPostPath("en", post.slug)}`,
          },
        },
      });
    }
  }

  return entries;
}
