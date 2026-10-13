"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: "dashboard" },
  { href: "/admin/bookings", label: "Lịch hẹn", icon: "calendar_month" },
  { href: "/admin/services", label: "Dịch vụ", icon: "spa" },
  { href: "/admin/gallery", label: "Bộ sưu tập", icon: "photo_library" },
  { href: "/admin/posts", label: "Bài viết", icon: "article" },
  { href: "/admin/categories", label: "Danh mục", icon: "category" },
  { href: "/admin/pricing", label: "Bảng giá", icon: "payments" },
  { href: "/admin/team", label: "Đội ngũ", icon: "groups" },
  { href: "/admin/about", label: "Trang giới thiệu", icon: "info" },
  { href: "/admin/settings", label: "Cài đặt", icon: "settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin-login");
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <BrandLogo compact />
        <div>
          <div className={styles.logoText}>Suli Salon</div>
          <div className={styles.logoSub}>Quản trị</div>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>Quản lý</span>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.navActive : ""}`}
          >
            <span className={`material-symbols-outlined ${styles.navIcon}`}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <a href="/" target="_blank" rel="noreferrer" className={styles.viewSite}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>language</span>
          Xem website
        </a>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
