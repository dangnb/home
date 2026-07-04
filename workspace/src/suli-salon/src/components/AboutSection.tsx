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
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        
        {/* Left Side (Image/Badge) */}
        <motion.div 
          className={styles.imageCol}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg" 
              alt="About Suli Salon" 
              className={styles.image}
            />
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>10+</span>
              <span className={styles.badgeText}>Years of<br/>Experience</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side (Content) */}
        <motion.div 
          className={styles.contentCol}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
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
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
