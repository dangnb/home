"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./JournalSection.module.css";
import type { JournalArticle } from "@/types";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { useOverlayAccessibility } from "@/hooks/useOverlayAccessibility";

interface JournalSectionProps {
  articles: JournalArticle[];
}

export default function JournalSection({ articles }: JournalSectionProps) {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";
  const [featured, secondary] = articles;
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(
    null,
  );

  const closeArticle = () => setActiveArticle(null);
  const { openWithTrigger } = useOverlayAccessibility(
    Boolean(activeArticle),
    closeArticle,
    "#journal-modal-close",
  );

  if (!featured) return null;

  const getArticleCopy = (article: JournalArticle) => ({
    title: isEn ? article.titleEn : article.title,
    excerpt: isEn ? article.excerptEn : article.excerpt,
    readTime: isEn ? article.readTimeEn : article.readTime,
    tag: isEn ? article.tagEn : article.tag,
    author: isEn ? article.authorEn : article.author,
    date: isEn ? article.dateEn : article.date,
    location: isEn ? article.locationEn : article.location,
    pullQuote: isEn ? article.pullQuoteEn : article.pullQuote,
    paragraphs:
      (isEn ? article.contentEn : article.content) ?? [
        isEn ? article.excerptEn : article.excerpt,
      ],
  });

  const featuredCopy = getArticleCopy(featured);

  const handleOpenArticle = (
    article: JournalArticle,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    openWithTrigger(event.currentTarget);
    setActiveArticle(article);
  };

  const activeCopy = activeArticle ? getArticleCopy(activeArticle) : null;
  const nextArticle =
    activeArticle && articles.length > 1
      ? articles.find((item) => item.id !== activeArticle.id) ?? null
      : null;

  return (
    <section className={styles.journal} id="nhat-ky">
      <motion.div
        className={styles.headingRow}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className={styles.title}>
          {dictionary.journal.heading} {dictionary.journal.headingItalic}
        </h2>
        <button
          type="button"
          className={styles.allLink}
          onClick={(event) => handleOpenArticle(featured, event)}
        >
          <span>{dictionary.journal.allLink}</span>
          <FiArrowUpRight size={15} aria-hidden="true" />
        </button>
      </motion.div>

      <div className={styles.journalGrid}>
        <motion.article
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={styles.journalFeature}
          onClick={(event) => handleOpenArticle(featured, event)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActiveArticle(featured);
            }
          }}
          aria-label={`${featuredCopy.title}: ${dictionary.journal.readStory}`}
        >
          <div className={styles.journalPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featuredCopy.title}
              loading="lazy"
            />
          </div>
          <div className={styles.journalCopy}>
            <p className={styles.articleMeta}>
              <span>{featuredCopy.tag}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredCopy.date}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredCopy.readTime}</span>
            </p>
            <h3 className={styles.articleTitle}>{featuredCopy.title}</h3>
            <p className={styles.articleExcerpt}>{featuredCopy.excerpt}</p>
            <div className={styles.articleFooter}>
              <span className={styles.authorName}>{featuredCopy.author}</span>
              <span className={styles.readLink}>
                <span>{dictionary.journal.readStory}</span>
                <FiArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </div>
        </motion.article>

        {secondary
          ? (() => {
              const secondaryCopy = getArticleCopy(secondary);
              return (
                <motion.article
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.18,
                    margin: "0px 0px -40px 0px",
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={styles.secondaryStory}
                  onClick={(event) => handleOpenArticle(secondary, event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveArticle(secondary);
                    }
                  }}
                  aria-label={`${secondaryCopy.title}: ${dictionary.journal.readStory}`}
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
                    <p className={styles.secondaryMeta}>
                      <span>{secondaryCopy.tag}</span>
                      <span aria-hidden="true">·</span>
                      <span>{secondaryCopy.date}</span>
                    </p>
                    <h3 className={styles.secondaryTitle}>
                      {secondaryCopy.title}
                    </h3>
                    <p className={styles.secondaryExcerpt}>
                      {secondaryCopy.excerpt}
                    </p>
                    <span className={styles.readLink}>
                      <span>{dictionary.journal.readStory}</span>
                      <FiArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </motion.article>
              );
            })()
          : null}
      </div>

      <AnimatePresence>
        {activeArticle && activeCopy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.modalOverlay}
            onClick={closeArticle}
            role="presentation"
          >
            <motion.article
              key={activeArticle.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className={styles.articleModal}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="journal-article-modal-title"
            >
              <button
                id="journal-modal-close"
                type="button"
                className={styles.modalCloseBtn}
                onClick={closeArticle}
                aria-label={isEn ? "Close article" : "Đóng bài viết"}
              >
                <FiX size={18} />
              </button>

              <div className={styles.modalHero}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeArticle.image}
                  alt={activeCopy.title}
                  className={styles.modalHeroImage}
                />
                <div className={styles.modalHeroCaption}>
                  <span>{activeCopy.tag}</span>
                  {activeCopy.location ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{activeCopy.location}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalMetaRow}>
                  <span>{activeCopy.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCopy.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEn ? "By" : "Thực hiện:"} {activeCopy.author}
                  </span>
                </div>

                <h2
                  id="journal-article-modal-title"
                  className={styles.modalTitle}
                >
                  {activeCopy.title}
                </h2>

                <p className={styles.modalLead}>{activeCopy.excerpt}</p>

                {activeCopy.pullQuote ? (
                  <blockquote className={styles.pullQuote}>
                    “{activeCopy.pullQuote}”
                  </blockquote>
                ) : null}

                <div className={styles.modalBodyCopy}>
                  {activeCopy.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className={styles.modalFooter}>
                  {nextArticle ? (
                    <button
                      type="button"
                      className={styles.nextStoryBtn}
                      onClick={() => setActiveArticle(nextArticle)}
                    >
                      <span className={styles.nextStoryLabel}>
                        {isEn ? "Next note" : "Ghi chép tiếp theo"}
                      </span>
                      <span className={styles.nextStoryTitle}>
                        {isEn ? nextArticle.titleEn : nextArticle.title}
                        <FiArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}

                  <a
                    href="#hanh-trinh"
                    className={styles.exploreJourneysBtn}
                    onClick={closeArticle}
                  >
                    <span>
                      {isEn ? "Explore journeys" : "Xem các hành trình"}
                    </span>
                    <FiArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
