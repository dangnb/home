import BookingPage from "@/components/BookingPage";
import { getServices, getSettings, getCategories } from "@/lib/db";

export const metadata = {
  title: "Book Appointment | Suli Salon – Luxury Nail Gallery in Prague",
  description: "Book your next nail, facial, eyelash, or brow appointment at Suli Salon Prague.",
};

export default async function Booking() {
  const [services, settings, categories] = await Promise.all([
    getServices(),
    getSettings(),
    getCategories(),
  ]);
  
  return <BookingPage services={services} settings={settings} categories={categories} />;
}
