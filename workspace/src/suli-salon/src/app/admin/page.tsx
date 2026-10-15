import { getServices, getCategories, getAppointments, getGalleryItems, getCustomers } from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const [services, cats, appointments, gallery, customers] = await Promise.all([
    getServices(),
    getCategories(),
    getAppointments(),
    getGalleryItems(),
    getCustomers(),
  ]);

  return (
    <AdminDashboardClient
      services={services}
      cats={cats}
      appointments={appointments}
      gallery={gallery}
      customers={customers}
    />
  );
}
