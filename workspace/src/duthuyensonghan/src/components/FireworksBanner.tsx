"use client";
import styles from "./FireworksBanner.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FireworksBanner() {
  return (
    <section className={styles.section}>
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/phaohoatuocte.jpg" alt="Pháo Hoa Đà Nẵng" className={styles.bg} />
      <div className={styles.overlay} />

      <div className={`container ${styles.inner}`}>
        {/* Left: YouTube Video */}
        <motion.div
          className={styles.videoWrap}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.videoFrame}>
            <iframe
              src="https://www.youtube.com/embed/dQ3TjZ_lQ0Q?autoplay=0&rel=0"
              title="Xem Pháo Hoa DIFF 2026 trên du thuyền"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Right: Info card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className={styles.tag}>Pháo hoa Diff Đà Nẵng</span>
          <h2 className={styles.title}>Lễ Hội Pháo Hoa Quốc Tế Đà Nẵng</h2>
          <ul className={styles.list}>
            <li>
              Khi nhắc đến dịch vụ xem <strong>pháo hoa quốc tế Diff</strong> trên du thuyền ở Đà Nẵng. Quý khách hãy yên tâm đến với <strong>2Da Tickets</strong>.
            </li>
            <li>
              Không dừng lại ở bán vé online, <strong>2Da Tickets</strong> sẽ trực tiếp đón quý khách tại bến du thuyền, làm thủ tục và dẫn lên thuyền.
            </li>
          </ul>
          <Link href="/phao-hoa" className={styles.btn}>
            Xem Chi Tiết →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
