"use client";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/images/banner_desktop.webp"
        alt="Du Thuyền Sông Hàn"
        className={styles.heroImage}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <div className={styles.overlay} />

      <div className={styles.textBar}>
        <motion.span
          className={styles.heroBadge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          ⭐ Hơn 1000 đánh giá 5 sao trên Google
        </motion.span>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Du Thuyền Sông Hàn Đà Nẵng
          <br />Đặt Vé Giá Tốt – Trực Tiếp Đón Khách
        </motion.h1>

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <a href="tel:0796768636" className={styles.heroCta}>
            📞 Đặt Vé Ngay: 0796.768.636
          </a>
          <a href="#khong-an-toi" className={styles.heroCtaSecondary}>
            Xem Du Thuyền ↓
          </a>
        </motion.div>

        <motion.div
          className={styles.heroStats}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          {[
            { value: "10+", label: "Du Thuyền" },
            { value: "1000+", label: "Đánh Giá 5★" },
            { value: "24/7", label: "Hỗ Trợ" },
            { value: "0đ", label: "Phí Giữ Chỗ" },
          ].map((s) => (
            <div key={s.label} className={styles.heroStat}>
              <span className={styles.heroStatValue}>{s.value}</span>
              <span className={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
