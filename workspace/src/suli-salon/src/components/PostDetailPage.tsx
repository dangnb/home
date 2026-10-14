"use client";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import type { PostData } from "@/lib/db";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalizedPath, getLocalizedText, getLocalizedContent } from "@/lib/i18n/routes";

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

export default function PostDetailPage({ post }: { post: PostData }) {
    const { locale } = useLocale();
    const isEn = locale === "en";
    const localizedTitle = getLocalizedText(post.title, locale);
    const localizedExcerpt = getLocalizedText(post.excerpt, locale);
    const content = DOMPurify.sanitize(getLocalizedContent(post.content, locale));
    const categoryLabel = CATEGORY_LABELS[post.categoryId]?.[locale] || (isEn ? "Article" : "Chia sẻ");
    const postsHref = getLocalizedPath(locale, "posts");

    return (
        <main style={{ background: "#FDFBF7", minHeight: "100vh", padding: "120px 24px 100px" }}>
            <article style={{ maxWidth: 840, margin: "0 auto" }}>
                <Link href={postsHref} style={{ color: "#A08040", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textDecoration: "none", textTransform: "uppercase" }}>
                    {isEn ? "← Back to journal" : "← Quay lại bài viết"}
                </Link>
                <div style={{ marginTop: 32, textAlign: "center" }}>
                    <p style={{ color: "#C2A979", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", margin: "0 0 16px" }}>
                        {categoryLabel} · {formatDate(post.createdAt, locale)}
                    </p>
                    <h1 style={{ color: "#2E2E2E", fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,6vw,62px)", fontStyle: "italic", lineHeight: 1.12, margin: "0 0 20px" }}>
                        {localizedTitle}
                    </h1>
                    {localizedExcerpt && <p style={{ color: "#6B6B6B", fontFamily: "Montserrat,sans-serif", fontSize: 17, lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 660 }}>{localizedExcerpt}</p>}
                </div>

                {post.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail} alt={localizedTitle} style={{ display: "block", width: "100%", maxHeight: 500, objectFit: "cover", marginBottom: 44, borderRadius: 16, boxShadow: "0 12px 36px rgba(0,0,0,0.08)" }} />
                )}

                {content ? (
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <p style={{ color: "#777", fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.8, textAlign: "center", padding: "36px 0" }}>
                        {isEn ? "Article content is being updated." : "Nội dung bài viết đang được cập nhật."}
                    </p>
                )}

                {/* Salon CTA Card */}
                <div style={{ marginTop: 64, padding: "48px 36px", background: "linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%)", borderRadius: 20, border: "1.5px solid rgba(194, 169, 121, 0.35)", textAlign: "center", boxShadow: "0 8px 30px rgba(194, 169, 121, 0.12)" }}>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#C2A979", marginBottom: 12 }}>
                        ✦ Mộc Salon Experience
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,3.5vw,34px)", fontStyle: "italic", color: "#2E2E2E", margin: "0 0 16px" }}>
                        {isEn ? "Ready to Transform Your Nails?" : "Sẵn sàng làm mới bộ móng của bạn?"}
                    </h3>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 28px" }}>
                        {isEn ? "Book an appointment today and let our certified nail artists bring your dream design to life." : "Đặt lịch hẹn ngay hôm nay để được các chuyên viên Mộc Salon chăm sóc và thiết kế mẫu móng mang dấu ấn riêng của bạn."}
                    </p>
                    <Link href={getLocalizedPath(locale, "booking")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#C2A979,#a08040)", color: "#fff", padding: "15px 36px", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none", borderRadius: 40, boxShadow: "0 6px 20px rgba(194,169,121,.35)", transition: "all .3s ease" }}>
                        {isEn ? "Book Appointment →" : "Đặt lịch hẹn ngay →"}
                    </Link>
                </div>
            </article>
            <style>{`
                .post-content { color: #3A3A3A; font-family: Montserrat, sans-serif; font-size: 16px; line-height: 1.85; }
                .post-content h1, .post-content h2, .post-content h3 { color: #2E2E2E; font-family: 'Playfair Display', serif; line-height: 1.25; margin: 1.6em 0 .65em; }
                .post-content h2 { font-size: 30px; }
                .post-content h3 { font-size: 24px; }
                .post-content p { margin: 0 0 1.25em; }
                .post-content img { display: block; max-width: 100%; height: auto; margin: 28px auto; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
                .post-content a { color: #A08040; }
                .post-content ul, .post-content ol { margin: 0 0 1.4em; padding-left: 1.5em; }
                .post-content blockquote { border-left: 3px solid #C2A979; color: #6B6B6B; font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin: 1.7em 0; padding-left: 22px; background: rgba(194, 169, 121, 0.06); padding-top: 14px; padding-bottom: 14px; border-radius: 0 10px 10px 0; }
            `}</style>
        </main>
    );
}
