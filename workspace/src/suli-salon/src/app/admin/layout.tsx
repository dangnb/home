import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Quản trị | Mộc Salon",
  robots: {
    index: false,
    follow: false,
  },
};
export const dynamic = "force-dynamic"; // Tắt cache ở Admin, luôn render ngay lập tức

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();
  if (auth.response) {
    redirect("/admin-login");
  }
  return (
    <div className={styles.adminBody}>
      <AdminSidebar />
      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
