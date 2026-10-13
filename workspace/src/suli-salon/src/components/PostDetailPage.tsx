import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import type { PostData } from "@/lib/db";

const CATEGORY_LABELS: Record<string, string> = {
    "tin-tuc": "Tin tức",
    "kinh-nghiem": "Kinh nghiệm làm đẹp",
    "gia-ve": "Bảng giá",
    "phao-hoa": "Ưu đãi",
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}

export default function PostDetailPage({ post }: { post: PostData }) {
    const content = DOMPurify.sanitize(post.content);

    return (
        <main style={{ background: "#FDFBF7", minHeight: "100vh", padding: "120px 24px 100px" }}>
            <article style={{ maxWidth: 840, margin: "0 auto" }}>
                <Link href="/bai-viet" style={{ color: "#A08040", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textDecoration: "none", textTransform: "uppercase" }}>← Quay lại bài viết</Link>
                <div style={{ marginTop: 32, textAlign: "center" }}>
                    <p style={{ color: "#C2A979", fontFamily: "Montserrat,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", margin: "0 0 16px" }}>{CATEGORY_LABELS[post.categoryId] || "Chia sẻ"} · {formatDate(post.createdAt)}</p>
                    <h1 style={{ color: "#2E2E2E", fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,6vw,62px)", fontStyle: "italic", lineHeight: 1.12, margin: "0 0 20px" }}>{post.title}</h1>
                    {post.excerpt && <p style={{ color: "#6B6B6B", fontFamily: "Montserrat,sans-serif", fontSize: 17, lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 660 }}>{post.excerpt}</p>}
                </div>

                {post.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail} alt={post.title} style={{ display: "block", width: "100%", maxHeight: 500, objectFit: "cover", marginBottom: 44 }} />
                )}

                {content ? (
                    <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <p style={{ color: "#777", fontFamily: "Montserrat,sans-serif", fontSize: 16, lineHeight: 1.8, textAlign: "center", padding: "36px 0" }}>Nội dung bài viết đang được cập nhật.</p>
                )}
            </article>
            <style>{`
                .post-content { color: #3A3A3A; font-family: Montserrat, sans-serif; font-size: 16px; line-height: 1.85; }
                .post-content h1, .post-content h2, .post-content h3 { color: #2E2E2E; font-family: 'Playfair Display', serif; line-height: 1.25; margin: 1.6em 0 .65em; }
                .post-content h2 { font-size: 30px; }
                .post-content h3 { font-size: 24px; }
                .post-content p { margin: 0 0 1.25em; }
                .post-content img { display: block; max-width: 100%; height: auto; margin: 28px auto; }
                .post-content a { color: #A08040; }
                .post-content ul, .post-content ol { margin: 0 0 1.4em; padding-left: 1.5em; }
                .post-content blockquote { border-left: 3px solid #C2A979; color: #6B6B6B; font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; margin: 1.7em 0; padding-left: 22px; }
            `}</style>
        </main>
    );
}
