"use client";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/images/banner_desktop.webp"
          alt="Du Thuyền Sông Hàn"
          className={styles.heroImage}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className={styles.overlay}></div>
      </section>
      <div className={styles.textBar}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Du Thuyền Sông Hàn Đà Nẵng - Đặt Vé Giá Tốt, Trực tiếp đón khách
        </motion.h1>
      </div>
    </>
  );
}
