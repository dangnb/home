import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCruises } from "@/lib/db";

export const metadata: Metadata = {
  title: "Giá Vé Du Thuyền Sông Hàn Đà Nẵng 2025 – 2Da Tickets",
  description: "Bảng giá vé du thuyền sông Hàn Đà Nẵng cập nhật mới nhất. Giảm ngay 30% khi đặt tại 2Da Tickets.",
};

function CruiseCard({ cruise }: {
  cruise: { name: string; slug: string; originalPrice: string; salePrice: string; mainImage: string; categoryId: string }
}) {
  const isVip = cruise.categoryId === "vip";
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
        <h3 className={styles.cardName}>{cruise.name}</h3>
        <div className={styles.cardPrice}>
          {hasSale && <span className={styles.originalPrice}>{cruise.originalPrice}</span>}
          <span className={isVip ? styles.salePriceVip : styles.salePrice}>{cruise.salePrice}</span>
        </div>
        <span className={styles.cardCta}>Xem chi tiết →</span>
      </div>
    </Link>
  );
}

export default function GiaVePage() {
  const allCruises = getCruises();
  const regular = allCruises.filter(c => c.categoryId === "regular");
  const dinner = allCruises.filter(c => c.categoryId === "dinner");
  const vip = allCruises.filter(c => c.categoryId === "vip");

  return (
    <main className={styles.page}>
      {/* Hero */}
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

      {/* Benefits */}
      <div className={styles.benefitsBar}>
        <div className={`container ${styles.benefitsGrid}`}>
          {[
            { icon: "🏷️", title: "Giảm Ngay 30%", desc: "So với giá niêm yết tại bến" },
            { icon: "🎟️", title: "Giữ chỗ Miễn Phí", desc: "Không cần cọc trước" },
            { icon: "🔄", title: "Đổi / Hoàn Linh Hoạt", desc: "Đổi chuyến trước 60 phút" },
            { icon: "🚢", title: "Đón Tận Nơi", desc: "Trực tiếp dẫn lên thuyền" },
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

      <div className={`container ${styles.content}`}>

        {/* Không ăn tối */}
        {regular.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Du Thuyền Không Nhà Hàng</div>
              <h2 className={styles.sectionTitle}>Giá Vé Du Thuyền Không Ăn Tối</h2>
              <p className={styles.sectionDesc}>Giá niêm yết tại bến: <strong>150.000đ</strong>. Đặt tại 2Da Tickets được giảm còn:</p>
              <div className={styles.priceTags}>
                <span className={styles.priceTag}>Chuyến thường: <strong>99.000đ</strong></span>
                <span className={styles.priceTag}>Cầu Rồng phun lửa: <strong>120.000đ</strong></span>
              </div>
            </div>
            <div className={styles.grid}>
              {regular.map(c => <CruiseCard key={c.slug} cruise={c} />)}
            </div>
          </section>
        )}

        {/* Có ăn tối */}
        {dinner.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Du Thuyền 5★ Nhà Hàng</div>
              <h2 className={styles.sectionTitle}>Giá Vé Du Thuyền Có Ăn Tối</h2>
              <p className={styles.sectionDesc}>Phù hợp cho tiệc công ty, gala dinner, hẹn hò. Chia làm 2 loại:</p>
              <div className={styles.priceTags}>
                <span className={styles.priceTag}>Suất menu: <strong>300.000đ – 600.000đ</strong></span>
                <span className={styles.priceTag}>Buffet: <strong>600.000đ – 1.000.000đ</strong></span>
              </div>
            </div>
            <div className={styles.grid}>
              {dinner.map(c => <CruiseCard key={c.slug} cruise={c} />)}
            </div>
          </section>
        )}

        {/* VIP */}
        {vip.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge} style={{ background: "linear-gradient(135deg,#d4af37,#f5c842)", color: "#333" }}>⭐ Đẳng Cấp VIP</div>
              <h2 className={styles.sectionTitle}>Du Thuyền Hạng VIP – Biệt Thự Di Động</h2>
              <p className={styles.sectionDesc}>Không gian riêng tư – dịch vụ 5 sao độc quyền trên sông Hàn</p>
            </div>
            <div className={styles.grid}>
              {vip.map(c => <CruiseCard key={c.slug} cruise={c} />)}
            </div>
          </section>
        )}

        {/* Pháo hoa */}
        <section className={styles.fireworksSection}>
          <div className={styles.fireworksBg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/phaohoatuocte.jpg" alt="Pháo hoa" className={styles.fireworksBgImg} />
            <div className={styles.fireworksOverlay} />
          </div>
          <div className={styles.fireworksContent}>
            <span className={styles.heroBadge}>Sự kiện đặc biệt</span>
            <h2 className={styles.fireworksTitle}>Giá Vé Xem Pháo Hoa DIFF Đà Nẵng</h2>
            <p className={styles.fireworksDesc}>Đặt vé sớm để nhận ưu đãi tốt nhất! Càng gần ngày vé càng cao.</p>
            <div className={styles.fireworksPrices}>
              <div className={styles.fireworksPriceCard}>
                <span className={styles.fpLabel}>Suất cơ bản (Cơm gà, Mì Quảng)</span>
                <span className={styles.fpPrice}>700.000đ – 1.200.000đ</span>
              </div>
              <div className={styles.fireworksPriceCard}>
                <span className={styles.fpLabel}>Buffet cao cấp</span>
                <span className={styles.fpPrice}>1.500.000đ – 4.000.000đ</span>
              </div>
            </div>
            <Link href="/phao-hoa" className={styles.fireworksBtn}>Xem Chi Tiết Pháo Hoa →</Link>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Cần tư vấn thêm? Liên hệ ngay!</h3>
          <p className={styles.ctaDesc}>Nhân viên 2Da Tickets sẽ tư vấn đúng nhu cầu và giá vé phù hợp nhất cho bạn.</p>
          <div className={styles.ctaBtns}>
            <a href="tel:0796768636" className={styles.btnCall}>📞 Gọi Ngay: 0796.768.636</a>
            <a href="https://zalo.me/0796768636" target="_blank" rel="noreferrer" className={styles.btnZalo}>💬 Nhắn Zalo</a>
          </div>
        </section>

      </div>
    </main>
  );
}
