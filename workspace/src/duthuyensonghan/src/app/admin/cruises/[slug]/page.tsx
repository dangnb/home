"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "../../admin.module.css";
import ImageUpload from "@/components/ImageUpload";
import GalleryUpload from "@/components/GalleryUpload";

const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", minHeight: "400px",
      display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8",
      fontSize: "0.875rem", background: "#fafafa" }}>
      Đang tải trình soạn thảo...
    </div>
  ),
});

interface Category { id: string; label: string; }
interface Tour { name: string; icon: string; schedule: string[]; }
interface Cruise {
  slug: string; name: string; categoryId: string; badge: string; tagline: string;
  originalPrice: string; salePrice: string; floors: number; capacity: number;
  mainImage: string; gallery: string[]; highlights: string[]; description: string;
  tours: Tour[]; includes: string[]; relatedSlugs: string[];
}

const empty: Cruise = {
  slug: "", name: "", categoryId: "regular", badge: "", tagline: "",
  originalPrice: "", salePrice: "", floors: 2, capacity: 0,
  mainImage: "", gallery: [], highlights: [], description: "",
  tours: [], includes: [], relatedSlugs: [],
};

export default function CruiseFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [form, setForm] = useState<Cruise>(empty);
  const [cats, setCats] = useState<Category[]>([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);

  // Single unified content editor (HTML)
  const [contentHtml, setContentHtml] = useState("");

  // Gallery as array (replaces galInput textarea)
  const [gallery, setGallery] = useState<string[]>([]);
  const [relInput, setRelInput] = useState("");
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCats);
    params.then(({ slug }) => {
      if (slug === "new") { setIsNew(true); return; }
      setIsNew(false);
      fetch(`/api/cruises/${slug}`).then(r => r.json()).then((data: Cruise) => {
        setForm(data);
        // Build unified content from existing fields
        setContentHtml(buildUnifiedContent(data));
        setGallery(data.gallery ?? []);
        setRelInput(data.relatedSlugs.join("\n"));
      });
    });
  }, [params]);

  /** Convert existing plain-text fields → rich HTML for the editor */
  function buildUnifiedContent(data: Cruise): string {
    const parts: string[] = [];

    if (data.description) {
      parts.push(`<h2>Giới thiệu tổng quan</h2>`);
      // If already HTML, use as-is; otherwise wrap paragraphs
      if (data.description.startsWith("<")) {
        parts.push(data.description);
      } else {
        data.description.split("\n\n").filter(Boolean).forEach(p => {
          parts.push(`<p>${p}</p>`);
        });
      }
    }

    if (data.highlights?.length) {
      parts.push(`<h2>Điểm nổi bật</h2>`);
      parts.push(`<ul>${data.highlights.map(h => `<li>${h}</li>`).join("")}</ul>`);
    }

    if (data.includes?.length) {
      parts.push(`<h2>Dịch vụ bao gồm</h2>`);
      parts.push(`<ul>${data.includes.map(i => `<li>${i}</li>`).join("")}</ul>`);
    }

    return parts.join("\n");
  }

  function flash(type: string, text: string) { setMsg({ type, text }); }
  function set(key: keyof Cruise, val: unknown) { setForm(p => ({ ...p, [key]: val })); }

  /** Parse unified HTML back into separate fields for backward compat */
  function parseUnifiedContent(html: string): { description: string; highlights: string[]; includes: string[] } {
    // Store full HTML as description, extract lists for highlights/includes
    const parser = typeof window !== "undefined" ? new DOMParser() : null;
    if (!parser) return { description: html, highlights: [], includes: [] };

    const doc = parser.parseFromString(html, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2"));

    let description = html;
    let highlights: string[] = [];
    let includes: string[] = [];

    headings.forEach(h => {
      const text = h.textContent?.toLowerCase() ?? "";
      const next = h.nextElementSibling;
      if (text.includes("nổi bật") && next?.tagName === "UL") {
        highlights = Array.from(next.querySelectorAll("li")).map(li => li.textContent?.trim() ?? "").filter(Boolean);
      }
      if ((text.includes("dịch vụ") || text.includes("bao gồm")) && next?.tagName === "UL") {
        includes = Array.from(next.querySelectorAll("li")).map(li => li.textContent?.trim() ?? "").filter(Boolean);
      }
    });

    return { description: html, highlights, includes };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { description, highlights, includes } = parseUnifiedContent(contentHtml);

    const payload: Cruise = {
      ...form,
      description,
      highlights,
      includes,
      gallery: gallery,
      relatedSlugs: relInput.split("\n").map(s => s.trim()).filter(Boolean),
    };

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/cruises" : `/api/cruises/${form.slug}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (res.ok) {
      flash("success", isNew ? "Đã tạo mới du thuyền!" : "Đã cập nhật!");
      if (isNew) setTimeout(() => router.push("/admin/cruises"), 1200);
    } else {
      const d = await res.json();
      flash("error", d.error ?? "Lỗi!");
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{isNew ? "Thêm Du Thuyền" : "Sửa Du Thuyền"}</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
            {isNew ? "Điền thông tin để tạo du thuyền mới" : `Đang chỉnh sửa: ${form.name}`}
          </p>
        </div>
        <div className={styles.pageActions}>
          {!isNew && (
            <a href={`/du-thuyen/${form.slug}`} target="_blank" rel="noreferrer" className={styles.btnSecondary}>
              👁️ Xem trang
            </a>
          )}
          <Link href="/admin/cruises" className={styles.btnSecondary}>← Quay lại</Link>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1.5rem" }}>
          {msg.type === "error" ? "⚠️ " : "✅ "}{msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── Thông tin cơ bản ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>📋 Thông tin cơ bản</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Slug (URL duy nhất) *</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)}
                placeholder="thao-nhi-yatch" required disabled={!isNew} />
              {!isNew && <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Không thể đổi slug sau khi tạo</span>}
            </div>
            <div className={styles.formField}>
              <label>Tên Du Thuyền *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Du Thuyền Thảo Nhi Yatch" required />
            </div>
            <div className={styles.formField}>
              <label>Danh Mục</label>
              <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Badge (nhãn nhỏ)</label>
              <input value={form.badge} onChange={e => set("badge", e.target.value)}
                placeholder="Du thuyền nhà hàng" />
            </div>
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>Tagline (khẩu hiệu)</label>
              <input value={form.tagline} onChange={e => set("tagline", e.target.value)}
                placeholder="Biệt Thự Di Động – Đẳng Cấp 5 Sao" />
            </div>
          </div>
        </div>

        {/* ── Giá & Thông số ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>💰 Giá & Thông số</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Giá Gốc</label>
              <input value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)}
                placeholder="1.500.000 ₫" />
            </div>
            <div className={styles.formField}>
              <label>Giá Sale *</label>
              <input value={form.salePrice} onChange={e => set("salePrice", e.target.value)}
                placeholder="900.000 ₫" required />
            </div>
            <div className={styles.formField}>
              <label>Số Tầng</label>
              <input type="number" value={form.floors} onChange={e => set("floors", +e.target.value)} min={1} />
            </div>
            <div className={styles.formField}>
              <label>Sức Chứa (người)</label>
              <input type="number" value={form.capacity} onChange={e => set("capacity", +e.target.value)} min={1} />
            </div>
          </div>
        </div>

        {/* ── Hình ảnh đại diện ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>🖼️ Ảnh đại diện & Thư viện</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ImageUpload
              label="Ảnh Đại Diện"
              value={form.mainImage}
              onChange={url => set("mainImage", url)}
            />
            <GalleryUpload
              label="Thư Viện Ảnh"
              value={gallery}
              onChange={setGallery}
            />
          </div>
        </div>

        {/* ── NỘI DUNG BÀI VIẾT — EDITOR DUY NHẤT ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>✍️ Nội dung bài viết</h3>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem", lineHeight: 1.6 }}>
            Soạn thảo toàn bộ nội dung trong 1 editor. Dùng <strong>Tiêu đề 2</strong> để phân chia các phần
            (Giới thiệu, Điểm nổi bật, Dịch vụ...). Có thể <strong>kéo thả ảnh</strong> hoặc <strong>dán ảnh</strong> trực tiếp vào editor.
          </p>
          <RichEditor
            value={contentHtml}
            onChange={setContentHtml}
            placeholder="Bắt đầu soạn thảo nội dung bài viết du thuyền... Dùng Tiêu đề 2 để tạo các phần: Giới thiệu, Điểm nổi bật, Dịch vụ bao gồm..."
            minHeight={500}
          />
        </div>

        {/* ── Liên kết ── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardSectionTitle}>🔗 Du thuyền liên quan</h3>
          <div className={styles.formField}>
            <label>Slug du thuyền liên quan <span style={{ fontWeight: 400, color: "#94a3b8" }}>(mỗi slug một dòng)</span></label>
            <textarea value={relInput} onChange={e => setRelInput(e.target.value)} rows={3}
              placeholder={"du-thuyen-poseidon-cruise\ntau-rong-song-han"} />
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "2rem" }}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}
            style={{ padding: "0.7rem 1.75rem", fontSize: "0.95rem" }}>
            {loading ? "Đang lưu..." : (isNew ? "➕ Tạo Mới" : "💾 Lưu Thay Đổi")}
          </button>
          <Link href="/admin/cruises" className={styles.btnSecondary} style={{ padding: "0.7rem 1.25rem" }}>
            Hủy
          </Link>
        </div>

      </form>
    </div>
  );
}
