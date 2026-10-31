"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUp, FiPhoneCall } from "react-icons/fi";
import styles from "./FloatingButtons.module.css";
import { useLocale } from "./LocaleProvider";

export interface FloatingButtonsProps {
  hotline?: string;
  zalo?: string;
  messenger?: string;
  facebook?: string;
}

export default function FloatingButtons({
  hotline = "0988 123 456",
  zalo = "https://zalo.me/0988123456",
  messenger = "https://facebook.com/nepjourneys",
  facebook = "https://facebook.com/nepjourneys",
}: FloatingButtonsProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setScrollPct(pct);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cleanPhone = hotline.replace(/\s+/g, "");
  const fbHref = facebook || messenger;

  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - scrollPct);

  return (
    <aside
      className={styles.dock}
      aria-label={
        isEn ? "Quick contact & navigation" : "Liên hệ nhanh & điều hướng"
      }
    >
      <motion.div
        className={styles.rail}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Nút Lên đầu trang kèm vòng tròn tiến độ cuộn */}
        <button
          type="button"
          onClick={scrollToTop}
          className={`${styles.item} ${styles.topItem}`}
          aria-label={isEn ? "Back to top" : "Lên đầu trang"}
        >
          <span className={styles.labelCard}>
            <span className={styles.labelTitle}>
              {isEn ? "Back to top" : "Lên đầu trang"}
            </span>
            <span className={styles.labelSub}>
              {Math.round(scrollPct * 100)}%
            </span>
          </span>

          <span className={styles.circleBtn}>
            <svg
              className={styles.progressSvg}
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                className={styles.progressTrack}
                cx="24"
                cy="24"
                r={radius}
              />
              <circle
                className={styles.progressBar}
                cx="24"
                cy="24"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <FiArrowUp size={20} strokeWidth={2.4} aria-hidden="true" />
          </span>
        </button>

        <span className={styles.divider} aria-hidden="true" />

        {/* Nút Facebook */}
        <a
          href={fbHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.item} ${styles.fbItem}`}
          aria-label="Facebook Nếp Journeys"
        >
          <span className={styles.labelCard}>
            <span className={styles.labelTitle}>Facebook</span>
            <span className={styles.labelSub}>Nếp Journeys</span>
          </span>

          <span className={styles.circleBtn}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.5 21v-7.5h2.55l.38-2.95H13.5V8.67c0-.85.24-1.43 1.46-1.43h1.56V4.6c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.91v2.16H8v2.95h2.44V21h3.06Z" />
            </svg>
          </span>
        </a>

        {/* Nút Zalo */}
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.item} ${styles.zaloItem}`}
          aria-label={isEn ? "Chat on Zalo" : "Nhắn tin Zalo"}
        >
          <span className={styles.labelCard}>
            <span className={styles.labelTitle}>
              {isEn ? "Chat on Zalo" : "Nhắn tin Zalo"}
            </span>
            <span className={styles.labelSub}>
              {isEn ? "Instant itinerary advice" : "Tư vấn lịch trình 1:1"}
            </span>
          </span>

          <span className={styles.circleBtn}>
            <span className={styles.zaloText}>Zalo</span>
          </span>
        </a>

        {/* Nút Gọi điện thoại Hotline */}
        <a
          href={`tel:${cleanPhone}`}
          className={`${styles.item} ${styles.phoneItem}`}
          aria-label={
            isEn ? `Call hotline ${hotline}` : `Gọi số điện thoại ${hotline}`
          }
        >
          <span className={styles.labelCard}>
            <span className={styles.labelTitle}>
              {isEn ? "Direct Hotline" : "Gọi điều phối viên"}
            </span>
            <span className={styles.labelSub}>{hotline}</span>
          </span>

          <span className={styles.circleBtn}>
            <span className={styles.pulseRing} aria-hidden="true" />
            <FiPhoneCall size={19} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </a>
      </motion.div>
    </aside>
  );
}
