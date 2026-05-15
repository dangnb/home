"use client";

import styles from "./page.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

interface PriceItem { label: string; price: string; }
interface Post { id: string; title: string; slug: string; }

interface Props {
  fireworksPrices: PriceItem[];
  fireworksNote: string;
  recentPosts: Post[];
  hotline: string;
  zalo: string;
}

export default function PhaoHoaClient({ fireworksPrices, fireworksNote, recentPosts, hotline, zalo }: Props) {
  const phoneDisplay = hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3");

  return (
    <main className={styles.container}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/phaohoatuocte.jpg"
          alt="Lễ hội pháo hoa quốc tế Đà Nẵng"
          className={styles.heroImage}
        />

        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {fireworksPrices.map((p, i) => (
            <motion.div
              key={i}
              className={styles.ticketCard}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              <h2 className={styles.ticketTitle}>{p.label}</h2>
              <p className={styles.ticketPrice}>{p.price}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Main Layout: 2 columns */}
      <div className={styles.mainLayout}>

        {/* Left Column */}
        <div className={styles.mainContent}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            LỊCH THI ĐẤU LỄ HỘI PHÁO HOA QUỐC TẾ ĐÀ NẴNG - DIFF 2026
          </motion.h2>

          <motion.img
            src="/images/phaohoatuocte.jpg"
            alt="DIFF Poster"
            className={styles.posterImage}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          />

          <motion.div
            className={styles.textBlock}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {fireworksNote && <p>{fireworksNote}</p>}
            <br />
            <p>
              Lễ hội Pháo hoa Quốc tế Đà Nẵng 2026 sẽ diễn ra từ ngày 30/05 đến 11/07/2026, kéo dài trong 6 đêm thi vào thứ Bảy hàng tuần với chủ đề <strong>"Đà Nẵng – Những chân trời kết nối"</strong>.
            </p>
            <br />
            <h3 style={{ color: "var(--primary)", marginBottom: "10px" }}>Lịch trình các đêm bắn pháo hoa:</h3>
            <ul>
              <li><strong>Đêm 1 (30/5/2026):</strong> Chủ đề "Thiên Nhiên" – Đội Đà Nẵng (Việt Nam) và Trung Quốc.</li>
              <li><strong>Đêm 2 (6/6/2026):</strong> Chủ đề "Di Sản" – Đội Z21 (Việt Nam) và Pháp.</li>
              <li><strong>Đêm 3 (13/6/2026):</strong> Chủ đề "Văn Hoá" – Đội Nhật Bản và Ý.</li>
              <li><strong>Đêm 4 (20/6/2026):</strong> Chủ đề "Sáng Tạo" – Đội Đức và Ma Cao.</li>
              <li><strong>Đêm 5 (27/6/2026):</strong> Chủ đề "Tầm Nhìn" – Đội Úc và Bồ Đào Nha.</li>
              <li><strong>Đêm 6 (11/7/2026):</strong> Chủ đề "Đà Nẵng – Những chân trời kết nối" – CHUNG KẾT.</li>
            </ul>
            <br />
            <h3 style={{ color: "var(--primary)", marginBottom: "10px" }}>Lịch trình chung khi xem pháo hoa trên du thuyền:</h3>
            <ul>
              <li><strong>16h30 – 17h30:</strong> Đón khách tại Cảng Sông Thu cũ (dưới chân cầu Trần Thị Lý)</li>
              <li><strong>17h30 – 19h00:</strong> Du ngoạn sông Hàn, ngắm hoàng hôn, thưởng thức bữa tối.</li>
              <li><strong>19h00 – 20h00:</strong> Múa Chămpa, giao lưu âm nhạc, karaoke.</li>
              <li><strong>20h00 – 21h30:</strong> Thưởng thức pháo hoa từ vị trí đặc biệt trên sông Hàn.</li>
              <li><strong>21h30 – 22h00:</strong> Du thuyền đưa khách về bến.</li>
            </ul>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className={styles.sidebar}>
          {/* Đặt lịch nhanh */}
          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>🎟️ Đặt Lịch Nhanh</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.75rem" }}>
              <a href={`tel:${hotline}`} style={{
                display: "block", textAlign: "center",
                background: "linear-gradient(135deg,var(--primary),#00a87c)",
                color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                padding: "0.75rem", borderRadius: "8px",
                boxShadow: "0 3px 12px rgba(1,191,147,0.3)",
              }}>
                📞 Gọi: {phoneDisplay}
              </a>
              <a href={zalo} target="_blank" rel="noreferrer" style={{
                display: "block", textAlign: "center",
                background: "#0068FF", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                padding: "0.7rem", borderRadius: "8px",
              }}>
                💬 Nhắn Zalo ngay
              </a>
              <Link href="/dat-lich" style={{
                display: "block", textAlign: "center",
                background: "#fff", color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem",
                padding: "0.7rem", borderRadius: "8px",
                border: "1.5px solid var(--primary)",
              }}>
                📋 Đặt lịch online
              </Link>
            </div>
          </div>

          {/* Tin tức gần đây từ backend */}
          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>📰 Tin Tức Gần Đây</h3>
            {recentPosts.length > 0 ? (
              <ul className={styles.recentPosts}>
                {recentPosts.map(p => (
                  <li key={p.id}>
                    <Link href={`/bai-viet/${p.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ padding: "0.75rem", fontSize: "0.82rem", color: "#94a3b8" }}>
                Chưa có tin tức nào.
              </p>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}
