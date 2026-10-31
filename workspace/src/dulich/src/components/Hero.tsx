"use client";

import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import styles from "./Hero.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

interface HeroScene {
  id: string;
  placeVi: string;
  placeEn: string;
  captionVi: string;
  captionEn: string;
  image: string;
}

const HERO_SCENES: HeroScene[] = [
  {
    id: "ha-giang",
    placeVi: "Hà Giang",
    placeEn: "Ha Giang",
    captionVi: "Cao nguyên đá Đồng Văn · Sương sớm trên thung lũng",
    captionEn: "Dong Van Karst Plateau · Morning mist over the valley",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "ninh-binh",
    placeVi: "Ninh Bình",
    placeEn: "Ninh Binh",
    captionVi: "Đầm Vân Long & Tràng An · Thung lũng đá vôi ngập nước",
    captionEn: "Van Long & Trang An · Flooded limestone valleys",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "hue",
    placeVi: "Cố đô Huế",
    placeEn: "Imperial Hue",
    captionVi: "Phá Tam Giang & Nhà vườn Kim Long · Chiều tĩnh lặng",
    captionEn: "Tam Giang Lagoon & Kim Long Gardens · Quiet dusk",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "hoi-an",
    placeVi: "Hội An",
    placeEn: "Hoi An",
    captionVi: "Sông Thu Bồn & Phố cổ · Bình minh trước giờ phố thức",
    captionEn: "Thu Bon River & Ancient Town · First light before crowds",
    image:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=2000&q=85",
  },
];

const SLIDE_DURATION_MS = 6000;

export default function Hero() {
  const { locale, dictionary } = useLocale();
  const isEn = locale === "en";
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 700], [0, 110]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SCENES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [activeIdx]);

  const currentScene = HERO_SCENES[activeIdx];

  const facts = isEn
    ? [
        { label: "Regions", value: "North · Central · South" },
        { label: "Group size", value: "6 to 10 guests" },
        { label: "Rhythm", value: "3 to 4 days per route" },
      ]
    : [
        { label: "Vùng di sản", value: "Bắc · Trung · Nam" },
        { label: "Quy mô đoàn", value: "6 đến 10 khách" },
        { label: "Thời lượng", value: "3 đến 4 ngày mỗi tuyến" },
      ];

  return (
    <section className={styles.hero} id="top">
      <motion.div
        className={styles.heroMedia}
        style={{ y: mediaY }}
        aria-hidden="true"
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={currentScene.id}
            src={currentScene.image}
            alt={isEn ? currentScene.captionEn : currentScene.captionVi}
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            fetchPriority="high"
          />
        </AnimatePresence>
        <div className={styles.heroScrim} />
      </motion.div>

      <div className={styles.heroStage}>
        <motion.div
          className={styles.heroPrimary}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.heroNote}>{dictionary.hero.eyebrow}</p>
          <h1 className={styles.title}>
            {dictionary.hero.titleLine1}
            <br />
            {dictionary.hero.titleLine2}
          </h1>
          <p className={styles.lead}>{dictionary.hero.lead}</p>

          <div className={styles.actions}>
            <a href="#hanh-trinh" className={styles.primaryCta}>
              <span>{dictionary.hero.primaryCta}</span>
              <FiArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href="#la-ban-mua" className={styles.secondaryCta}>
              <span>
                {isEn ? "Seasonal guide" : "Mùa đẹp trong năm"}
              </span>
            </a>
            <a href="#ban-sac" className={styles.scrollCue}>
              <span>{dictionary.hero.scrollLabel}</span>
              <FiArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroAside}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.sceneSwitcher}>
            <p className={styles.sceneCaption}>
              {isEn ? currentScene.captionEn : currentScene.captionVi}
            </p>
            <div
              className={styles.sceneTabs}
              role="tablist"
              aria-label={
                isEn ? "Featured destinations" : "Điểm đến tiêu biểu"
              }
            >
              {HERO_SCENES.map((scene, index) => {
                const isActive = index === activeIdx;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.sceneTab} ${
                      isActive ? styles.sceneTabActive : ""
                    }`}
                    onClick={() => setActiveIdx(index)}
                  >
                    <span>{isEn ? scene.placeEn : scene.placeVi}</span>
                    {isActive && (
                      <motion.span
                        key={`progress-${scene.id}-${activeIdx}`}
                        className={styles.sceneProgress}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: SLIDE_DURATION_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <dl className={styles.heroFacts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.factItem}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
