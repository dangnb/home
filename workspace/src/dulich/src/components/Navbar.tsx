"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import styles from "./Navbar.module.css";
import BrandLogo from "./BrandLogo";
import { useLocale } from "./LocaleProvider";
import { SUPPORTED_LOCALES, LOCALE_METADATA } from "@/lib/i18n/config";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export default function Navbar() {
  const { locale, dictionary, setLocale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: dictionary.nav.about, href: "#ban-sac" },
    { label: dictionary.nav.journeys, href: "#hanh-trinh" },
    { label: locale === "en" ? "Seasons" : "Mùa đi", href: "#la-ban-mua" },
    { label: dictionary.nav.gallery, href: "#thu-vien-anh" },
    { label: dictionary.nav.way, href: "#cach-di" },
    { label: dictionary.nav.journal, href: "#nhat-ky" },
    { label: dictionary.nav.contact, href: "#lien-he" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <motion.div
          className={styles.progressBar}
          style={{ scaleX }}
          aria-hidden="true"
        />

        <BrandLogo size="md" showTagline />

        <nav className={styles.navLinks} aria-label="Main Navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.rightActions}>
          <div
            className={styles.langSwitch}
            role="group"
            aria-label="Ngôn ngữ / Language"
          >
            {SUPPORTED_LOCALES.map((supportedLocale) => {
              const active = supportedLocale === locale;
              return (
                <button
                  key={supportedLocale}
                  type="button"
                  className={styles.langBtn}
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => setLocale(supportedLocale)}
                  title={LOCALE_METADATA[supportedLocale].label}
                >
                  <span>{LOCALE_METADATA[supportedLocale].flag}</span>
                </button>
              );
            })}
          </div>

          <a href="#lien-he" className={styles.headerCta}>
            <span>{dictionary.nav.planTrip}</span>
            <FiArrowUpRight size={16} aria-hidden="true" />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuToggle}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={styles.mobileOverlay}
            onClick={closeMobileMenu}
            role="presentation"
          >
            <motion.aside
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
              className={styles.mobileDrawer}
              onClick={(event) => event.stopPropagation()}
              aria-label="Mobile navigation"
            >
              <div className={styles.mobileDrawerHead}>
                <BrandLogo
                  size="sm"
                  showTagline={false}
                  href="#top"
                  onClick={closeMobileMenu}
                />
                <button
                  type="button"
                  className={styles.mobileClose}
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className={styles.mobileDrawerNav}>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={closeMobileMenu}
                  >
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>

              <a
                href="#lien-he"
                className={styles.mobileCta}
                onClick={closeMobileMenu}
              >
                <span>{dictionary.nav.planTrip}</span>
                <FiArrowUpRight size={16} aria-hidden="true" />
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
