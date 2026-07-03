import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Admin – Du Thuyền Sông Hàn" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin-login");
  }
  return (
    <div className={styles.adminBody}>
      <AdminSidebar />
      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
