"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "../../admin.module.css";
import ImageUpload from "@/components/ImageUpload";
import { FormInput, FormSelect, FormTextarea } from "@/components/Admin/FormComponents";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale } from "@/components/Admin/AdminLocaleContext";
import { MdEdit, MdAdd, MdVisibility, MdPublic, MdDrafts, MdCheck, MdArrowBack, MdLanguage } from "react-icons/md";

const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        border: "1.5px solid rgba(194,169,121,0.15)",
        borderRadius: "12px",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "0.875rem",
        background: "#fafafa",
      }}
    >
      Đang tải trình soạn thảo...
    </div>
  ),
});

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  categoryId: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { id: "tin-tuc", label: "News" },
  { id: "kinh-nghiem", label: "Tips & Guides" },
  { id: "gia-ve", label: "Pricing" },
  { id: "phao-hoa", label: "Promotions" },
];

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  categoryId: string;
  status: "published" | "draft";
}

const emptyForm: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  categoryId: "tin-tuc",
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const { locale, t, splitBilingual, joinBilingual } = useAdminLocale();
  const [activeLang, setActiveLang] = useState<"vi" | "en">(locale);

  const [form, setForm] = useState<PostForm>(emptyForm);
  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptVi, setExcerptVi] = useState("");
  const [excerptEn, setExcerptEn] = useState("");

  const [content, setContent] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!isNew);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;

    fetch(`/api/posts/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Post not found");
        return r.json();
      })
      .then((data: Post) => {
        setForm({
          slug: data.slug,
          thumbnail: data.thumbnail,
          categoryId: data.categoryId,
          status: data.status,
        });

        const titleParts = splitBilingual(data.title);
        setTitleVi(titleParts.vi);
        setTitleEn(titleParts.en);

        const excerptParts = splitBilingual(data.excerpt);
        setExcerptVi(excerptParts.vi);
        setExcerptEn(excerptParts.en);

        setContent(data.content);
        setSlugManuallyEdited(true); // don't auto-generate slug for existing posts
      })
      .catch(() => setMsg({ type: "error", text: "Không thể tải bài viết. Vui lòng thử lại." }))
      .finally(() => setIsInitialLoading(false));
  }, [id, isNew, splitBilingual]);

  function set<K extends keyof PostForm>(key: K, val: PostForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSlugChange(slug: string) {
    setSlugManuallyEdited(true);
    set("slug", slug);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    const fullTitle = joinBilingual(titleVi, titleEn);
    const fullExcerpt = joinBilingual(excerptVi, excerptEn);

    if (!fullTitle) {
      setMsg({ type: "error", text: "Vui lòng nhập tiêu đề bài viết (ít nhất một ngôn ngữ)." });
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      title: fullTitle,
      excerpt: fullExcerpt,
      slug: form.slug || slugify(titleVi || titleEn),
      content,
    };

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/posts" : `/api/posts/${id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (res.ok) {
      setMsg({ type: "success", text: isNew ? "Đã tạo bài viết mới thành công!" : "Đã cập nhật bài viết thành công!" });
      if (isNew) {
        setTimeout(() => router.push("/admin/posts"), 1200);
      }
    } else {
      const d = await res.json();
      setMsg({ type: "error", text: d.error ?? "Có lỗi xảy ra!" });
    }
  }

  if (isInitialLoading) {
    return <AdminLoading variant="form" label="Đang tải bài viết..." />;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {isNew ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#888", marginTop: "0.25rem" }}>
            {isNew
              ? "Soạn thảo bài viết mới cho trang tin tức của salon"
              : `Đang chỉnh sửa: ${titleVi || titleEn || form.slug}`}
          </p>
        </div>
        <div className={styles.pageActions}>
          {!isNew && form.status === "published" && (
            <a
              href={`/bai-viet/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className={styles.btnSecondary}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <MdVisibility size={15} />
              <span>Xem bài viết</span>
            </a>
          )}
          <Link href="/admin/posts" className={styles.btnSecondary} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <MdArrowBack size={15} />
            <span>Quay lại</span>
          </Link>
        </div>
      </div>

      {msg.text && (
        <p
          className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1.5rem" }}
        >
          {msg.text}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* ── Thông tin cơ bản ── */}
        <div className={styles.formCard}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: "1.2rem",
            paddingBottom: "0.8rem",
            borderBottom: "1px solid rgba(194, 169, 121, 0.22)"
          }}>
            <h3 className={styles.cardSectionTitle} style={{ margin: 0, border: "none", padding: 0 }}>
              📋 Thông tin cơ bản & Tiêu đề
            </h3>

            <div style={{
              display: "inline-flex",
              padding: "3px",
              background: "rgba(194, 169, 121, 0.12)",
              borderRadius: "20px",
              border: "1px solid rgba(194, 169, 121, 0.35)",
              gap: "3px"
            }}>
              <button
                type="button"
                onClick={() => setActiveLang("vi")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeLang === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                  color: activeLang === "vi" ? "#FFFFFF" : "#78695C",
                }}
              >
                🇻🇳 Tiếng Việt {titleVi ? "✓" : ""}
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeLang === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                  color: activeLang === "en" ? "#FFFFFF" : "#78695C",
                }}
              >
                🇬🇧 English {titleEn ? "✓" : ""}
              </button>
            </div>
          </div>

          <div className={styles.formGrid}>
            {activeLang === "vi" ? (
              <FormInput
                label="Tiêu Đề (Tiếng Việt)"
                value={titleVi}
                onChange={(e) => {
                  setTitleVi(e.target.value);
                  if (!slugManuallyEdited && !titleEn) {
                    set("slug", slugify(e.target.value));
                  }
                }}
                placeholder="VD: 5 Xu Hướng Móng Mắt Mèo Sang Trọng Nhất 2025"
                required
                className={styles.fullWidth}
              />
            ) : (
              <FormInput
                label="Post Title (English)"
                value={titleEn}
                onChange={(e) => {
                  setTitleEn(e.target.value);
                  if (!slugManuallyEdited && !titleVi) {
                    set("slug", slugify(e.target.value));
                  }
                }}
                placeholder="e.g. Top 5 Cat Eye Nail Trends for 2025"
                required
                className={styles.fullWidth}
              />
            )}

            <FormInput
              label="Slug (URL)"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="slug-bai-viet"
              required
              helpText={`URL: /bai-viet/${form.slug || "slug-bai-viet"}`}
            />
            <FormSelect
              label="Chuyên mục"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              options={CATEGORIES.map((c) => ({ label: c.label, value: c.id }))}
            />

            {activeLang === "vi" ? (
              <FormTextarea
                label="Mô Tả Tóm Tắt (Excerpt - Tiếng Việt)"
                value={excerptVi}
                onChange={(e) => setExcerptVi(e.target.value)}
                placeholder="Tóm tắt ngắn về bài viết để hiển thị trên danh sách và thẻ chia sẻ..."
                rows={3}
                className={styles.fullWidth}
              />
            ) : (
              <FormTextarea
                label="Short Excerpt (English)"
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Short summary of this article in English..."
                rows={3}
                className={styles.fullWidth}
              />
            )}
          </div>
        </div>

        {/* ── Ảnh đại diện ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>🖼️ Ảnh Đại Diện</h3>
          <ImageUpload
            label="Ảnh thumbnail post"
            value={form.thumbnail}
            onChange={(url) => set("thumbnail", url)}
          />
        </div>

        {/* ── Nội dung ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>✍️ Nội Dung Posts</h3>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#888",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}
          >
            Soạn thảo nội dung post. Có thể kéo thả ảnh hoặc dán ảnh trực tiếp vào editor.
          </p>
          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Bắt đầu soạn thảo nội dung post..."
            minHeight={500}
          />
        </div>

        {/* ── Status ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>Trạng thái xuất bản</h3>
          <div className={styles.actionGroup}>
            <label
              className={`${styles.statusChoice} ${form.status === "published" ? styles.statusChoiceActive : ""}`}
            >
              <input
                type="radio"
                name="status"
                value="published"
                checked={form.status === "published"}
                onChange={() => set("status", "published")}
                style={{ display: "none" }}
              />
              🌐 Xuất Bản
            </label>
            <label
              className={`${styles.statusChoice} ${form.status === "draft" ? styles.statusChoiceActive : ""}`}
            >
              <input
                type="radio"
                name="status"
                value="draft"
                checked={form.status === "draft"}
                onChange={() => set("status", "draft")}
                style={{ display: "none" }}
              />
              📋 Bản Nháp
            </label>
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "2rem" }}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
            style={{ padding: "0.7rem 1.75rem", fontSize: "0.95rem" }}
          >
            {loading ? "Đang lưu..." : isNew ? "Tạo bài viết" : "Lưu thay đổi"}
          </button>
          <Link
            href="/admin/posts"
            className={styles.btnSecondary}
            style={{ padding: "0.7rem 1.25rem" }}
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
