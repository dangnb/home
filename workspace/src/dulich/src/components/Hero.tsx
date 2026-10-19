"use client";

import React from "react";
import styles from "./Hero.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowDown } from "react-icons/fi";

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

      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <span className={styles.pulsingDot} />
          {dictionary.hero.eyebrow}
        </p>

        <h1 className={styles.title}>
          {dictionary.hero.titleMain}
          <br />
          {dictionary.hero.titleSub} <em>{dictionary.hero.titleItalic}</em>
        </h1>

        <div className={styles.heroBottom}>
          <p className={styles.description}>{dictionary.hero.description}</p>
          <a
            href="#hanh-trinh"
            className={styles.exploreLink}
            aria-label={dictionary.hero.explore}
          >
            <span>{dictionary.hero.explore}</span>
            <span className={styles.circleIcon} aria-hidden="true">
              <FiArrowDown size={19} />
            </span>
          </a>
        </div>
      </div>

      <div className={styles.heroCaption}>
        <span>{dictionary.hero.captionLocation}</span>
        <span>{dictionary.hero.captionCoords}</span>
      </div>

      <div className={styles.heroIndex}>
        <span>01</span>
        <span className={styles.indexLine} />
        <span>06</span>
      </div>
    </section>
  );
}
