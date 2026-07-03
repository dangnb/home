"use client";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaPhoneAlt, FaStar, FaArrowDown } from "react-icons/fa";

interface HeroProps {
  image?: string;
  badge?: React.ReactNode;
  title?: string;
  subtitle?: string;
  cta1Text?: React.ReactNode;
  cta1Link?: string;
  cta2Text?: React.ReactNode;
  cta2Link?: string;
  stats?: { value: string; label: string }[];
  hotline?: string;
}

export default function Hero({
  image = "/images/banner_desktop.webp",
  badge = <><FaStar style={{ color: "#fbbf24" }} /> Hơn 1000 đánh giá 5 sao trên Google</>,
  title = "Du Thuyền Sông Hàn Đà Nẵng\nĐặt Vé Giá Tốt – Trực Tiếp Đón Khách",
  subtitle,
  cta1Text = <><FaPhoneAlt /> Đặt Vé Ngay</>,
  cta1Link = "tel:0796768636",
  cta2Text = <>Xem Du Thuyền <FaArrowDown /></>,
  cta2Link = "#khong-an-toi",
  stats = [
    { value: "10+", label: "Du Thuyền" },
    { value: "1000+", label: "Đánh Giá 5★" },
    { value: "24/7", label: "Hỗ Trợ" },
    { value: "0đ", label: "Phí Giữ Chỗ" },
  ],
  hotline,
}: HeroProps) {
  // If cta1Link is tel: and hotline is provided, use hotline
  const resolvedCta1Link = (cta1Link.startsWith("tel:") && hotline)
    ? `tel:${hotline}`
    : cta1Link;

  const resolvedCta1Text = (typeof cta1Text === "string" && cta1Link.startsWith("tel:") && hotline)
    ? <><FaPhoneAlt /> Đặt Vé Ngay: {hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3")}</>
    : cta1Text;

  // Split title by \n for line breaks
  const titleLines = title.split("\\n");

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.heroImage}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      >
        <Image
          src={image}
          alt="Banner Du Thuyền Sông Hàn"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          quality={85}
        />
      </motion.div>
      <div className={styles.overlay} />

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className={styles.textBar}>
        {badge && (
          <motion.span
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {badge}
          </motion.span>
        )}

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </motion.h1>

        {subtitle && (
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {cta1Text && (
            <a href={resolvedCta1Link} className={styles.heroCta}>
              {resolvedCta1Text}
            </a>
          )}
          {cta2Text && (
            <a href={cta2Link} className={styles.heroCtaSecondary}>
              {cta2Text}
            </a>
          )}
        </motion.div>

        {stats && stats.length > 0 && (
          <motion.div
            className={styles.heroStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            {stats.map((s, i) => (
              <div key={i} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section >
  );
}
