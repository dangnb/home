"use client";
import Link from "next/link";
import { DEFAULT_POSTS, type PostData } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPostPath, getLocalizedText } from "@/lib/i18n/routes";

const CATEGORY_LABELS: Record<string, { vi: string; en: string }> = {
    "xu-huong": { vi: "Xu hướng Nail Art", en: "Nail Trends" },
    "kinh-nghiem": { vi: "Bí quyết làm đẹp", en: "Beauty Tips" },
    "cham-soc": { vi: "Chăm sóc & Dưỡng móng", en: "Nail Care" },
    "tin-tuc": { vi: "Tin tức & Salon", en: "News & Events" },
    "uu-dai": { vi: "Ưu đãi đặc quyền", en: "Special Offers" },
    "gia-ve": { vi: "Bảng giá", en: "Pricing" },
    "phao-hoa": { vi: "Ưu đãi", en: "Special Offers" },
};

function formatDate(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
        day: "2-digit",
        month: locale === "en" ? "short" : "long",
        year: "numeric",
    }).format(new Date(date));
}

export default function PostListPage({ posts }: { posts: PostData[] }) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const effectivePosts = posts && posts.length > 0 ? posts : DEFAULT_POSTS;

    return (
        <main style={{ background: "#FDFBF7", minHeight: "100vh", paddingTop: 92 }}>
            <section style={{ background: "#F4F1EA", padding: "88px 24px 76px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: 360, height: 360, border: "1px solid rgba(194,169,121,.16)", borderRadius: "50%", top: -170, right: -110 }} />
                <div style={{ position: "absolute", width: 240, height: 240, border: "1px solid rgba(194,169,121,.12)", borderRadius: "50%", bottom: -150, left: -70 }} />
                <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
                    <p style={{ color: "#C2A979", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 16px" }}>
                        {isEn ? "Beauty Inspiration" : "Cảm hứng làm đẹp"}
                    </p>
                    <h1 style={{ color: "#2E2E2E", fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,6vw,68px)", fontStyle: "italic", margin: "0 0 18px", lineHeight: 1.1 }}>
                        {isEn ? "Beauty Journal" : "Góc chia sẻ"}
                    </h1>
                    <p style={{ color: "#6B6B6B", fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.75, margin: 0 }}>
                        {isEn ? "Trends, nail-care secrets, and beauty stories from Mộc Salon." : "Cập nhật xu hướng, bí quyết chăm sóc móng và những câu chuyện làm đẹp từ Mộc Salon."}
                    </p>
                </div>
            </section>

            <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 100px" }}>
                {effectivePosts.length === 0 ? (
                    <div style={{ background: "#F4F1EA", padding: "72px 24px", textAlign: "center", borderRadius: 16 }}>
                        <div style={{ fontSize: 34, marginBottom: 14 }}>✦</div>
                        <h2 style={{ color: "#2E2E2E", fontFamily: "'Playfair Display',serif", fontSize: 28, fontStyle: "italic", margin: "0 0 12px" }}>
                            {isEn ? "No articles yet" : "Chưa có bài viết"}
                        </h2>
                        <p style={{ color: "#777", fontFamily: "Montserrat,sans-serif", fontSize: 14, margin: 0 }}>
                            {isEn ? "The latest beauty articles will be published here soon." : "Những nội dung làm đẹp mới nhất sẽ sớm được cập nhật tại đây."}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
                        {effectivePosts.map((post) => {
                            const postHref = getLocalizedPostPath(locale, post.slug);
                            const categoryLabel = CATEGORY_LABELS[post.categoryId]?.[locale] || (isEn ? "Article" : "Chia sẻ");

                            return (
                                <article key={post.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(224, 216, 204, 0.5)", boxShadow: "0 8px 24px rgba(0,0,0,.04)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform .3s ease, box-shadow .3s ease" }}>
                                    <Link href={postHref} style={{ display: "block", height: 230, background: "#EAE5DC", textDecoration: "none" }}>
                                        {post.thumbnail ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={post.thumbnail} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .35s" }} />
                                        ) : (
                                            <div style={{ height: "100%", background: "linear-gradient(135deg,#E7D9BE,#A08040)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 44 }}>✦</div>
                                        )}
                                    </Link>
                                    <div style={{ padding: "26px 24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                                        <div style={{ color: "#C2A979", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>
                                            {categoryLabel} · {formatDate(post.createdAt, locale)}
                                        </div>
                                        <h2 style={{ color: "#2E2E2E", fontFamily: "'Playfair Display',serif", fontSize: 25, lineHeight: 1.25, margin: "0 0 14px" }}>
                                            {getLocalizedText(post.title, locale)}
                                        </h2>
                                        <p style={{ color: "#777", fontFamily: "Montserrat,sans-serif", fontSize: 14, lineHeight: 1.7, margin: "0 0 22px", flex: 1 }}>
                                            {getLocalizedText(post.excerpt, locale) || (isEn ? "Explore beauty tips and artistry from Mộc Salon." : "Khám phá những chia sẻ và cảm hứng làm đẹp từ Mộc Salon.")}
                                        </p>
                                        <Link href={postHref} style={{ color: "#A08040", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textDecoration: "none", textTransform: "uppercase" }}>
                                            {isEn ? "Read more →" : "Đọc thêm →"}
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
