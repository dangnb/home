"use client";
import styles from "./FloatingButtons.module.css";
import { motion } from "framer-motion";

export default function FloatingButtons() {
  return (
    <motion.div 
      className={styles.container}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
    >
      <a href="tel:0796768636" className={`${styles.button} ${styles.phone}`} aria-label="Gọi điện thoại">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <span className={styles.tooltip}>Gọi ngay</span>
      </a>
      <a href="https://zalo.me/0796768636" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.zalo}`} aria-label="Zalo">
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Z</span>
        <span className={styles.tooltip}>Zalo</span>
      </a>
      <a href="https://m.me/2datickets" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.messenger}`} aria-label="Messenger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.13 2 11.23c0 2.92 1.5 5.51 3.82 7.2v3.35c0 .34.36.56.66.4l3.52-1.92c.64.18 1.32.28 2 .28 5.52 0 10-4.13 10-9.23S17.52 2 12 2zm1.09 12.5l-2.45-2.61-4.78 2.61 5.25-5.54 2.5 2.61 4.73-2.61-5.25 5.54z"/>
        </svg>
        <span className={styles.tooltip}>Messenger</span>
      </a>
      <a href="https://wa.me/84796768636" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.whatsapp}`} aria-label="WhatsApp">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/whatsapp.png" alt="WhatsApp" style={{width: 30, height: 30}} />
        <span className={styles.tooltip}>WhatsApp</span>
      </a>
      <a href="https://t.me/+84987654321" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.telegram}`} aria-label="Telegram">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/telegram.png" alt="Telegram" style={{width: 30, height: 30}} />
        <span className={styles.tooltip}>Telegram</span>
      </a>
    </motion.div>
  );
}
