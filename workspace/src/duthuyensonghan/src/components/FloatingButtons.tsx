"use client";
import styles from "./FloatingButtons.module.css";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaFacebookMessenger, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

interface Props {
  hotline?: string;
  zalo?: string;
  messenger?: string;
}

export default function FloatingButtons({
  hotline = "0796768636",
  zalo = "https://zalo.me/0796768636",
  messenger = "https://m.me/2datickets",
}: Props) {
  const waNumber = `84${hotline.replace(/^0/, "")}`;

  return (
    <motion.div
      className={styles.container}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
    >
      <a href={`tel:${hotline}`} className={`${styles.button} ${styles.phone}`} aria-label="Gọi điện thoại">
        <FaPhoneAlt size={22} />
        <span className={styles.tooltip}>Gọi ngay</span>
      </a>
      <a href={zalo} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.zalo}`} aria-label="Zalo">
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>Zalo</span>
        <span className={styles.tooltip}>Zalo</span>
      </a>
      <a href={messenger} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.messenger}`} aria-label="Messenger">
        <FaFacebookMessenger size={26} />
        <span className={styles.tooltip}>Messenger</span>
      </a>
      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.whatsapp}`} aria-label="WhatsApp">
        <FaWhatsapp size={26} />
        <span className={styles.tooltip}>WhatsApp</span>
      </a>
      <a href="https://t.me/+84987654321" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.telegram}`} aria-label="Telegram">
        <FaTelegramPlane size={26} />
        <span className={styles.tooltip}>Telegram</span>
      </a>
    </motion.div>
  );
}
