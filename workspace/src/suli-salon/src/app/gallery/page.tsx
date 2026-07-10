import GalleryPage from "@/components/GalleryPage";
import { getGalleryItems } from "@/lib/db";

export const metadata = {
  title: "Gallery | Suli Salon",
  description: "Browse our curated gallery of luxury nail art.",
};

export default async function Gallery() {
  const gallery = await getGalleryItems();
  const visibleGallery = gallery.filter((item) => item.isActive);
  return <GalleryPage gallery={visibleGallery} />;
}
