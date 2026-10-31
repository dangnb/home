"use client";

import React, { type ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./ScrollReveal.module.css";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.56,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`${styles.reveal} ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
