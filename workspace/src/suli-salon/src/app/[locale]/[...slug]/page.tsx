import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ServicesPage from "@/components/ServicesPage";
import GalleryPage from "@/components/GalleryPage";
import AboutPage from "@/components/AboutPage";
import ContactPage from "@/components/ContactPage";
import BookingPage from "@/components/BookingPage";
import PostListPage from "@/components/PostListPage";
import PostDetailPage from "@/components/PostDetailPage";
import {
  getCategories,
  getGalleryItems,
  getPublishedPostBySlug,
  getPublishedPosts,
  getServices,
  getSettings,
  getTeamMembers,
} from "@/lib/db";
import { LOCALE_METADATA, SUPPORTED_LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  getLocalizedPath,
  getLocalizedPostPath,
  getLocalizedText,
  getRouteFromSegments,
  type PublicRoute,
} from "@/lib/i18n/routes";
import { createBlogPostingJsonLd, getAbsoluteUrl, serializeJsonLd } from "@/lib/seo";

export const revalidate = 300;

const STATIC_ROUTES: PublicRoute[] = [
  "services",
  "gallery",
  "about",
  "contact",
  "booking",
  "posts",
];

export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  const params: Array<{ locale: string; slug: string[] }> = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of STATIC_ROUTES) {
      const path = getLocalizedPath(locale, route);
      const parts = path.split("/").filter(Boolean);
      const segments = parts.slice(1);
      if (segments.length > 0) {
        params.push({ locale, slug: segments });
      }
    }

    for (const post of posts) {
      const postPath = getLocalizedPostPath(locale, post.slug);
      const parts = postPath.split("/").filter(Boolean);
      const segments = parts.slice(1);
      if (segments.length > 0) {
        params.push({ locale, slug: segments });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || !slug?.length) return {};

  const locale = localeParam as Locale;
  const route = getRouteFromSegments(locale, slug);
  if (!route) return {};

  const [settings, dictionary] = await Promise.all([getSettings(), getDictionary(locale)]);
  const socialImage = settings.bannerImage
    ? [{ url: settings.bannerImage, alt: settings.siteName }]
    : undefined;

  if (route === "post") {
    const postSlug = slug[1];
    const post = await getPublishedPostBySlug(postSlug);
    if (!post) {
      return {
        title: dictionary.meta.postNotFound,
      };
    }

    const localizedPostTitle = getLocalizedText(post.title, locale);
    const localizedPostExcerpt = getLocalizedText(post.excerpt, locale);
    const canonical = getAbsoluteUrl(getLocalizedPostPath(locale, post.slug));
    const vietnamese = getAbsoluteUrl(getLocalizedPostPath("vi", post.slug));
    const english = getAbsoluteUrl(getLocalizedPostPath("en", post.slug));
    const description = localizedPostExcerpt || dictionary.meta.postFallbackDescription;
    const postImage = post.thumbnail ? [{ url: post.thumbnail, alt: localizedPostTitle }] : socialImage;

    return {
      title: `${localizedPostTitle} | ${settings.siteName}`,
      description,
      alternates: {
        canonical,
        languages: { vi: vietnamese, en: english, "x-default": vietnamese },
      },
      openGraph: {
        title: localizedPostTitle,
        description,
        url: canonical,
        type: "article",
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        locale: LOCALE_METADATA[locale].openGraph,
        images: postImage,
      },
      twitter: {
        card: "summary_large_image",
        title: localizedPostTitle,
        description,
        images: postImage,
      },
    };
  }

  const metaKeys: Record<
    PublicRoute,
    { title: keyof typeof dictionary.meta; desc: keyof typeof dictionary.meta }
  > = {
    home: { title: "homeTitle", desc: "homeDescription" },
    services: { title: "servicesTitle", desc: "servicesDescription" },
    gallery: { title: "galleryTitle", desc: "galleryDescription" },
    about: { title: "aboutTitle", desc: "aboutDescription" },
    contact: { title: "contactTitle", desc: "contactDescription" },
    booking: { title: "bookingTitle", desc: "bookingDescription" },
    posts: { title: "postsTitle", desc: "postsDescription" },
  };

  const keyPair = metaKeys[route];
  const title = (dictionary.meta[keyPair.title] as string) || settings.siteName;
  const description = (dictionary.meta[keyPair.desc] as string) || settings.seoDescription;
  const canonical = getAbsoluteUrl(getLocalizedPath(locale, route));
  const vietnamese = getAbsoluteUrl(getLocalizedPath("vi", route));
  const english = getAbsoluteUrl(getLocalizedPath("en", route));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { vi: vietnamese, en: english, "x-default": vietnamese },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.siteName,
      locale: LOCALE_METADATA[locale].openGraph,
      images: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage,
    },
  };
}

export default async function LocaleCatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || !slug?.length) notFound();

  const locale = localeParam as Locale;
  const route = getRouteFromSegments(locale, slug);

  if (!route) {
    const otherLocale = locale === "vi" ? "en" : "vi";
    const crossRoute = getRouteFromSegments(otherLocale, slug);
    if (crossRoute) {
      if (crossRoute === "post" && slug[1]) {
        redirect(getLocalizedPostPath(locale, slug[1]));
      }
      redirect(getLocalizedPath(locale, crossRoute as PublicRoute));
    }
    notFound();
  }

  if (route === "services") {
    const [services, categories] = await Promise.all([getServices(), getCategories()]);
    return <ServicesPage services={services} categories={categories} />;
  }

  if (route === "gallery") {
    const gallery = await getGalleryItems();
    const visibleGallery = gallery.filter((item) => item.isActive);
    return <GalleryPage gallery={visibleGallery} />;
  }

  if (route === "about") {
    const [settings, team] = await Promise.all([getSettings(), getTeamMembers()]);
    return <AboutPage settings={settings} team={team} />;
  }

  if (route === "contact") {
    const settings = await getSettings();
    return <ContactPage settings={settings} />;
  }

  if (route === "booking") {
    const [services, settings, categories] = await Promise.all([
      getServices(),
      getSettings(),
      getCategories(),
    ]);
    return <BookingPage services={services} settings={settings} categories={categories} />;
  }

  if (route === "posts") {
    const posts = await getPublishedPosts();
    return <PostListPage posts={posts} />;
  }

  if (route === "post") {
    const postSlug = slug[1];
    const post = await getPublishedPostBySlug(postSlug);
    if (!post) notFound();

    const settings = await getSettings();
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              createBlogPostingJsonLd(
                post,
                settings,
                locale,
                getLocalizedPostPath(locale, post.slug)
              )
            ),
          }}
        />
        <PostDetailPage post={post} />
      </>
    );
  }

  notFound();
}
