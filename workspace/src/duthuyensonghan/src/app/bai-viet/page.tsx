import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCruises, getPosts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Bài Viết – Du Thuyền Sông Hàn Đà Nẵng | 2Da Tickets",
  description:
    "Tin tức, kinh nghiệm và thông tin hữu ích về du thuyền sông Hàn Đà Nẵng. Cập nhật giá vé, lịch trình và các sự kiện pháo hoa mới nhất.",
};

const CATEGORY_LABELS: Record<string, string> = {
  "tin-tuc": "Tin Tức",
  "kinh-nghiem": "Kinh Nghiệm",
  "gia-ve": "Giá Vé",
  "phao-hoa": "Pháo Hoa",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BaiVietPage() {
  const allCruises = getCruises();
  const allPosts = getPosts().filter((p) => p.status === "published");

  // Featured cruises for sidebar
  const featuredCruises = allCruises.slice(0, 4);

  // Recent posts for sidebar (first 5)
  const recentPosts = allPosts.slice(0, 5);

  // Category counts
  const categoryCounts = allPosts.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className={styles.page}>
      {/* ── HERO ── */}
      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/banner_desktop.webp"
          alt="Bài viết du thuyền sông Hàn"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>Blog & Tin Tức</span>
          <h1 className={styles.heroTitle}>Bài Viết Du Thuyền Sông Hàn</h1>
          <p className={styles.heroSub}>
            Kinh nghiệm, giá vé và thông tin hữu ích về du thuyền Đà Nẵng
          </p>
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
            <span>Bài Viết</span>
          </div>

          <h2 className={styles.pageHeading}>Tất Cả Bài Viết</h2>

          {allPosts.length > 0 ? (
            <div className={styles.postGrid}>
              {allPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/bai-viet/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postCardImg}>
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnail} alt={post.title} />
                    ) : (
                      <div className={styles.postCardImgPlaceholder}>📝</div>
                    )}
                    <span className={styles.categoryBadge}>
                      {CATEGORY_LABELS[post.categoryId] ?? post.categoryId}
                    </span>
                  </div>
                  <div className={styles.postCardBody}>
                    <div className={styles.postMeta}>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className={styles.postMetaDot} />
                      <span>{CATEGORY_LABELS[post.categoryId] ?? post.categoryId}</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    {post.excerpt && (
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                    )}
                    <span className={styles.readMore}>Đọc thêm →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Chưa có bài viết nào được xuất bản.</p>
            </div>
          )}
        </div>

        {/* ════ RIGHT: Sidebar ════ */}
        <aside className={styles.sidebar}>

          {/* Categories */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>🗂️ Danh Mục</div>
            <div className={styles.catList}>
              {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                <Link key={id} href={`/bai-viet?category=${id}`} className={styles.catItem}>
                  <span>{label}</span>
                  <span className={styles.catCount}>{categoryCounts[id] ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <div className={styles.sideWidget}>
              <div className={styles.sideWidgetTitle}>📰 Bài Viết Mới Nhất</div>
              <div className={styles.recentList}>
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/bai-viet/${post.slug}`}
                    className={styles.recentPost}
                  >
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className={styles.recentPostImg}
                      />
                    ) : (
                      <div className={styles.recentPostImgPlaceholder}>📝</div>
                    )}
                    <div className={styles.recentPostInfo}>
                      <p className={styles.recentPostTitle}>{post.title}</p>
                      <p className={styles.recentPostDate}>{formatDate(post.createdAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured cruises */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>🚢 Du Thuyền Nổi Bật</div>
            <div className={styles.sideCruiseList}>
              {featuredCruises.map((c) => (
                <Link
                  key={c.slug}
                  href={`/du-thuyen/${c.slug}`}
                  className={styles.sideCruise}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.mainImage}
                    alt={c.name}
                    className={styles.sideCruiseImg}
                  />
                  <div className={styles.sideCruiseInfo}>
                    <p className={styles.sideCruiseName}>{c.name}</p>
                    <p className={styles.sideCruisePrice}>{c.salePrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick booking */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetTitle}>🎟️ Đặt Lịch Nhanh</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", padding: "1rem" }}>
              <a
                href="tel:0796768636"
                style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg,var(--primary),#00a87c)",
                  color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                  padding: "0.75rem", borderRadius: "8px",
                  boxShadow: "0 3px 12px rgba(1,191,147,0.3)",
                }}
              >
                📞 Gọi: 0796.768.636
              </a>
              <a
                href="https://zalo.me/0796768636"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block", textAlign: "center",
                  background: "#0068FF", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                  padding: "0.7rem", borderRadius: "8px",
                }}
              >
                💬 Nhắn Zalo ngay
              </a>
              <Link
                href="/dat-lich"
                style={{
                  display: "block", textAlign: "center",
                  background: "#fff", color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem",
                  padding: "0.7rem", borderRadius: "8px",
                  border: "1.5px solid var(--primary)",
                }}
              >
                📋 Đặt lịch online
              </Link>
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}
