"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://duthuyensonghan.vn/wp-content/uploads/2025/03/logopng-1.png" alt="Logo" style={{ height: '40px' }} />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${styles.active}`}>Trang Chủ</Link>
          <Link href="#khong-an-toi" className={styles.navLink}>Du Thuyền Không Ăn Tối ▾</Link>
          <Link href="#co-an-toi" className={styles.navLink}>Du Thuyền Nhà Hàng ▾</Link>
          <Link href="#thong-tin" className={styles.navLink}>Thông Tin ▾</Link>
          <Link href="#phao-hoa" className={styles.navLink}>Pháo Hoa</Link>
        </div>
        <div className={styles.rightAction}>
          <a href="tel:0796768636" className={styles.bookButton}>0796.768.636</a>
        </div>
        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
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
          <Link href="/" className={styles.navLink} onClick={() => setIsOpen(false)}>Trang chủ</Link>
          <Link href="#khong-an-toi" className={styles.navLink} onClick={() => setIsOpen(false)}>Du Thuyền Không Ăn Tối</Link>
          <Link href="#co-an-toi" className={styles.navLink} onClick={() => setIsOpen(false)}>Du Thuyền Có Ăn Tối</Link>
          <Link href="#thong-tin" className={styles.navLink} onClick={() => setIsOpen(false)}>Thông Tin</Link>
          <Link href="tel:0796768636" className={styles.bookButton} onClick={() => setIsOpen(false)}>Đặt Vé Ngay</Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
