"use client";

import React from "react";
import styles from "./BrandLogo.module.css";
import { useLocale } from "./LocaleProvider";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function BrandLogo({
  size = "md",
  showTagline = true,
  href = "#top",
  onClick,
}: BrandLogoProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const content = (
    <>
      <span className={styles.emblem} aria-hidden="true">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.emblemSvg}
        >
          <rect width="64" height="64" rx="14" fill="#182019" />
          <rect
            x="4.5"
            y="4.5"
            width="55"
            height="55"
            rx="10.5"
            stroke="#D7D2CA"
            strokeOpacity="0.32"
            strokeWidth="1.2"
          />
          {/* Mặt trời ban mai */}
          <circle cx="43" cy="19" r="5.5" fill="#C8A97E" fillOpacity="0.92" />
          {/* Dãy núi đá vôi */}
          <path
            d="M10 46L21.5 29.5L30.5 39.5L40.5 26.5L54 46H10Z"
            fill="#2E4231"
          />
          {/* Chữ N cách điệu */}
          <path
            d="M19 46V21.5C19 20.4 20.3 19.8 21.1 20.6L42.9 42.4C43.7 43.2 45 42.6 45 41.5V18"
            stroke="#EEECEA"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dấu mũ chữ Ê / mái đình cổ */}
          <path
            d="M27.5 16.5L32 12.2L36.5 16.5"
            stroke="#C8A97E"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sóng nước êm đềm */}
          <path
            d="M15 51.5C20.5 49.3 26.5 49.3 32 51.5C37.5 53.7 43.5 53.7 49 51.5"
            stroke="#C8A97E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className={styles.wordmark}>
        <span className={styles.titleRow}>
          <strong className={styles.titlePrimary}>Nếp</strong>
          <em className={styles.titleAccent}>Journeys</em>
        </span>
        {showTagline && (
          <span className={styles.tagline}>
            {isEn ? "Vietnam Slow Heritage" : "Nếp sống & Di sản Việt"}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${styles.logoRoot} ${styles[size]}`}
        aria-label="Nếp Journeys"
      >
        {content}
      </a>
    );
  }

  return (
    <span className={`${styles.logoRoot} ${styles[size]}`}>{content}</span>
  );
}
