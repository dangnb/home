"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TourSection.module.css";
import type { Tour, Category } from "@/types";
import TourCard from "./TourCard";
import { useLocale } from "./LocaleProvider";

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
      <motion.div
        className={styles.headingRow}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className={styles.title}>
          {dictionary.journeys.heading} {dictionary.journeys.headingItalic}
        </h2>

        <div
          className={styles.filterBar}
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
                <span className={styles.filterCount}>({count})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={styles.journeyCollection}
          >
            {featuredTour ? (
              <motion.div
                className={styles.featuredItem}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.18,
                  margin: "0px 0px -40px 0px",
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <TourCard
                  tour={featuredTour}
                  featured
                  onOpenBooking={onOpenBooking}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            ) : null}

            {remainingTours.length ? (
              <div className={styles.grid}>
                {remainingTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    className={styles.cardItem}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                      margin: "0px 0px -40px 0px",
                    }}
                    transition={{
                      duration: 0.62,
                      delay: (index % 3) * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TourCard
                      tour={tour}
                      onOpenBooking={onOpenBooking}
                      onViewDetails={onViewDetails}
                    />
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
