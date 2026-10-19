"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ScrollReveal.module.css";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
};

/** Reveals a content group once as it enters the viewport. */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  style,
  ...props
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "pending">("visible");

  useEffect(() => {
    const element = elementRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!element || reducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const viewportBottom = window.innerHeight - 60;
    const { bottom, top } = element.getBoundingClientRect();

    if (top < viewportBottom && bottom > 0) {
      return;
    }

    setState("pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setState("visible");
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.12,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      {...props}
      ref={elementRef}
      className={`${styles.reveal} ${state === "pending" ? styles.pending : styles.visible} ${className ?? ""}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
