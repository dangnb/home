"use client";
import styles from "./page.module.css";
import type { CruiseInfo } from "@/data/cruises";
import { cruiseData } from "@/data/cruises";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CruiseDetailClient({ cruise }: { cruise: CruiseInfo }) {
  const [activeImg, setActiveImg] = useState(0);
  const related = cruise.relatedSlugs.map(s => cruiseData[s]).filter(Boolean);

  return (
    <main className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <Link href="/">Trang chủ</Link>
          <span> / </span>
          <span>{cruise.badge}</span>
          <span> / </span>
          <span>{cruise.name}</span>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* ── LEFT: Main content ── */}
        <div className={styles.main}>

          {/* Gallery */}
          <motion.div
            className={styles.gallery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.mainImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cruise.gallery[activeImg] || cruise.mainImage} alt={cruise.name} />
              {cruise.salePrice !== cruise.originalPrice && (
                <span className={styles.saleBadge}>Sale!</span>
              )}
            </div>
            {cruise.gallery.length > 1 && (
              <div className={styles.thumbs}>
                {cruise.gallery.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${cruise.name} ${i}`}
                    className={i === activeImg ? styles.thumbActive : styles.thumb}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Description heading */}
          <motion.div
            className={styles.descBlock}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.descTitle}>
              🚢 TRẢI NGHIỆM {cruise.name.toUpperCase()}: SANG TRỌNG &amp; ĐẲNG CẤP TRÊN SÔNG HÀN
            </h2>

            <div className={styles.relatedLinks}>
              <span>Tham khảo các tin liên quan:</span>
              <ul>
                {related.map(r => (
                  <li key={r.slug}>
                    <Link href={`/du-thuyen/${r.slug}`}>{r.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className={styles.serviceTag}>Dịch vụ lưu trú độc đáo!</p>
            {cruise.highlights.map((h, i) => (
              <p key={i} className={styles.highlightItem}>• {h}</p>
            ))}
          </motion.div>

          {/* Overview */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.sectionTitle}>1. Giới thiệu tổng quan:</h3>
            {cruise.description.split("\n\n").map((p, i) => (
              <p key={i} className={styles.para}>{p}</p>
            ))}
          </motion.div>

          {/* Tours */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.sectionTitle}>2. Lịch trình chi tiết các Tour</h3>
            <p className={styles.para}>Để đáp ứng nhu cầu đa dạng của quý khách, {cruise.name} cung cấp {cruise.tours.length} lịch trình trải nghiệm đặc sắc mỗi ngày:</p>
            {cruise.tours.map((tour, i) => (
              <div key={i} className={styles.tourCard}>
                <h4 className={styles.tourName}>{tour.icon} {tour.name}</h4>
                <ul className={styles.scheduleList}>
                  {tour.schedule.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Includes */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.sectionTitle}>3. Dịch vụ bao gồm trong giá vé</h3>
            <ul className={styles.includeList}>
              {cruise.includes.map((item, i) => (
                <li key={i}>✅ {item}</li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <span className={styles.categoryBadge}>{cruise.badge}</span>
            <h1 className={styles.cruiseName}>{cruise.name}</h1>
            <div className={styles.priceBox}>
              <span className={styles.originalPrice}>Giá: {cruise.originalPrice}</span>
              <span className={styles.salePrice}>Giảm Còn: {cruise.salePrice}</span>
            </div>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Số Tầng:</span>
                <span className={styles.specValue}>{cruise.floors}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Số Lượng:</span>
                <span className={styles.specValue}>{cruise.capacity} người</span>
              </div>
            </div>
            <a href="tel:0796768636" className={styles.ctaBtn}>
              📞 Liên Hệ Ngay
            </a>
            <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer" className={styles.zaloBtn}>
              💬 Đặt Qua Zalo
            </a>
          </div>

          {related.length > 0 && (
            <div className={styles.relatedCard}>
              <h4 className={styles.relatedTitle}>Du Thuyền Tương Tự</h4>
              {related.map(r => (
                <Link key={r.slug} href={`/du-thuyen/${r.slug}`} className={styles.relatedItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.mainImage} alt={r.name} />
                  <div>
                    <p className={styles.relatedName}>{r.name}</p>
                    <p className={styles.relatedPrice}>{r.salePrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
