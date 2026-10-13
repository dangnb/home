import ServicesPage from "@/components/ServicesPage";
import { getServices, getCategories } from "@/lib/db";

export const metadata = {
  title: "Dịch vụ | Mộc Salon",
  description: "Khám phá các dịch vụ chăm sóc móng chuyên nghiệp tại Mộc Salon.",
};

export default async function Services() {
  const services = await getServices();
  const categories = await getCategories();
  return <ServicesPage services={services} categories={categories} />;
}
