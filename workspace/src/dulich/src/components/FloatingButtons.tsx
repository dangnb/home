"use client";

import React, { useState } from "react";
import styles from "./FloatingButtons.module.css";
import { useLocale } from "./LocaleProvider";
import { FaPhoneAlt, FaFacebookMessenger } from "react-icons/fa";

interface FloatingButtonsProps {
  hotline?: string;
  zalo?: string;
  messenger?: string;
}

export default function FloatingButtons({
  hotline = "0988 123 456",
  zalo = "https://zalo.me/0988123456",
  messenger = "https://m.me/nepjourneys.vn",
}: FloatingButtonsProps) {
  const { dictionary } = useLocale();
  const [isOpen] = useState(true);
  const cleanPhone = hotline.replace(/\s+/g, "");

  if (!isOpen) return null;

  return (
    <aside className={styles.container} aria-label="Kênh liên hệ trực tiếp">
      <div className={styles.buttonStack}>
        {/* 1. Hotline with soft luxury gold pulse */}
        <a
          href={`tel:${cleanPhone}`}
          className={`${styles.button} ${styles.phone}`}
          aria-label={dictionary.floating.hotline}
        >
          <div className={styles.pulseRing} />
          <div className={styles.pulseRingDelayed} />
          <FaPhoneAlt size={18} className={styles.icon} />
          <span className={styles.tooltip} role="tooltip">
            <strong>{dictionary.floating.hotline}</strong>
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
            aria-label={dictionary.floating.zalo}
          >
            <span className={styles.zaloText}>Zalo</span>
            <span className={styles.tooltip} role="tooltip">
              <strong>{dictionary.floating.zalo}</strong>
              <span className={styles.subtext}>Tư vấn hành trình tức thì</span>
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
            aria-label={dictionary.floating.messenger}
          >
            <FaFacebookMessenger size={20} className={styles.icon} />
            <span className={styles.tooltip} role="tooltip">
              <strong>{dictionary.floating.messenger}</strong>
              <span className={styles.subtext}>Facebook Messenger</span>
            </span>
          </a>
        )}
      </div>
    </aside>
  );
}
