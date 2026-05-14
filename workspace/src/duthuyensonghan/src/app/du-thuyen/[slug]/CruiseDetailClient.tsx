"use client";
import styles from "./page.module.css";
import type { Cruise } from "@/lib/db";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import BookingForm from "@/components/BookingForm";

interface Props {
  cruise: Cruise;
  relatedCruises: Cruise[];
}

export default function CruiseDetailClient({ cruise, relatedCruises }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  // Check if description is HTML
  const isHtmlDescription = cruise.description?.startsWith("<");

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
                    alt={`${cruise.name} ${i + 1}`}
                    className={i === activeImg ? styles.thumbActive : styles.thumb}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Description block */}
          <motion.div
            className={styles.descBlock}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.descTitle}>
              🚢 TRẢI NGHIỆM {cruise.name.toUpperCase()}: SANG TRỌNG &amp; ĐẲNG CẤP TRÊN SÔNG HÀN
            </h2>

            {/* Highlights — only show if not embedded in HTML description */}
            {!isHtmlDescription && cruise.highlights.map((h, i) => (
              <p key={i} className={styles.highlightItem}>• {h}</p>
            ))}
          </motion.div>

          {/* Main content — HTML or plain text */}
          {isHtmlDescription ? (
            <motion.div
              className={`${styles.section} ${styles.richContent}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              dangerouslySetInnerHTML={{ __html: cruise.description }}
            />
          ) : (
            <>
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

              {/* Includes */}
              {cruise.includes.length > 0 && (
                <motion.div
                  className={styles.section}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className={styles.sectionTitle}>Dịch vụ bao gồm trong giá vé</h3>
                  <ul className={styles.includeList}>
                    {cruise.includes.map((item, i) => (
                      <li key={i}>✅ {item}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </>
          )}

          {/* Tours */}

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <span className={styles.categoryBadge}>{cruise.badge}</span>
            <h1 className={styles.cruiseName}>{cruise.name}</h1>
            <div className={styles.priceBox}>
              {cruise.originalPrice && cruise.originalPrice !== cruise.salePrice && (
                <span className={styles.originalPrice}>Giá gốc: {cruise.originalPrice}</span>
              )}
              <span className={styles.salePrice}>Giảm còn: {cruise.salePrice}</span>
            </div>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Số Tầng</span>
                <span className={styles.specValue}>{cruise.floors}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Sức Chứa</span>
                <span className={styles.specValue}>{cruise.capacity} người</span>
              </div>
            </div>

            {!showBooking ? (
              <>
                <button
                  onClick={() => setShowBooking(true)}
                  className={styles.ctaBtn}
                  style={{ border: "none", cursor: "pointer", width: "100%", textAlign: "center" }}
                >
                  🎟️ Đặt Lịch Ngay
                </button>
                <a href="tel:0796768636" className={styles.zaloBtn}>
                  📞 Gọi: 0796.768.636
                </a>
                <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer"
                  className={styles.zaloBtn} style={{ marginTop: "0.5rem" }}>
                  💬 Đặt Qua Zalo
                </a>
              </>
            ) : (
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>📋 Điền thông tin đặt lịch</span>
                  <button
                    onClick={() => setShowBooking(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "1.1rem" }}
                  >✕</button>
                </div>
                <BookingForm cruiseSlug={cruise.slug} cruiseName={cruise.name} />
              </div>
            )}
          </div>

          {/* Related cruises */}
          {relatedCruises.length > 0 && (
            <div className={styles.relatedCard}>
              <h4 className={styles.relatedTitle}>Du Thuyền Tương Tự</h4>
              {relatedCruises.map(r => (
                <Link key={r.slug} href={`/du-thuyen/${r.slug}`} className={styles.relatedItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.mainImage} alt={r.name} className={styles.relatedImg} />
                  <div className={styles.relatedInfo}>
                    <p className={styles.relatedName}>{r.name}</p>
                    <div className={styles.relatedPriceRow}>
                      {r.originalPrice && r.originalPrice !== r.salePrice && (
                        <span className={styles.relatedOriginal}>{r.originalPrice}</span>
                      )}
                      <span className={styles.relatedPrice}>{r.salePrice}</span>
                    </div>
                    <span className={styles.relatedCta}>Xem chi tiết →</span>
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
