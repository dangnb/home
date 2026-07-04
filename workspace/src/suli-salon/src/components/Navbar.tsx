"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FiUser } from "react-icons/fi"; // for profile icon

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navClass = [
    styles.navbar,
    isScrolled ? styles.scrolled : styles.transparent,
  ].join(" ");

  const linkClass = `${styles.navLink} ${styles.dark}`;

  return (
    <nav className={navClass}>
      <div className={`container ${styles.navContainer}`}>
        
        {/* Logo Placeholder (Left) */}
        <div className={styles.logoArea}>
          {/* <Link href="/" className={styles.logo}>SULI</Link> */}
        </div>

        {/* Center Links */}
        <div className={styles.navLinks}>
          <Link href="/" className={`${linkClass} ${pathname === "/" ? styles.active : ""}`}>HOME</Link>
          <Link href="/gallery" className={`${linkClass} ${pathname === "/gallery" ? styles.active : ""}`}>GALLERY</Link>
          <Link href="/services" className={`${linkClass} ${pathname === "/services" ? styles.active : ""}`}>SERVICES</Link>
          <Link href="/about" className={`${linkClass} ${pathname === "/about" ? styles.active : ""}`}>ABOUT US</Link>
          <Link href="/contact" className={`${linkClass} ${pathname === "/contact" ? styles.active : ""}`}>CONTACT US</Link>
        </div>

        {/* Right Actions */}
        <div className={styles.rightAction}>
          <div className={styles.languageSelect}>
            <span>🇨🇿</span>
            <span>🇬🇧</span>
          </div>
          <Link href="/account" className={styles.profileIcon}>
            <FiUser size={20} />
          </Link>
          <Link href="/booking" className={styles.bookButton}>
            BOOK APPOINTMENT
          </Link>
        </div>

        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
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
            <Link href="/" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>HOME</Link>
            <Link href="/gallery" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>GALLERY</Link>
            <Link href="/services" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>SERVICES</Link>
            <Link href="/about" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>ABOUT US</Link>
            <Link href="/contact" className={`${styles.navLink} ${styles.dark}`} onClick={() => setIsOpen(false)}>CONTACT US</Link>
            <Link href="/booking" className={styles.bookButton} onClick={() => setIsOpen(false)}>BOOK APPOINTMENT</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
