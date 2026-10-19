"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      : tours.filter((tour) => tour.region === activeCategory);
  const featuredTour =
    filteredTours.find((tour) => tour.isFeatured) ?? filteredTours[0];
  const remainingTours = filteredTours.filter(
    (tour) => tour.id !== featuredTour?.id,
  );

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
        <a href="#lien-he" className={`${styles.allLink} group`}>
          <span>{dictionary.journeys.allLink}</span>
          <FiArrowUpRight
            size={14}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
          />
        </a>
      </ScrollReveal>

      <ScrollReveal
        className={styles.filterBar}
        delay={60}
        role="group"
        aria-label={
          isEn
            ? "Filter journeys by region"
            : "Lọc hành trình theo vùng miền"
        }
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? tours.length
              : tours.filter((tour) => tour.region === cat.id).length;

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

      <ScrollReveal delay={100} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className={styles.journeyCollection}
          >
            {featuredTour ? (
              <div className={styles.featuredItem}>
                <TourCard
                  tour={featuredTour}
                  featured
                  onOpenBooking={onOpenBooking}
                  onViewDetails={onViewDetails}
                />
              </div>
            ) : null}

            {remainingTours.length ? (
              <div className={styles.grid}>
                {remainingTours.map((tour, index) => (
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
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </ScrollReveal>
    </section>
  );
}
