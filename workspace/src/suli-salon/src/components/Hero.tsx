"use client";
import Link from "next/link";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        
        {/* Left Content */}
        <div className={styles.contentArea}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Suli Salon &ndash; Nail Salon in Prague
          </motion.h1>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Professional manicure and pedicure in a calm, modern space.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/booking" className={styles.heroButton}>
              BOOK APPOINTMENT &rarr;
            </Link>
          </motion.div>
        </div>

        {/* Right Images */}
        <div className={styles.imageArea}>
          <motion.div 
            className={styles.imageWrapper1}
            initial={{ opacity: 0, scale: 0.95, rotate: -5, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg" 
              alt="Pedicure" 
            />
          </motion.div>
          
          <motion.div 
            className={styles.imageWrapper2}
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg" 
              alt="Manicure" 
            />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
