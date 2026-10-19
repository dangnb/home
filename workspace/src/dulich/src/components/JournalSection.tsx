"use client";

import React from "react";
import styles from "./JournalSection.module.css";
import ScrollReveal from "./ScrollReveal";
import type { JournalArticle } from "@/types";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

interface JournalSectionProps {
  articles: JournalArticle[];
}

export default function JournalSection({ articles }: JournalSectionProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";

  const featured = articles[0];
  if (!featured) return null;

  const title = isEn ? featured.titleEn : featured.title;
  const excerpt = isEn ? featured.excerptEn : featured.excerpt;
  const readTime = isEn ? featured.readTimeEn : featured.readTime;
  const tag = isEn ? featured.tagEn : featured.tag;

  return (
    <section className={styles.journal} id="nhat-ky">
      <ScrollReveal className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>{dictionary.journal.eyebrow}</p>
          <h2 className={styles.title}>
            {dictionary.journal.heading}{" "}
            <em>{dictionary.journal.headingItalic}</em>
          </h2>
        </div>

        <a href="#lien-he" className={styles.allLink}>
          <span>{dictionary.journal.allLink}</span>
          <FiArrowUpRight size={15} />
        </a>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <a href="#lien-he" className={styles.journalFeature}>
          <div className={styles.journalPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt={title} loading="lazy" />
          </div>

          <div className={styles.journalCopy}>
            <div className={styles.articleTag}>
              <span>{tag}</span>
              <span> · {readTime}</span>
            </div>

            <h3 className={styles.articleTitle}>{title}</h3>
            <p className={styles.articleExcerpt}>{excerpt}</p>

            <span className={styles.readLink}>
              <span>{dictionary.journal.readStory}</span>
              <FiArrowUpRight size={14} />
            </span>
          </div>

          <span className={styles.journalMark} aria-hidden="true">
            n.
          </span>
        </a>
      </ScrollReveal>
    </section>
  );
}
