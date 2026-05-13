"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // On homepage: transparent → scrolled dark
  // On other pages: always solid white with shadow
  const navClass = [
    styles.navbar,
    isHome
      ? isScrolled ? styles.scrolled : styles.transparent
      : styles.solid,
  ].join(" ");

  return (
    <nav className={navClass}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logopng-1.png" alt="Logo" style={{ height: '40px' }} />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''} ${!isHome ? styles.dark : ''}`}>Trang Chủ</Link>
          <Link href="/#khong-an-toi" className={`${styles.navLink} ${!isHome ? styles.dark : ''}`}>Du Thuyền Không Ăn Tối ▾</Link>
          <Link href="/#co-an-toi" className={`${styles.navLink} ${!isHome ? styles.dark : ''}`}>Du Thuyền Nhà Hàng ▾</Link>
          <Link href="/#thong-tin" className={`${styles.navLink} ${!isHome ? styles.dark : ''}`}>Thông Tin ▾</Link>
          <Link href="/phao-hoa" className={`${styles.navLink} ${pathname === '/phao-hoa' ? styles.active : ''} ${!isHome ? styles.dark : ''}`}>Pháo Hoa</Link>
        </div>
        <div className={styles.rightAction}>
          <a href="tel:0796768636" className={styles.bookButton}>0796.768.636</a>
        </div>
        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)} style={{ color: isHome ? 'white' : 'var(--text-dark)' }}>
          ☰
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className={styles.mobileMenu}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Trang chủ</Link>
          <Link href="/#khong-an-toi" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Du Thuyền Không Ăn Tối</Link>
          <Link href="/#co-an-toi" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Du Thuyền Có Ăn Tối</Link>
          <Link href="/#thong-tin" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Thông Tin</Link>
          <Link href="/phao-hoa" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>Pháo Hoa</Link>
          <Link href="tel:0796768636" className={styles.bookButton} onClick={() => setIsOpen(false)}>Đặt Vé Ngay</Link>
        </motion.div>
      )}
    </nav>
  );
}
