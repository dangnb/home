"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import BrandLogo from "./BrandLogo";
import { useLocale } from "./LocaleProvider";
import defaultSettings from "../../data/settings.json";
import type { SiteSettings } from "@/types";
import { FiArrowUp } from "react-icons/fi";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings: propSettings }: FooterProps) {
  const settings = propSettings || (defaultSettings as SiteSettings);
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";

  const navItems = [
    { href: "#ban-sac", label: dictionary.nav.about },
    { href: "#hanh-trinh", label: dictionary.nav.journeys },
    { href: "#thu-vien-anh", label: dictionary.nav.gallery },
    { href: "#cach-di", label: dictionary.nav.way },
    { href: "#nhat-ky", label: dictionary.nav.journal },
    { href: "#lien-he", label: dictionary.nav.contact },
  ];

  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.footerGrid}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -20px 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.brandCol}>
          <BrandLogo size="lg" showTagline />
          <p className={styles.slogan}>
            {isEn ? settings.sloganEn : settings.slogan}
          </p>
          <p className={styles.hubs}>
            {isEn
              ? "Departures from Hanoi · Da Nang · Ho Chi Minh City"
              : "Khởi hành từ Hà Nội · Đà Nẵng · TP. Hồ Chí Minh"}
          </p>
        </div>

        <div className={styles.factsCol}>
          <h3 className={styles.colHeading}>
            {isEn ? "Studio & Inquiries" : "Văn phòng & Liên hệ"}
          </h3>
          <address className={styles.addressBlock}>
            <p className={styles.factText}>
              {isEn ? settings.addressEn : settings.address}
            </p>
            <p className={styles.factText}>
              <a
                href={`tel:${settings.hotline.replace(/\s/g, "")}`}
                className={styles.footerLink}
              >
                {settings.hotlineDisplay}
              </a>
              {" · "}
              <a href={`mailto:${settings.email}`} className={styles.footerLink}>
                {settings.email}
              </a>
            </p>
            <p className={styles.hoursText}>
              {isEn
                ? "Monday to Saturday · 08:30 to 18:00"
                : "Thứ Hai đến Thứ Bảy · 08:30 đến 18:00"}
            </p>
          </address>
        </div>

        <div className={styles.navCol}>
          <h3 className={styles.colHeading}>
            {isEn ? "Explore" : "Điều hướng"}
          </h3>
          <nav
            className={styles.footerNav}
            aria-label={isEn ? "Footer navigation" : "Điều hướng chân trang"}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={styles.footerLink}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.socialRow}>
            <a
              href={settings.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Facebook
            </a>
            <a
              href={settings.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Instagram
            </a>
            <a
              href={settings.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Zalo
            </a>
            <a href="/reels" className={styles.socialLink}>
              {isEn ? "Reels Video" : "Video Reels"}
            </a>
            <a href="/admin" className={styles.socialLink}>
              {isEn ? "Admin CMS" : "Quản trị"}
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.bottomBar}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.copyright}>{dictionary.footer.copyright}</span>

        <span className={styles.fieldStamp}>
          {isEn
            ? "Small groups of 6 to 10 guests · Year-round routes"
            : "Đoàn nhỏ 6 đến 10 khách · Khảo sát thực địa quanh năm"}
        </span>

        <a href="#top" className={styles.backTop}>
          <span>{dictionary.footer.backToTop}</span>
          <FiArrowUp size={15} aria-hidden="true" />
        </a>
      </motion.div>
    </footer>
  );
}
