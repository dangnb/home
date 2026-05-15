import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getCruises, getPosts, getPostBySlug, getSettings } from "@/lib/db";
import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  return {
    title: `${post.title} – Du Thuyền Sông Hàn | 2Da Tickets`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const allCruises = getCruises();
  const allPosts = getPosts().filter((p) => p.status === "published");

  // Related posts: same category, excluding current
  const relatedPosts = allPosts
    .filter((p) => p.categoryId === post.categoryId && p.id !== post.id)
    .slice(0, 3);

  // Recent posts for sidebar
  const recentPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 5);

  // Featured cruises for sidebar
  const featuredCruises = allCruises.slice(0, 4);

  const s = getSettings();
  const phoneDisplay = s.hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1.$2.$3");

  return (
    <main className={styles.page}>
      {/* ── HERO ── */}
      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnail || "/images/banner_desktop.webp"}
          alt={post.title}
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>
            {CATEGORY_LABELS[post.categoryId] ?? post.categoryId}
          </span>
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <div className={styles.heroMeta}>
            <span>{formatDate(post.createdAt)}</span>
            <span className={styles.heroMetaDot} />
            <span>{CATEGORY_LABELS[post.categoryId] ?? post.categoryId}</span>
          </div>
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
            <Link href="/bai-viet">Bài Viết</Link>
            <span> / </span>
            <span>{post.title}</span>
          </div>

          {/* Article */}
          <article className={styles.article}>
            <div className={styles.articleHeader}>
              <div className={styles.articleMeta}>
                <span className={styles.articleCategoryBadge}>
                  {CATEGORY_LABELS[post.categoryId] ?? post.categoryId}
                </span>
                <span className={styles.articleMetaDot} />
                <span>{formatDate(post.createdAt)}</span>
                {post.updatedAt !== post.createdAt && (
                  <>
                    <span className={styles.articleMetaDot} />
                    <span>Cập nhật: {formatDate(post.updatedAt)}</span>
                  </>
                )}
              </div>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              {post.excerpt && (
                <p className={styles.articleExcerpt}>{post.excerpt}</p>
              )}
            </div>

            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className={styles.articleFooter}>
              <Link href="/bai-viet" className={styles.backLink}>
                ← Quay lại danh sách bài viết
              </Link>
            </div>
          </article>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Bài Viết Liên Quan</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/bai-viet/${related.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedCardImg}>
                      {related.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={related.thumbnail} alt={related.title} />
                      ) : (
                        <div className={styles.relatedCardImgPlaceholder}>📝</div>
                      )}
                    </div>
                    <div className={styles.relatedCardBody}>
                      <p className={styles.relatedCardTitle}>{related.title}</p>
                      <p className={styles.relatedCardDate}>{formatDate(related.createdAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ════ RIGHT: Sidebar ════ */}
        <aside className={styles.sidebar}>

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <div className={styles.sideWidget}>
              <div className={styles.sideWidgetTitle}>📰 Bài Viết Mới Nhất</div>
              <div className={styles.sidePostList}>
                {recentPosts.map((p) => (
                  <Link key={p.id} href={`/bai-viet/${p.slug}`} className={styles.sidePost}>
                    <div className={styles.sidePostDot} />
                    <span>{p.title}</span>
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
                href={`tel:${s.hotline}`}
                style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg,var(--primary),#00a87c)",
                  color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                  padding: "0.75rem", borderRadius: "8px",
                  boxShadow: "0 3px 12px rgba(1,191,147,0.3)",
                }}
              >
                📞 Gọi: {phoneDisplay}
              </a>
              <a
                href={s.zalo}
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
