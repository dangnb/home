"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/bookings", label: "Đặt Lịch", icon: "🎟️" },
  { href: "/admin/cruises", label: "Du Thuyền", icon: "🚢" },
  { href: "/admin/posts", label: "Bài Viết", icon: "📝" },
  { href: "/admin/categories", label: "Danh Mục", icon: "🗂️" },
  { href: "/admin/pricing", label: "Bài Viết Giá", icon: "💰" },
  { href: "/admin/settings", label: "Cấu Hình", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://res.cloudinary.com/jawkxked/image/upload/v1783152884/duthuyensonghan/ml2q3lowtlmex9s1voav.png" alt="Logo" className={styles.logoImg} />
        <span className={styles.logoText}>Admin Panel</span>
      </div>

      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>Menu chính</span>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ""}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <a href="/" target="_blank" rel="noreferrer" className={styles.viewSite}>
          🌐 Xem Website
        </a>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
}
