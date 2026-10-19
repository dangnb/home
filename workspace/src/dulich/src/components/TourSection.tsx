"use client";

import React, { useState } from "react";
import styles from "./TourSection.module.css";
import ScrollReveal from "./ScrollReveal";
import type { Tour, Category } from "@/types";
import TourCard from "./TourCard";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

interface TourSectionProps {
  categories: Category[];
  tours: Tour[];
  onOpenBooking: (tour: Tour) => void;
  onViewDetails: (tour: Tour) => void;
}

export default function TourSection({
  categories,
  tours,
  onOpenBooking,
  onViewDetails,
}: TourSectionProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTours =
    activeCategory === "all"
      ? tours
      : tours.filter((t) => t.region === activeCategory);

  return (
    <section className={styles.section} id="hanh-trinh">
      <ScrollReveal className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>{dictionary.journeys.eyebrow}</p>
          <h2 className={styles.title}>
            {dictionary.journeys.heading}{" "}
            <em>{dictionary.journeys.headingItalic}</em>
          </h2>
        </div>

        <a href="#lien-he" className={styles.allLink}>
          <span>{dictionary.journeys.allLink}</span>
          <FiArrowUpRight size={15} />
        </a>
      </ScrollReveal>

      {/* Filter Tabs */}
      <ScrollReveal
        className={styles.filterBar}
        delay={80}
        role="group"
        aria-label={isEn ? "Filter journeys by region" : "Lọc hành trình theo vùng miền"}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? tours.length
              : tours.filter((t) => t.region === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              className={styles.filterBtn}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{isEn ? cat.nameEn : cat.name}</span>
              <span className={styles.filterCount}>
                {count < 10 ? `0${count}` : count}
              </span>
            </button>
          );
        })}
      </ScrollReveal>

      {/* Tour Grid */}
      <ScrollReveal className={styles.grid} delay={120} aria-live="polite">
        {filteredTours.map((tour, index) => (
          <div
            key={tour.id}
            className={styles.cardItem}
            style={{ "--reveal-order": String(index) } as React.CSSProperties}
          >
            <TourCard
              tour={tour}
              onOpenBooking={onOpenBooking}
              onViewDetails={onViewDetails}
            />
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
