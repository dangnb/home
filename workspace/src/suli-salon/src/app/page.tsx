import HomePage from "@/components/HomePage";
import { getServices, getGalleryItems, getSettings, type ServiceData, type GalleryItemData, type SiteSettings } from "@/lib/db";

export const metadata = {
  title: "Suli Salon | Luxury Nail Gallery in Prague",
  description:
    "High-quality nail care, skilled technicians, and attention to detail. Experience the pinnacle of nail artistry in the heart of Prague.",
};

export default async function Home() {
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
