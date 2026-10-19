"use client";

import React from "react";
import styles from "./IntroSection.module.css";
import ScrollReveal from "./ScrollReveal";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

export default function IntroSection() {
  const { dictionary } = useLocale();

  return (
    <section className={styles.intro} id="ban-sac">
      <ScrollReveal className={styles.introLabel}>
        <span className={styles.smallMark} aria-hidden="true">✳</span>
        <span>{dictionary.intro.tag}</span>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <p className={styles.eyebrow}>{dictionary.intro.eyebrow}</p>
        <h2 className={styles.heading}>
          {dictionary.intro.heading}
          <br />
          <em>{dictionary.intro.headingItalic}</em> {dictionary.intro.headingEnd}
        </h2>

        <div className={styles.introFoot}>
          <p>{dictionary.intro.body}</p>
          <a href="#cach-di" className={`${styles.textLink} group`}>
            <span>{dictionary.intro.moreLink}</span>
            <FiArrowUpRight
              size={14}
              className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
            />
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal className={styles.introStamp} delay={160} aria-hidden="true">
        <span>{dictionary.intro.stampTop}</span>
        <b>n.</b>
        <span>{dictionary.intro.stampBottom}</span>
      </ScrollReveal>
    </section>
  );
}
