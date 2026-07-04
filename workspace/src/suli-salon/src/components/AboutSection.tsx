"use client";
import Link from "next/link";
import styles from "./AboutSection.module.css";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

export default function AboutSection() {
  const features = [
    "Professional and experienced team",
    "Precision and attention to every detail",
    "Modern nail designs & latest trends",
    "High-quality, trusted products",
    "Personalized care for every client",
    "Clean, comfortable atmosphere",
    "Convenient Prague location"
  ];

  return (
    <section className={styles.parallaxSection}>
      <div className={styles.parallaxBg}></div>
      <div className={`container ${styles.container}`}>
        
        {/* Content Card that slides over */}
        <motion.div 
          className={styles.contentCard}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeNumber}>10+</span>
            <span className={styles.badgeText}>Years of<br/>Experience</span>
          </div>

          <h4 className={styles.subtitle}>ABOUT SULI SALON</h4>
          <h2 className={styles.title}>Style That Speaks for You</h2>
          <p className={styles.desc}>
            Precision nail design created for your unique look.
          </p>
          
          <ul className={styles.featureList}>
            {features.map((f, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.featureItem}
              >
                <span className={styles.iconWrapper}><FaCheck size={12}/></span>
                {f}
              </motion.li>
            ))}
          </ul>

          <Link href="/about" className={styles.exploreBtn}>
            EXPLORE OUR STORY
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
