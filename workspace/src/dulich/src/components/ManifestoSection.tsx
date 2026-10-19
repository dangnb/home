"use client";

import React from "react";
import styles from "./ManifestoSection.module.css";
import ScrollReveal from "./ScrollReveal";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

export default function ManifestoSection() {
  const { dictionary } = useLocale();

  return (
    <section className={styles.manifesto} id="cach-di">
      <ScrollReveal className={styles.manifestoImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85"
          alt="Ánh nắng đầu ngày trải trên miền quê yên tĩnh"
          loading="lazy"
        />
      </ScrollReveal>

      <ScrollReveal className={styles.manifestoContent} delay={100}>
        <p className={styles.eyebrow}>{dictionary.manifesto.eyebrow}</p>
        <h2 className={styles.heading}>
          {dictionary.manifesto.heading}
          <br />
          <em>{dictionary.manifesto.headingItalic}</em>
        </h2>
        <p className={styles.description}>{dictionary.manifesto.body}</p>

        <a href="#hanh-trinh" className={`${styles.ctaLink} group`}>
          <span>{dictionary.manifesto.cta}</span>
          <FiArrowUpRight
            size={15}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
          />
        </a>

        <div className={styles.manifestoNote}>
          <span>01 — 03</span>
          <span>{dictionary.manifesto.note}</span>
        </div>
      </ScrollReveal>
    </section>
  );
}
