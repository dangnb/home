"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./ScrollReveal.module.css";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
};

/** Reveals a content group with a calm, understated editorial fade-in. */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  style,
  ...props
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        {...props}
        className={`${styles.reveal} ${className ?? ""}`}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      {...(props as Record<string, unknown>)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.1 }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={`${styles.reveal} ${className ?? ""}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </motion.div>
  );
}
