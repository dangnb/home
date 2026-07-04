"use client";
import Link from "next/link";
import styles from "./GalleryPreview.module.css";
import { motion } from "framer-motion";

const images = [
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg"
];

export default function GalleryPreview() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h4 className={styles.subtitle}>GALLERY</h4>
            <h2 className={styles.title}>Luxury Nail Gallery in Prague</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
             <Link href="/gallery" className={styles.viewBtn}>View All &rarr;</Link>
          </motion.div>
        </div>

        <div className={styles.galleryWrapper}>
          <motion.div 
            className={styles.galleryTrack}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          >
            {/* Duplicated for seamless loop */}
            {[...images, ...images].map((img, i) => (
              <div key={i} className={styles.galleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Gallery" className={styles.image} />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
