"use client";

import React from "react";
import styles from "./TourCard.module.css";
import type { Tour } from "@/types";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

interface TourCardProps {
  tour: Tour;
  onOpenBooking: (tour: Tour) => void;
  onViewDetails: (tour: Tour) => void;
  featured?: boolean;
}

export default function TourCard({
  tour,
  onOpenBooking,
  onViewDetails,
  featured = false,
}: TourCardProps) {
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
    <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
      <button
        type="button"
        className={styles.visualLink}
        onClick={() => onViewDetails(tour)}
        aria-label={isEn ? `View details for ${title}` : `Xem chi tiết ${title}`}
      >
        {badge ? <span className={styles.badge}>{badge}</span> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.image}
          alt={title}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.regionPill}>{regionLabel}</span>
      </button>

      <div className={styles.content}>
        <p className={styles.cardMeta}>
          <span>{tour.location}</span>
          <span aria-hidden="true">·</span>
          <span>{duration}</span>
        </p>

        <button
          type="button"
          className={styles.titleButton}
          onClick={() => onViewDetails(tour)}
        >
          <h3 className={styles.title}>{title}</h3>
        </button>

        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.supportingMeta}>
          <p className={styles.metaLine}>{groupSize}</p>
          <p className={styles.metaLine}>{transport}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceCol}>
            <span className={styles.priceLabel}>
              {dictionary.journeys.priceFrom}
            </span>
            <span className={styles.priceValue}>{tour.price}</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.detailBtn}
              onClick={() => onViewDetails(tour)}
            >
              <span>{dictionary.journeys.viewDetails}</span>
            </button>
            <button
              type="button"
              className={styles.bookBtn}
              onClick={() => onOpenBooking(tour)}
            >
              <span>{dictionary.journeys.bookNow}</span>
              <FiArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
