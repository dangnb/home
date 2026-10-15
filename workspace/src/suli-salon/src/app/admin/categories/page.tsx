"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { MdAdd, MdCategory, MdEdit, MdDeleteOutline, MdArrowBack, MdLanguage } from "react-icons/md";
import { confirmAction } from "@/lib/confirmDialog";

interface Category {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const { locale, t, tOther, splitBilingual, joinBilingual } = useAdminLocale();
  const [activeLang, setActiveLang] = useState<"vi" | "en">(locale);

  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [id, setId] = useState("");
  const [slug, setSlug] = useState("");
  const [labelVi, setLabelVi] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [descVi, setDescVi] = useState("");
  const [descEn, setDescEn] = useState("");

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setCats(Array.isArray(data) ? data : []))
      .catch(() => setCats([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  function autoSlug(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function resetForm() {
    setEditing(null);
    setId("");
    setSlug("");
    setLabelVi("");
    setLabelEn("");
    setDescVi("");
    setDescEn("");
  }

  async function handleSave() {
    const fullLabel = joinBilingual(labelVi, labelEn);
    const fullDesc = joinBilingual(descVi, descEn);

    if (!fullLabel || !slug) {
      return flash("error", "Tên danh mục và đường dẫn slug là bắt buộc.");
    }

    const payload = {
      id: id || slug,
      label: fullLabel,
      slug,
      description: fullDesc,
    };

    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/categories/${editing}` : "/api/categories";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      flash("success", editing ? "Đã cập nhật danh mục thành công!" : "Đã thêm danh mục mới thành công!");
      resetForm();
      fetch("/api/categories").then((r) => r.json()).then(setCats);
    } else {
      const d = await res.json().catch(() => ({}));
      flash("error", d.error || "Không thể lưu danh mục dịch vụ. Vui lòng kiểm tra lại thông tin.");
    }
  }

  async function handleDelete(idToDelete: string) {
    const ok = await confirmAction({
      title: "Xóa danh mục?",
      text: "Bạn có chắc chắn muốn xóa danh mục này? Các dịch vụ thuộc danh mục có thể bị ảnh hưởng.",
      confirmButtonText: "Xóa danh mục",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/categories/${idToDelete}`, { method: "DELETE" });
      if (res.ok) {
        flash("success", "Đã xóa danh mục dịch vụ thành công!");
        setCats((prev) => prev.filter((c) => c.id !== idToDelete));
      } else {
        const d = await res.json().catch(() => ({}));
        flash("error", d.error || "Không thể xóa danh mục này. Có thể danh mục đang chứa các dịch vụ liên kết.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi xóa danh mục.");
    }
  }

  function startEdit(cat: Category) {
    setEditing(cat.id);
    setId(cat.id);
    setSlug(cat.slug);

    const labelParts = splitBilingual(cat.label);
    setLabelVi(labelParts.vi);
    setLabelEn(labelParts.en);

    const descParts = splitBilingual(cat.description);
    setDescVi(descParts.vi);
    setDescEn(descParts.en);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Danh mục dịch vụ</h1>
          <p className={styles.pageSubtitle}>Phân loại các nhóm liệu trình để khách hàng dễ dàng tra cứu trên website.</p>
        </div>
        <Link href="/admin" className={styles.btnSecondary}>
          <MdArrowBack size={15} />
          <span>Về tổng quan</span>
        </Link>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Form */}
      <div className={styles.formCard} style={{ marginBottom: "1.8rem" }}>
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
            {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
                boxShadow: activeLang === "vi" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
              }}
            >
              🇻🇳 Tiếng Việt {labelVi ? "✓" : ""}
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
                boxShadow: activeLang === "en" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
              }}
            >
              🇬🇧 English {labelEn ? "✓" : ""}
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          {editing && (
            <div className={styles.formField}>
              <label>Mã định danh (ID)</label>
              <input value={id} disabled style={{ background: "rgba(194, 169, 121, 0.08)" }} />
            </div>
          )}

          {activeLang === "vi" ? (
            <div className={styles.formField}>
              <label>Tên danh mục (Tiếng Việt) <span style={{ color: "#C0392B" }}>*</span></label>
              <input
                value={labelVi}
                onChange={(e) => {
                  setLabelVi(e.target.value);
                  if (!editing && !labelEn) setSlug(autoSlug(e.target.value));
                }}
                placeholder="VD: Nail Art Nghệ Thuật"
              />
            </div>
          ) : (
            <div className={styles.formField}>
              <label>Category Label (English) <span style={{ color: "#C0392B" }}>*</span></label>
              <input
                value={labelEn}
                onChange={(e) => {
                  setLabelEn(e.target.value);
                  if (!editing && !labelVi) setSlug(autoSlug(e.target.value));
                }}
                placeholder="e.g. Nail Art Design"
              />
            </div>
          )}

          <div className={styles.formField}>
            <label>Đường dẫn Slug (URL) <span style={{ color: "#C0392B" }}>*</span></label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: nail-art"
            />
          </div>

          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label>{activeLang === "vi" ? "Mô tả nhóm dịch vụ (Tiếng Việt)" : "Description (English)"}</label>
            {activeLang === "vi" ? (
              <textarea
                value={descVi}
                onChange={(e) => setDescVi(e.target.value)}
                placeholder="Giới thiệu sơ lược về nhóm dịch vụ này..."
                rows={2}
              />
            ) : (
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Brief introduction about this category in English..."
                rows={2}
              />
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button type="button" onClick={handleSave} className={styles.btnPrimary}>
            <MdAdd size={16} />
            <span>{editing ? "Cập nhật danh mục" : "Thêm danh mục"}</span>
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className={styles.btnSecondary}
            >
              Hủy bỏ
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Tất cả danh mục" : `Tất cả danh mục (${cats.length})`}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "12px", color: "#857567", fontWeight: 600 }}>Ngôn ngữ:</span>
            <AdminLanguageSelector compact light />
          </div>
        </div>
        {isInitialLoading ? (
          <AdminLoading variant="table" label="Đang tải danh sách danh mục..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Mã ID</th>
                  <th>Tên danh mục</th>
                  <th>Đường dẫn Slug</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <code
                        style={{
                          background: "rgba(194, 169, 121, 0.12)",
                          color: "#967840",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {cat.id}
                      </code>
                    </td>
                    <td>
                      <strong style={{ color: "#231B15" }}>{t(cat.label)}</strong>
                      {tOther(cat.label) && (
                        <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2 }}>
                          {locale === "vi" ? "EN: " : "VI: "}{tOther(cat.label)}
                        </div>
                      )}
                    </td>
                    <td style={{ color: "#78695C", fontSize: 13 }}>{cat.slug}</td>
                    <td style={{ color: "#857567", fontSize: "13px", maxWidth: 300 }}>
                      {t(cat.description) || "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className={styles.btnSecondary}
                          style={{ padding: "4px 8px" }}
                          title="Chỉnh sửa"
                        >
                          <MdEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className={styles.btnDanger}
                          style={{ padding: "4px 8px" }}
                          title="Xóa danh mục"
                        >
                          <MdDeleteOutline size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
