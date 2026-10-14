"use client";
import { useState } from "react";
import styles from "./FloatingButtons.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhoneAlt, FaFacebookMessenger } from "react-icons/fa";
import { MdChat, MdClose } from "react-icons/md";

interface Props {
  hotline?: string;
  zalo?: string;
  messenger?: string;
}

export default function FloatingButtons({
  hotline = "0988 123 456",
  zalo = "https://zalo.me/0988123456",
  messenger = "https://m.me/mocsalon.vietnam",
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const cleanPhone = hotline.replace(/\s+/g, "");

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.buttonStack}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* 1. Hotline with soft luxury gold pulse */}
            <a
              href={`tel:${cleanPhone}`}
              className={`${styles.button} ${styles.phone}`}
              aria-label="Gọi điện thoại trực tiếp cho Mộc Salon"
            >
              <div className={styles.pulseRing} />
              <FaPhoneAlt size={18} className={styles.icon} />
              <span className={styles.tooltip}>
                <strong>Hotline tư vấn</strong>
                <span className={styles.subtext}>{hotline}</span>
              </span>
            </a>

            {/* 2. Zalo Chat */}
            {zalo && (
              <a
                href={zalo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.button} ${styles.zalo}`}
                aria-label="Chat qua Zalo với Mộc Salon"
              >
                <span className={styles.zaloText}>Zalo</span>
                <span className={styles.tooltip}>
                  <strong>Chat qua Zalo</strong>
                  <span className={styles.subtext}>Tư vấn mẫu móng nhanh</span>
                </span>
              </a>
            )}

            {/* 3. Facebook Messenger */}
            {messenger && (
              <a
                href={messenger}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.button} ${styles.messenger}`}
                aria-label="Nhắn tin qua Messenger Facebook"
              >
                <FaFacebookMessenger size={20} className={styles.icon} />
                <span className={styles.tooltip}>
                  <strong>Facebook Messenger</strong>
                  <span className={styles.subtext}>Hỗ trợ & đặt lịch hẹn</span>
                </span>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Floating Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.toggleBtn}
        aria-label={isOpen ? "Thu gọn thanh liên hệ" : "Mở thanh liên hệ tư vấn"}
        title={isOpen ? "Thu gọn" : "Liên hệ tư vấn"}
      >
        {isOpen ? (
          <MdClose size={20} className={styles.toggleIcon} />
        ) : (
          <div className={styles.closedPill}>
            <MdChat size={18} />
            <span className={styles.closedLabel}>Hỗ trợ</span>
          </div>
        )}
      </button>
    </div>
  );
}
