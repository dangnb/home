"use client";

import React from "react";
import styles from "./TourCard.module.css";
import type { Tour } from "@/types";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight, FiCompass, FiUsers } from "react-icons/fi";

interface TourCardProps {
  tour: Tour;
  onOpenBooking: (tour: Tour) => void;
  onViewDetails: (tour: Tour) => void;
}

export default function TourCard({ tour, onOpenBooking, onViewDetails }: TourCardProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";
  const title = isEn ? tour.titleEn : tour.title;
  const subtitle = isEn ? tour.subtitleEn : tour.subtitle;
  const duration = isEn ? tour.durationEn : tour.duration;
  const regionLabel = isEn ? tour.regionLabelEn : tour.regionLabel;
  const badge = isEn ? tour.badgeEn : tour.badge;
  const groupSize = isEn ? tour.groupSizeEn : tour.groupSize;
  const transport = isEn ? tour.transportEn : tour.transport;

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.visualLink}
        onClick={() => onViewDetails(tour)}
        aria-label={isEn ? `View details for ${title}` : `Xem chi tiết ${title}`}
      >
        {badge ? <span className={`${styles.badge} ${tour.isSale ? styles.saleBadge : ""}`}>{badge}</span> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tour.image} alt={title} className={styles.image} loading="lazy" />
        <span className={styles.imageOverlay} aria-hidden="true" />
        <span className={styles.regionLabel}>{regionLabel}</span>
        <span className={styles.arrowBtn} aria-hidden="true"><FiArrowUpRight size={16} /></span>
      </button>

      <div className={styles.content}>
        <div className={styles.cardMeta}>
          <span>{tour.location}</span>
          <span>{duration}</span>
        </div>

        <button type="button" className={styles.titleButton} onClick={() => onViewDetails(tour)}>
          <h3 className={styles.title}>{title}</h3>
        </button>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <FiUsers className={styles.featureBullet} size={14} />
            <span>{groupSize}</span>
          </div>
          <div className={styles.featureItem}>
            <FiCompass className={styles.featureBullet} size={14} />
            <span>{transport}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceCol}>
            <span className={styles.priceLabel}>{dictionary.journeys.priceFrom}</span>
            <span className={styles.priceValue}>{tour.price}</span>
          </div>
          <button type="button" className={styles.bookBtn} onClick={() => onOpenBooking(tour)}>
            <span>{dictionary.journeys.bookNow}</span>
            <FiArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
