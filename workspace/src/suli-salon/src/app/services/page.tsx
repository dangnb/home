import ServicesPage from "@/components/ServicesPage";
import { getServices, getCategories } from "@/lib/db";

export const metadata = {
  title: "Services | Suli Salon",
  description: "Explore our full menu of professional services.",
};

export default async function Services() {
  const services = await getServices();
  const categories = await getCategories();
  return <ServicesPage services={services} categories={categories} />;
}
