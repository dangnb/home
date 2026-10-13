"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";
import BrandLogo from "@/components/BrandLogo";
import {
  MdArticle,
  MdCalendarMonth,
  MdCategory,
  MdClose,
  MdDashboard,
  MdGroups,
  MdInfo,
  MdLanguage,
  MdLogout,
  MdMenu,
  MdPayments,
  MdPhotoLibrary,
  MdSettings,
  MdSpa,
} from "react-icons/md";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: MdDashboard },
  { href: "/admin/bookings", label: "Lịch hẹn", icon: MdCalendarMonth },
  { href: "/admin/services", label: "Dịch vụ", icon: MdSpa },
  { href: "/admin/gallery", label: "Bộ sưu tập", icon: MdPhotoLibrary },
  { href: "/admin/posts", label: "Bài viết", icon: MdArticle },
  { href: "/admin/categories", label: "Danh mục", icon: MdCategory },
  { href: "/admin/pricing", label: "Bảng giá", icon: MdPayments },
  { href: "/admin/team", label: "Đội ngũ", icon: MdGroups },
  { href: "/admin/about", label: "Trang giới thiệu", icon: MdInfo },
  { href: "/admin/settings", label: "Cài đặt", icon: MdSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin-login");
  }

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <div className={styles.mobileBar}>
        <Link href="/admin" className={styles.mobileBrand} onClick={() => setIsOpen(false)}>
          <BrandLogo compact />
          <span>Mộc Salon</span>
        </Link>
        <button
          type="button"
          className={styles.mobileMenuButton}
          aria-label={isOpen ? "Đóng menu quản trị" : "Mở menu quản trị"}
          aria-expanded={isOpen}
          aria-controls="admin-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <MdClose aria-hidden="true" /> : <MdMenu aria-hidden="true" />}
        </button>
      </div>

      {isOpen && <button type="button" className={styles.mobileBackdrop} aria-label="Đóng menu" onClick={() => setIsOpen(false)} />}

      <aside id="admin-navigation" className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`} aria-label="Điều hướng quản trị">
        <div className={styles.sidebarLogo}>
          <BrandLogo compact />
          <div>
            <div className={styles.logoText}>Mộc Salon</div>
            <div className={styles.logoSub}>Không gian quản trị</div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.navSection}>Quản lý salon</span>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.navActive : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={styles.navIcon} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" rel="noreferrer" className={styles.viewSite}>
            <MdLanguage size={16} aria-hidden="true" />
            Xem website
          </a>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <MdLogout size={16} aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
