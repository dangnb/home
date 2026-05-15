import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCruises, getPricing } from "@/lib/db";

export const metadata: Metadata = {
  title: "Giá Vé Du Thuyền Sông Hàn Đà Nẵng 2025 – 2Da Tickets",
  description: "Bảng giá vé du thuyền sông Hàn Đà Nẵng cập nhật mới nhất. Giảm ngay 30% khi đặt tại 2Da Tickets.",
};

export default function GiaVePage() {
  const allCruises = getCruises();
  const pricing = getPricing();

  const regular = allCruises.filter(c => c.categoryId === "regular");
  const dinner  = allCruises.filter(c => c.categoryId === "dinner");
  const vip     = allCruises.filter(c => c.categoryId === "vip");

  // Featured cruises for sidebar (first 4)
  const featured = allCruises.slice(0, 4);

  return (
    <main className={styles.page}>
      {/* ── HERO ── */}
      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/banner_desktop.webp" alt="Giá vé" className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>Cập nhật 2025</span>
          <h1 className={styles.heroTitle}>Bảng Giá Vé Du Thuyền Sông Hàn</h1>
          <p className={styles.heroSub}>Giảm ngay 30% • Giữ chỗ miễn phí • Hoàn hủy linh hoạt</p>
        </div>
      </div>

      {/* ── BENEFITS BAR ── */}
      <div className={styles.benefitsBar}>
        <div className={`container ${styles.benefitsGrid}`}>
          {[
            { icon: "🏷️", title: "Giảm Ngay 30%",        desc: "So với giá niêm yết tại bến" },
            { icon: "🎟️", title: "Giữ chỗ Miễn Phí",     desc: "Không cần cọc trước" },
            { icon: "🔄", title: "Đổi / Hoàn Linh Hoạt", desc: "Đổi chuyến trước 60 phút" },
            { icon: "🚢", title: "Đón Tận Nơi",           desc: "Trực tiếp dẫn lên thuyền" },
          ].map(b => (
            <div key={b.title} className={styles.benefit}>
              <span className={styles.benefitIcon}>{b.icon}</span>
              <div>
                <strong>{b.title}</strong>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN 2-COL LAYOUT ── */}
      <div className={`container ${styles.layout}`}>

        {/* ════ LEFT: Main content ════ */}
        <div className={styles.mainCol}>

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/">Trang chủ</Link>
            <span> / </span>
            <span>Giá Vé Du Thuyền Sông Hàn</span>
          </div>

          <h2 className={styles.pageHeading}>Giá Vé Du Thuyền Sông Hàn</h2>

          {/* ── Không ăn tối ── */}
          {regular.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionLabel}>Du Thuyền Không Nhà Hàng</div>
              <h3 className={styles.sectionTitle}>Giá Vé Du Thuyền Không Ăn Tối</h3>
              <p className={styles.sectionNote}>{pricing.regularNote}</p>

              {/* Price table */}
              <div className={styles.priceTable}>
                {pricing.regularPrices.map((p, i) => (
                  <div key={i} className={styles.priceRow}>
                    <span className={styles.priceRowLabel}>{p.label}</span>
                    <span className={styles.priceRowValue}>{p.price}</span>
                  </div>
                ))}
              </div>

              {/* Cruise cards */}
              <div className={styles.cruiseGrid}>
                {regular.map(c => (
                  <CruiseCard key={c.slug} cruise={c} />
                ))}
              </div>
            </section>
          )}

          {/* ── Có ăn tối ── */}
          {dinner.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionLabel}>Du Thuyền 5★ Nhà Hàng</div>
              <h3 className={styles.sectionTitle}>Giá Vé Du Thuyền Có Ăn Tối</h3>
              <p className={styles.sectionNote}>{pricing.dinnerNote}</p>

              <div className={styles.priceTable}>
                {pricing.dinnerPrices.map((p, i) => (
                  <div key={i} className={styles.priceRow}>
                    <span className={styles.priceRowLabel}>{p.label}</span>
                    <span className={styles.priceRowValue}>{p.price}</span>
                  </div>
                ))}
              </div>

              <div className={styles.cruiseGrid}>
                {dinner.map(c => (
                  <CruiseCard key={c.slug} cruise={c} />
                ))}
              </div>
            </section>
          )}

          {/* ── VIP ── */}
          {vip.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionLabel} style={{ background: "linear-gradient(135deg,#d4af37,#f5c842)", color: "#333" }}>
                ⭐ Đẳng Cấp VIP
              </div>
              <h3 className={styles.sectionTitle}>Du Thuyền Hạng VIP – Biệt Thự Di Động</h3>
              <p className={styles.sectionNote}>Không gian riêng tư – dịch vụ 5 sao độc quyền trên sông Hàn</p>
              <div className={styles.cruiseGrid}>
                {vip.map(c => (
                  <CruiseCard key={c.slug} cruise={c} isVip />
                ))}
              </div>
            </section>
          )}

          {/* ── Pháo hoa ── */}
          <section className={styles.fireworksSection}>
            <div className={styles.fireworksBg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/phaohoatuocte.jpg" alt="Pháo hoa" className={styles.fireworksBgImg} />
              <div className={styles.fireworksOverlay} />
            </div>
            <div className={styles.fireworksContent}>
              <span className={styles.heroBadge}>Sự kiện đặc biệt</span>
              <h3 className={styles.fireworksTitle}>Giá Vé Xem Pháo Hoa DIFF Đà Nẵng</h3>
              <p className={styles.fireworksDesc}>{pricing.fireworksNote}</p>
              <div className={styles.fireworksPrices}>
                {pricing.fireworksPrices.map((p, i) => (
                  <div key={i} className={styles.fireworksPriceCard}>
                    <span className={styles.fpLabel}>{p.label}</span>
                    <span className={styles.fpPrice}>{p.price}</span>
                  </div>
                ))}
              </div>
              <Link href="/phao-hoa" className={styles.fireworksBtn}>Xem Chi Tiết Pháo Hoa →</Link>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>Cần tư vấn thêm? Liên hệ ngay!</h3>
            <p className={styles.ctaDesc}>Nhân viên 2Da Tickets sẽ tư vấn đúng nhu cầu và giá vé phù hợp nhất cho bạn.</p>
            <div className={styles.ctaBtns}>
              <a href="tel:0796768636" className={styles.btnCall}>📞 Gọi Ngay: 0796.768.636</a>
              <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer" className={styles.btnZalo}>💬 Nhắn Zalo</a>
            </div>
          </section>

        </div>

        {/* ════ RIGHT: Sidebar ════ */}
        <aside className={styles.sidebar}>

          {/* Video */}
          <div className={styles.sideWidget}>
            <div className={styles.videoWrap}>
              <iframe
                src="https://www.youtube.com/embed/dQ3TjZ_lQ0Q?rel=0"
                title="Du Thuyền Sông Hàn"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Đặt lịch nhanh */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>🎟️ Đặt Lịch Nhanh</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a href="tel:0796768636" className={styles.sideCallBtn}>
                📞 Gọi: 0796.768.636
              </a>
              <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer" className={styles.sideZaloBtn}>
                💬 Nhắn Zalo ngay
              </a>
              <Link href="/dat-lich" className={styles.sideBookBtn}>
                📋 Đặt lịch online
              </Link>
            </div>
          </div>

          {/* Bài viết mới */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>📰 Bài Viết Mới Cập Nhật</div>
            <div className={styles.sidePostList}>
              {[
                { title: "Giá Vé Du Thuyền Sông Hàn 2025", href: "/gia-ve" },
                { title: "Kinh nghiệm đặt vé tránh bị lừa đảo", href: "/gia-ve" },
                { title: "Top du thuyền nhà hàng tốt nhất", href: "/gia-ve" },
                { title: "Hướng dẫn di chuyển đến bến du thuyền", href: "/gia-ve" },
              ].map((p, i) => (
                <Link key={i} href={p.href} className={styles.sidePost}>
                  <div className={styles.sidePostDot} />
                  <span>{p.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Du thuyền nổi bật */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>🚢 Du Thuyền Nổi Bật</div>
            <div className={styles.sideCruiseList}>
              {featured.map(c => (
                <Link key={c.slug} href={`/du-thuyen/${c.slug}`} className={styles.sideCruise}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.mainImage} alt={c.name} className={styles.sideCruiseImg} />
                  <div className={styles.sideCruiseInfo}>
                    <p className={styles.sideCruiseName}>{c.name}</p>
                    <p className={styles.sideCruisePrice}>{c.salePrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}

// ── Cruise Card Component ──────────────────────────────────────────────────
function CruiseCard({ cruise, isVip = false }: {
  cruise: { name: string; slug: string; originalPrice: string; salePrice: string; mainImage: string; categoryId: string };
  isVip?: boolean;
}) {
  const hasSale = cruise.originalPrice && cruise.originalPrice !== cruise.salePrice;
  return (
    <Link href={`/du-thuyen/${cruise.slug}`} className={`${styles.card} ${isVip ? styles.vipCard : ""}`}>
      <div className={styles.cardImg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cruise.mainImage} alt={cruise.name} />
        {hasSale && <span className={styles.saleBadge}>Sale!</span>}
        {isVip && <span className={styles.vipBadge}>⭐ VIP</span>}
      </div>
      <div className={styles.cardBody}>
        <h4 className={styles.cardName}>{cruise.name}</h4>
        <div className={styles.cardPrice}>
          {hasSale && <span className={styles.originalPrice}>{cruise.originalPrice}</span>}
          <span className={isVip ? styles.salePriceVip : styles.salePrice}>{cruise.salePrice}</span>
        </div>
        <span className={styles.cardCta}>Xem chi tiết →</span>
      </div>
    </Link>
  );
}
