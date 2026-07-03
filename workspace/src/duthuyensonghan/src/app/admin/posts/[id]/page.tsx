"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "../../admin.module.css";
import ImageUpload from "@/components/ImageUpload";
import { FormInput, FormSelect, FormTextarea } from "@/components/Admin/FormComponents";

const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        border: "1.5px solid #e2e8f0",
        borderRadius: "12px",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
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
  { id: "tin-tuc", label: "Tin Tức" },
  { id: "kinh-nghiem", label: "Kinh Nghiệm" },
  { id: "gia-ve", label: "Giá Vé" },
  { id: "phao-hoa", label: "Pháo Hoa" },
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

  const [form, setForm] = useState<PostForm>(emptyForm);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data: Post) => {
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          thumbnail: data.thumbnail,
          categoryId: data.categoryId,
          status: data.status,
        });
        setContent(data.content);
        setSlugManuallyEdited(true); // don't auto-generate slug for existing posts
      });
  }, [id, isNew]);

  function set<K extends keyof PostForm>(key: K, val: PostForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugManuallyEdited) {
      set("slug", slugify(title));
    }
  }

  function handleSlugChange(slug: string) {
    setSlugManuallyEdited(true);
    set("slug", slug);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    const payload = { ...form, content };

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/posts" : `/api/posts/${id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (res.ok) {
      setMsg({ type: "success", text: isNew ? "Đã tạo bài viết mới!" : "Đã cập nhật bài viết!" });
      if (isNew) {
        setTimeout(() => router.push("/admin/posts"), 1200);
      }
    } else {
      const d = await res.json();
      setMsg({ type: "error", text: d.error ?? "Có lỗi xảy ra!" });
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {isNew ? "✍️ Thêm Bài Viết" : "✏️ Sửa Bài Viết"}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
            {isNew
              ? "Điền thông tin để tạo bài viết mới"
              : `Đang chỉnh sửa: ${form.title}`}
          </p>
        </div>
        <div className={styles.pageActions}>
          {!isNew && form.status === "published" && (
            <a
              href={`/bai-viet/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className={styles.btnSecondary}
            >
              👁️ Xem trang
            </a>
          )}
          <Link href="/admin/posts" className={styles.btnSecondary}>
            ← Quay lại
          </Link>
        </div>
      </div>

      {msg.text && (
        <p
          className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1.5rem" }}
        >
          {msg.type === "error" ? "⚠️ " : "✅ "}
          {msg.text}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* ── Thông tin cơ bản ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>📋 Thông tin cơ bản</h3>
          <div className={styles.formGrid}>
            <FormInput
              label="Tiêu Đề"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              required
              className={styles.fullWidth}
            />
            <FormInput
              label="Slug (URL)"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="slug-bai-viet"
              required
              helpText={`URL: /bai-viet/${form.slug || "slug-bai-viet"}`}
            />
            <FormSelect
              label="Danh Mục"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              options={CATEGORIES.map((c) => ({ label: c.label, value: c.id }))}
            />
            <FormTextarea
              label="Mô Tả Ngắn (Excerpt)"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Mô tả ngắn về bài viết, hiển thị ở trang danh sách..."
              rows={3}
              className={styles.fullWidth}
            />
          </div>
        </div>

        {/* ── Ảnh đại diện ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>🖼️ Ảnh Đại Diện</h3>
          <ImageUpload
            label="Ảnh thumbnail bài viết"
            value={form.thumbnail}
            onChange={(url) => set("thumbnail", url)}
          />
        </div>

        {/* ── Nội dung ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>✍️ Nội Dung Bài Viết</h3>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#64748b",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}
          >
            Soạn thảo nội dung bài viết. Có thể kéo thả ảnh hoặc dán ảnh trực tiếp vào editor.
          </p>
          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Bắt đầu soạn thảo nội dung bài viết..."
            minHeight={500}
          />
        </div>

        {/* ── Trạng thái ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>⚙️ Trạng Thái Xuất Bản</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: `2px solid ${form.status === "published" ? "#01bf93" : "#e2e8f0"}`,
                background: form.status === "published" ? "#f0fdf9" : "#fff",
                transition: "all 0.2s",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: form.status === "published" ? "#065f46" : "#64748b",
              }}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: `2px solid ${form.status === "draft" ? "#f59e0b" : "#e2e8f0"}`,
                background: form.status === "draft" ? "#fffbeb" : "#fff",
                transition: "all 0.2s",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: form.status === "draft" ? "#92400e" : "#64748b",
              }}
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
            {loading ? "Đang lưu..." : isNew ? "➕ Tạo Bài Viết" : "💾 Lưu Thay Đổi"}
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
