"use client";

import { useEffect, useState } from "react";
import styles from "./BrandLoader.module.css";

const LOADER_SESSION_KEY = "nep-brand-intro-seen";
type LoaderPhase = "visible" | "leaving" | "hidden";

/**
 * A short brand-led introduction for a new browser tab.
 * It is intentionally independent from remote image loading so the page never
 * appears stuck when a connection is slow.
 */
export default function BrandLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("visible");

  useEffect(() => {
    let exitTimer: number | undefined;
    let removeTimer: number | undefined;
    let firstFrame = 0;
    let secondFrame = 0;

    const leave = (reducedMotion: boolean) => {
      setPhase("leaving");
      removeTimer = window.setTimeout(
        () => setPhase("hidden"),
        reducedMotion ? 80 : 360,
      );
    };

    const start = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let hasSeenIntro = false;

      try {
        hasSeenIntro = window.sessionStorage.getItem(LOADER_SESSION_KEY) === "true";
        window.sessionStorage.setItem(LOADER_SESSION_KEY, "true");
      } catch {
        // Storage can be unavailable in private or restrictive browser modes.
      }

      if (hasSeenIntro) {
        leave(reducedMotion);
        return;
      }

      exitTimer = window.setTimeout(
        () => leave(reducedMotion),
        reducedMotion ? 100 : 1500,
      );
    };

    // Let the initial page background and hero establish before the intro leaves.
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(start);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      if (exitTimer) window.clearTimeout(exitTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`${styles.loader} ${phase === "leaving" ? styles.leaving : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Nếp Journeys đang mở hành trình"
    >
      <div className={styles.content}>
        <span className={styles.mark} aria-hidden="true">
          n.
        </span>
        <p className={styles.wordmark}>NẾP JOURNEYS</p>
        <p className={styles.tagline}>Chạm vào nếp sống Việt</p>
        <span className={styles.progress} aria-hidden="true" />
      </div>
    </div>
  );
}
