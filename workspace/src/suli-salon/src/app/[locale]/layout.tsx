import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import Preloader from "@/components/Preloader";
import PublicShell from "@/components/PublicShell";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getSettings } from "@/lib/db";
import { LOCALE_METADATA, SUPPORTED_LOCALES, type Locale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocalizedPath } from "@/lib/i18n/routes";
import { createBeautySalonJsonLd, getAbsoluteUrl, serializeJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const [settings, dictionary] = await Promise.all([getSettings(), getDictionary(locale)]);
  const path = getLocalizedPath(locale, "home");
  const canonical = getAbsoluteUrl(path);
  const english = getAbsoluteUrl(getLocalizedPath("en", "home"));
  const vietnamese = getAbsoluteUrl(getLocalizedPath("vi", "home"));
  const socialImage = settings.bannerImage ? [{ url: settings.bannerImage, alt: settings.siteName }] : undefined;

  return {
    metadataBase: new URL(getAbsoluteUrl("/")),
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.homeDescription,
    keywords: settings.seoKeywords,
    alternates: {
      canonical,
      languages: { vi: vietnamese, en: english, "x-default": vietnamese },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title: dictionary.meta.homeTitle, description: dictionary.meta.homeDescription, url: canonical, siteName: settings.siteName, locale: LOCALE_METADATA[locale].openGraph, type: "website", images: socialImage },
    twitter: { card: "summary_large_image", title: dictionary.meta.homeTitle, description: dictionary.meta.homeDescription, images: socialImage },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const [settings, dictionary] = await Promise.all([getSettings(), getDictionary(locale)]);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createBeautySalonJsonLd(settings, locale)) }} />
      <NextTopLoader color="var(--primary)" height={3} showSpinner={false} />
      <Preloader>
        <PublicShell settings={settings}>{children}</PublicShell>
      </Preloader>
    </LocaleProvider>
  );
}
