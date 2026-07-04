"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Preloader.module.css";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "animating" | "done">("loading");

  useEffect(() => {
    // 1. Loading screen for 1.5s
    const loadTimer = setTimeout(() => {
      setState("animating");

      // 2. Circle animation takes 1.5s
      setTimeout(() => {
        setState("done");
      }, 1500);

    }, 1500);

    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <>
      {state !== "done" && (
        <div className={styles.preloaderScreen}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.logoWrapper}
          >
            <h1 className={styles.logo}>Suli Salon</h1>
          </motion.div>
        </div>
      )}

      <div
        className={styles.contentWrapper}
        style={{
          clipPath: state === "loading" 
            ? "circle(0% at 50% 50%)" 
            : state === "animating" 
              ? "circle(150% at 50% 50%)" 
              : "none",
          transition: state === "animating" ? "clip-path 1.5s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
