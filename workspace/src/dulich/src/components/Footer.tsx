"use client";

import React from "react";
import styles from "./Footer.module.css";
import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { dictionary } = useLocale();

  return (
    <footer className={styles.footer}>
      <a
        href="#top"
        className={styles.brand}
        aria-label="Nếp Journeys, về đầu trang"
      >
        <span className={styles.brandSymbol} aria-hidden="true">
          n.
        </span>
        <span>
          NẾP <small className={styles.brandSub}>JOURNEYS</small>
        </span>
      </a>

      <span className={styles.copyright}>{dictionary.footer.copyright}</span>

      <a href="#top" className={styles.backTop}>
        {dictionary.footer.backToTop}
      </a>
    </footer>
  );
}
