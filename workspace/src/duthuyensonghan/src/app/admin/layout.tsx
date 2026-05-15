import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Admin – Du Thuyền Sông Hàn" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminBody}>
      <AdminSidebar />
      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
