import type { PostData, SiteSettings } from "@/lib/db";
import { LOCALE_METADATA, type Locale } from "@/lib/i18n/config";
import { getLocalizedPostPath } from "@/lib/i18n/routes";

const FALLBACK_SITE_URL = "https://mocsalon.vn";

export function getSiteUrl(): string {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;

    try {
        return new URL(configuredUrl).origin;
    } catch {
        return FALLBACK_SITE_URL;
    }
}

export function getAbsoluteUrl(path = "/"): string {
    return new URL(path, `${getSiteUrl()}/`).toString();
}

export function getSocialProfiles(settings: SiteSettings): string[] {
    return [settings.facebook, settings.instagram, settings.tiktok, settings.youtube, settings.zalo]
        .filter((url): url is string => Boolean(url))
        .filter((url) => {
            try {
                return ["http:", "https:"].includes(new URL(url).protocol);
            } catch {
                return false;
            }
        });
}


function getGeoCoordinates(settings: SiteSettings) {
    const latitude = Number(settings.mapLat);
    const longitude = Number(settings.mapLng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined;

    return { "@type": "GeoCoordinates", latitude, longitude };
}

export function createBeautySalonJsonLd(settings: SiteSettings, locale: Locale = "vi") {
    const salon: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "BeautySalon",
        "@id": `${getSiteUrl()}/#business`,
        name: settings.siteName,
        url: getSiteUrl(),
        description: settings.seoDescription || settings.tagline,
        inLanguage: LOCALE_METADATA[locale].htmlLang,
        telephone: settings.hotline || undefined,
        email: settings.email || undefined,
        image: settings.bannerImage || undefined,
        address: settings.address || undefined,
        openingHours: settings.workingHours || undefined,
        geo: getGeoCoordinates(settings),
        sameAs: getSocialProfiles(settings),
    };

    return Object.fromEntries(Object.entries(salon).filter(([, value]) => value !== undefined && value !== ""));
}

export function createBlogPostingJsonLd(post: PostData, settings: SiteSettings, locale: Locale = "vi", path?: string) {
    const postUrl = path ? getAbsoluteUrl(path) : getAbsoluteUrl(getLocalizedPostPath(locale, post.slug));
    const article: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": postUrl,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
        },
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.thumbnail || undefined,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        inLanguage: LOCALE_METADATA[locale].openGraph.replace("_", "-"),
        author: {
            "@type": "Organization",
            name: settings.siteName,
            url: getSiteUrl(),
        },
        publisher: {
            "@type": "BeautySalon",
            "@id": `${getSiteUrl()}/#business`,
            name: settings.siteName,
            url: getSiteUrl(),
            logo: settings.bannerImage || undefined,
        },
    };

    return Object.fromEntries(Object.entries(article).filter(([, value]) => value !== undefined && value !== ""));
}

export function serializeJsonLd(data: unknown): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}
