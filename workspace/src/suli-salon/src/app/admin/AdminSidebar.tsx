"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/bookings", label: "Appointments", icon: "calendar_month" },
  { href: "/admin/cruises", label: "Services", icon: "spa" },
  { href: "/admin/gallery", label: "Gallery", icon: "photo_library" },
  { href: "/admin/posts", label: "Blog", icon: "article" },
  { href: "/admin/categories", label: "Categories", icon: "category" },
  { href: "/admin/pricing", label: "Price List", icon: "payments" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
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
        <div className={styles.logoMark}>S</div>
        <div>
          <div className={styles.logoText}>Suli Salon</div>
          <div className={styles.logoSub}>Admin Panel</div>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>Management</span>
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
          View Website
        </a>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
