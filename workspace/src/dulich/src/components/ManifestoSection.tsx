"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./ManifestoSection.module.css";
import { useLocale } from "./LocaleProvider";
import { FiArrowUpRight } from "react-icons/fi";

export default function ManifestoSection() {
  const { dictionary } = useLocale();

  return (
    <section className={styles.manifesto} id="cach-di">
      <div className={styles.manifestoGrid}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className={styles.heading}>
            {dictionary.manifesto.heading} {dictionary.manifesto.headingItalic}
          </h2>
          <p className={styles.manifestoNote}>{dictionary.manifesto.note}</p>
        </motion.div>

        <div className={styles.rightCol}>
          <motion.div
            className={styles.manifestoImage}
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
            transition={{
              duration: 0.72,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85"
              alt="Ánh nắng đầu ngày trải trên miền quê yên tĩnh"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className={styles.manifestoCopy}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25, margin: "0px 0px -30px 0px" }}
            transition={{
              duration: 0.62,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className={styles.description}>{dictionary.manifesto.body}</p>
            <a href="#hanh-trinh" className={styles.ctaLink}>
              <span>{dictionary.manifesto.cta}</span>
              <FiArrowUpRight size={16} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
