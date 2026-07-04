"use client";
import Link from "next/link";
import styles from "./ServicesPreview.module.css";
import { motion } from "framer-motion";

const services = [
  {
    id: "nails",
    title: "Nails",
    desc: "Complete nail care including manicure, nail extensions, and pedicure with a focus on quality and hygiene.",
    img: "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg"
  },
  {
    id: "facial",
    title: "Facial Care / Skin Treatments",
    desc: "Professional facial treatments for clean, refreshed and youthful skin.",
    img: "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg"
  },
  {
    id: "eyelashes",
    title: "Eyelashes",
    desc: "Professional eyelash extensions, lash lifting and volume lashes for natural or dramatic looks.",
    img: "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg"
  },
  {
    id: "eyebrows",
    title: "Eyebrows",
    desc: "Professional eyebrow shaping and tinting for a natural look.",
    img: "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg"
  }
];

export default function ServicesPreview() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h4 className={styles.subtitle}>SALON SULI</h4>
          <h2 className={styles.title}>Professional Manicure & Pedicure in Prague</h2>
        </motion.div>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link href={`/services?categoryId=${s.id}`} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.title} className={styles.cardImage} />
                  <div className={styles.cardOverlay}>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.desc}</p>
                    <span className={styles.cardBtn}>Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
