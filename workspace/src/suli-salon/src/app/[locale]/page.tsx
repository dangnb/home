import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { getServices, getGalleryItems, getSettings } from "@/lib/db";
import { isLocale } from "@/lib/i18n/config";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const [services, gallery, settings] = await Promise.all([
    getServices(),
    getGalleryItems(),
    getSettings(),
  ]);

  return (
    <HomePage
      services={services}
      gallery={gallery}
      settings={settings}
    />
  );
}
