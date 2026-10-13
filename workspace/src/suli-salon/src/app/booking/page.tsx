import BookingPage from "@/components/BookingPage";
import { getServices, getSettings, getCategories } from "@/lib/db";

export const metadata = {
  title: "Đặt lịch | Suli Salon",
  description: "Đặt lịch chăm sóc móng tại Suli Salon một cách nhanh chóng và thuận tiện.",
};

export default async function Booking() {
  const [services, settings, categories] = await Promise.all([
    getServices(),
    getSettings(),
    getCategories(),
  ]);
  
  return <BookingPage services={services} settings={settings} categories={categories} />;
}
