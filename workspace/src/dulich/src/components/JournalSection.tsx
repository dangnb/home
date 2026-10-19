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
  const [featured, secondary] = articles;

  if (!featured) return null;

  const getArticleCopy = (article: JournalArticle) => ({
    title: isEn ? article.titleEn : article.title,
    excerpt: isEn ? article.excerptEn : article.excerpt,
    readTime: isEn ? article.readTimeEn : article.readTime,
    tag: isEn ? article.tagEn : article.tag,
    author: isEn ? article.authorEn : article.author,
    date: isEn ? article.dateEn : article.date,
  });

  const featuredCopy = getArticleCopy(featured);

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
        <a href="#lien-he" className={`${styles.allLink} group`}>
          <span>{dictionary.journal.allLink}</span>
          <FiArrowUpRight
            size={14}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
          />
        </a>
      </ScrollReveal>

      <ScrollReveal className={styles.journalGrid} delay={80}>
        <a href="#lien-he" className={`${styles.journalFeature} group`}>
          <div className={styles.journalPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featuredCopy.title}
              loading="lazy"
            />
          </div>
          <div className={styles.journalCopy}>
            <p className={styles.articleTag}>{featuredCopy.tag}</p>
            <p className={styles.articleMeta}>
              {featuredCopy.date} · {featuredCopy.readTime}
            </p>
            <h3 className={styles.articleTitle}>{featuredCopy.title}</h3>
            <p className={styles.articleExcerpt}>{featuredCopy.excerpt}</p>
            <div className={styles.articleFooter}>
              <span>{featuredCopy.author}</span>
              <span className={styles.readLink}>
                <span>{dictionary.journal.readStory}</span>
                <FiArrowUpRight
                  size={13}
                  className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                />
              </span>
            </div>
          </div>
        </a>

        {secondary
          ? (() => {
              const secondaryCopy = getArticleCopy(secondary);
              return (
                <a
                  href="#lien-he"
                  className={`${styles.secondaryStory} group`}
                >
                  <div className={styles.secondaryPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={secondary.image}
                      alt={secondaryCopy.title}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.secondaryBody}>
                    <p className={styles.articleTag}>{secondaryCopy.tag}</p>
                    <h3>{secondaryCopy.title}</h3>
                    <p className={styles.secondaryMeta}>
                      {secondaryCopy.date} · {secondaryCopy.readTime}
                    </p>
                    <span className={styles.readLink}>
                      <span>{dictionary.journal.readStory}</span>
                      <FiArrowUpRight
                        size={13}
                        className="transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                      />
                    </span>
                  </div>
                </a>
              );
            })()
          : null}
      </ScrollReveal>
    </section>
  );
}
