import HomePage from "@/components/HomePage";
import { getServices, getGalleryItems, getSettings } from "@/lib/db";

export const metadata = {
  title: "Mộc Salon | Nghệ thuật móng tinh tế",
  description:
    "Chăm sóc móng cao cấp với đội ngũ tận tâm và kỹ thuật tỉ mỉ. Khám phá vẻ đẹp mang dấu ấn riêng của bạn tại Mộc Salon.",
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
