"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import styles from "./Hero.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowDown } from "react-icons/fi";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  const { dictionary } = useLocale();

  return (
    <section className={styles.hero} id="top" aria-label="Hero Banner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.heroImage}
        src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=90"
        alt="Thuyền nhỏ xuôi theo dòng sông giữa núi đá vôi Việt Nam"
      />
      <div className={styles.heroShade} />

      <motion.div
        className={styles.heroCopy}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={itemVariants} className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          <span>{dictionary.hero.eyebrow}</span>
        </motion.p>

        <motion.h1 variants={itemVariants} className={styles.title}>
          {dictionary.hero.titleMain}
          <br />
          {dictionary.hero.titleSub} <em>{dictionary.hero.titleItalic}</em>
        </motion.h1>

        <motion.div variants={itemVariants} className={styles.heroBottom}>
          <p className={styles.description}>{dictionary.hero.description}</p>
          <a href="#hanh-trinh" className={`${styles.exploreLink} group`}>
            <span>{dictionary.hero.explore}</span>
            <FiArrowDown
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 ease-in-out group-hover:translate-y-[2px]"
            />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.55, ease: "easeInOut" }}
        className={styles.captionRail}
      >
        <div className={styles.heroCaption}>
          <span>{dictionary.hero.captionLocation}</span>
          <span>{dictionary.hero.captionCoords}</span>
        </div>
        <span className={styles.routeNote}>NẾP / VIỆT NAM / 01</span>
      </motion.div>
    </section>
  );
}
