"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Beauty That Boosts Your Confidence",
    subtitle: "More than beautiful nails — a moment of comfort and relaxation.",
    btnText: "VIEW GALLERY",
    btnLink: "/gallery",
    img1: "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
    img2: "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
  },
  {
    title: "Precision Nail Care",
    subtitle: "High-quality products, skilled technicians, and attention to detail.",
    btnText: "OUR SERVICES",
    btnLink: "/services",
    img1: "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
    img2: "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  },
  {
    title: "Luxury & Comfort",
    subtitle: "Experience the ultimate pampering in a serene environment.",
    btnText: "BOOK APPOINTMENT",
    btnLink: "/booking",
    img1: "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
    img2: "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={styles.textContent}
            >
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.subtitle}>{slide.subtitle}</p>
              <Link href={slide.btnLink} className={styles.heroButton}>
                {slide.btnText}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.imageArea}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={`img1-${current}`}
              className={styles.imageWrapper1}
              initial={{ opacity: 0, scale: 0.95, rotate: -5, y: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: -5, y: 20 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.img1} alt="Pedicure" />
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`img2-${current}`}
              className={styles.imageWrapper2}
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.img2} alt="Manicure" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.indicators}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
