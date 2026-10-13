import GalleryPage from "@/components/GalleryPage";
import { getGalleryItems } from "@/lib/db";

export const metadata = {
  title: "Bộ sưu tập | Mộc Salon",
  description: "Khám phá bộ sưu tập các mẫu móng nghệ thuật tại Mộc Salon.",
};

export default async function Gallery() {
  const gallery = await getGalleryItems();
  const visibleGallery = gallery.filter((item) => item.isActive);
  return <GalleryPage gallery={visibleGallery} />;
}
