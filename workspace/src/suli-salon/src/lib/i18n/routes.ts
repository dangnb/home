import type { Locale } from "./config";

export type PublicRoute = "home" | "services" | "gallery" | "about" | "contact" | "booking" | "posts";

const routeSegments: Record<Locale, Record<PublicRoute, string>> = {
  vi: {
    home: "",
    services: "dich-vu",
    gallery: "bo-suu-tap",
    about: "gioi-thieu",
    contact: "lien-he",
    booking: "dat-lich",
    posts: "bai-viet",
  },
  en: {
    home: "",
    services: "services",
    gallery: "gallery",
    about: "about",
    contact: "contact",
    booking: "booking",
    posts: "journal",
  },
};

export function getLocalizedPath(locale: Locale, route: PublicRoute, suffix = ""): string {
  const segment = routeSegments[locale][route];
  const base = segment ? `/${locale}/${segment}` : `/${locale}`;
  return suffix ? `${base}/${suffix.replace(/^\//, "")}` : base;
}

export function getLocalizedPostPath(locale: Locale, slug: string): string {
  return getLocalizedPath(locale, "posts", slug);
}

export function getRouteFromSegments(locale: Locale, segments: string[]): PublicRoute | "post" | null {
  if (segments.length === 0) return "home";

  const [first, second, ...remaining] = segments;
  const routes = routeSegments[locale];
  const route = (Object.keys(routes) as PublicRoute[]).find((key) => routes[key] === first);

  if (!route || remaining.length > 0) return null;
  if (route === "posts" && second) return "post";
  return second ? null : route;
}

export function getEquivalentPath(locale: Locale, pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const sourceLocale = parts[0] as Locale;
  if (sourceLocale !== "vi" && sourceLocale !== "en") return getLocalizedPath(locale, "home");

  const rest = parts.slice(1);
  const sourceRoute = getRouteFromSegments(sourceLocale, rest);
  if (!sourceRoute) return getLocalizedPath(locale, "home");
  if (sourceRoute === "post") return getLocalizedPostPath(locale, rest[1]);
  return getLocalizedPath(locale, sourceRoute);
}

export function getLegacyPath(locale: Locale, pathname: string): string | null {
  const legacy: Record<string, PublicRoute> = {
    "/": "home",
    "/services": "services",
    "/gallery": "gallery",
    "/about": "about",
    "/contact": "contact",
    "/booking": "booking",
    "/bai-viet": "posts",
  };

  const route = legacy[pathname];
  if (route) return getLocalizedPath(locale, route);
  if (pathname.startsWith("/bai-viet/")) return getLocalizedPostPath(locale, pathname.slice("/bai-viet/".length));
  return null;
}

export function getLocalizedText(text: string | null | undefined, locale: Locale): string {
  if (!text) return "";
  if (text.includes(" | ")) {
    const [vi, en] = text.split(" | ");
    return (locale === "en" ? en : vi)?.trim() || text;
  }
  return text;
}

export function getLocalizedPrice(price: string | null | undefined, locale: Locale): string {
  if (!price) return "";
  if (price.includes(" | ")) {
    const [vi, en] = price.split(" | ");
    return (locale === "en" ? en : vi)?.trim() || price;
  }
  return price;
}

export function getLocalizedContent(content: string | null | undefined, locale: Locale): string {
  if (!content) return "";
  if (content.includes("<!-- bilingual-split -->")) {
    const [vi, en] = content.split("<!-- bilingual-split -->");
    return (locale === "en" ? en : vi)?.trim() || content;
  }
  return content;
}

