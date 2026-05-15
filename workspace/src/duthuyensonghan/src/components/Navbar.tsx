"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavCruise { label: string; href: string; }

const thongTinLinks = [
  { label: "Giá Vé Du Thuyền Sông Hàn", href: "/gia-ve" },
];

interface NavbarProps {
  hotline?: string;
  regularCruises?: NavCruise[];
  dinnerCruises?: NavCruise[];
}

export default function Navbar({
  hotline,
  regularCruises = [],
  dinnerCruises = [],
}: NavbarProps) {
  const phone = hotline ?? "0796768636";
  const phoneDisplay = phone.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navClass = [
    styles.navbar,
    isHome ? (isScrolled ? styles.scrolled : styles.transparent) : styles.solid,
  ].join(" ");

  const linkIsDark = !isHome || isScrolled;
  const linkClass = `${styles.navLink} ${linkIsDark ? styles.dark : ""}`;

  return (
    <nav className={navClass} onMouseLeave={() => setActiveDropdown(null)}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logopng-1.png" alt="Logo" style={{ height: "40px" }} />
        </Link>

        <div className={styles.navLinks}>
          {/* Trang Chủ */}
          <Link href="/" className={`${linkClass} ${pathname === "/" ? styles.active : ""}`}>
            Trang Chủ
          </Link>

          {/* Du Thuyền Không Ăn Tối */}
          <div
            className={styles.dropdownWrapper}
            onMouseEnter={() => setActiveDropdown("regular")}
          >
            <Link href="/#khong-an-toi" className={`${linkClass} ${styles.hasChevron}`}>
              Du Thuyền Không Ăn Tối
              <span className={styles.chevron}>▾</span>
            </Link>
            <AnimatePresence>
              {activeDropdown === "regular" && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  {regularCruises.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Du Thuyền Nhà Hàng */}
          <div
            className={styles.dropdownWrapper}
            onMouseEnter={() => setActiveDropdown("dinner")}
          >
            <Link href="/#co-an-toi" className={`${linkClass} ${styles.hasChevron}`}>
              Du Thuyền Nhà Hàng
              <span className={styles.chevron}>▾</span>
            </Link>
            <AnimatePresence>
              {activeDropdown === "dinner" && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  {dinnerCruises.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thông Tin */}
          <div
            className={styles.dropdownWrapper}
            onMouseEnter={() => setActiveDropdown("info")}
          >
            <Link href="/#thong-tin" className={`${linkClass} ${styles.hasChevron}`}>
              Thông Tin
              <span className={styles.chevron}>▾</span>
            </Link>
            <AnimatePresence>
              {activeDropdown === "info" && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  {thongTinLinks.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pháo Hoa */}
          <Link
            href="/phao-hoa"
            className={`${linkClass} ${pathname === "/phao-hoa" ? styles.active : ""}`}
          >
            Pháo Hoa
          </Link>

          {/* Bài Viết */}
          <Link
            href="/bai-viet"
            className={`${linkClass} ${pathname.startsWith("/bai-viet") ? styles.active : ""}`}
          >
            Bài Viết
          </Link>

          {/* Đặt Lịch */}
          <Link
            href="/dat-lich"
            className={`${linkClass} ${pathname === "/dat-lich" ? styles.active : ""}`}
          >
            Đặt Lịch
          </Link>
        </div>

        <div className={styles.rightAction}>
          <a href={`tel:${phone}`} className={styles.bookButton}>
            {phoneDisplay}
          </a>
        </div>

        <div
          className={styles.menuIcon}
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: linkIsDark ? "var(--text-dark)" : "white" }}
        >
          {isOpen ? "✕" : "☰"}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Trang chủ</Link>
            <div className={styles.mobileGroup}>
              <span className={styles.mobileGroupTitle}>Du Thuyền Không Ăn Tối</span>
              {regularCruises.map(item => (
                <Link key={item.href} href={item.href} className={styles.mobileSubLink} onClick={() => setIsOpen(false)}>{item.label}</Link>
              ))}
            </div>
            <div className={styles.mobileGroup}>
              <span className={styles.mobileGroupTitle}>Du Thuyền Nhà Hàng</span>
              {dinnerCruises.map(item => (
                <Link key={item.href} href={item.href} className={styles.mobileSubLink} onClick={() => setIsOpen(false)}>{item.label}</Link>
              ))}
            </div>
            <Link href="/phao-hoa" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Pháo Hoa</Link>
            <Link href="/bai-viet" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Bài Viết</Link>
            <Link href="/dat-lich" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Đặt Lịch</Link>
            <a href={`tel:${phone}`} className={styles.bookButton} onClick={() => setIsOpen(false)}>Đặt Vé Ngay</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
