"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdAdd, MdCategory, MdEdit, MdDeleteOutline, MdArrowBack } from "react-icons/md";

interface Category {
  id: string;
  label: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({ id: "", label: "", slug: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
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

  async function handleSave() {
    if (!form.label || !form.slug) return flash("error", "Tên danh mục và đường dẫn slug là bắt buộc");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/categories/${editing}` : "/api/categories";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      flash("success", editing ? "Đã cập nhật danh mục thành công!" : "Đã thêm danh mục mới thành công!");
      setEditing(null);
      setForm({ id: "", label: "", slug: "", description: "" });
      fetch("/api/categories").then((r) => r.json()).then(setCats);
    } else {
      const d = await res.json();
      flash("error", d.error || "Có lỗi xảy ra khi lưu");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này? Các dịch vụ thuộc danh mục có thể bị ảnh hưởng.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    flash("success", "Đã xóa danh mục thành công!");
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  function startEdit(cat: Category) {
    setEditing(cat.id);
    setForm({ id: cat.id, label: cat.label, slug: cat.slug, description: cat.description });
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
        <h3 className={styles.cardSectionTitle}>{editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h3>
        <div className={styles.formGrid}>
          {editing && (
            <div className={styles.formField}>
              <label>Mã định danh (ID)</label>
              <input value={form.id} disabled style={{ background: "rgba(194, 169, 121, 0.08)" }} />
            </div>
          )}
          <div className={styles.formField}>
            <label>Tên danh mục</label>
            <input
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="VD: Nail Art Nghệ Thuật"
            />
          </div>
          <div className={styles.formField}>
            <label>Đường dẫn Slug (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="VD: nail-art"
            />
          </div>
          <div className={`${styles.formField} ${editing ? "" : styles.fullWidth}`}>
            <label>Mô tả ngắn</label>
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả phong cách và đặc trưng của nhóm liệu trình này..."
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1.2rem" }}>
          <button type="button" onClick={handleSave} className={styles.btnPrimary}>
            <MdAdd size={16} />
            <span>{editing ? "Lưu cập nhật" : "Thêm danh mục"}</span>
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ id: "", label: "", slug: "", description: "" });
              }}
              className={styles.btnSecondary}
            >
              Hủy bỏ
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Tất cả danh mục" : `Tất cả danh mục (${cats.length})`}
          </span>
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
                      <strong style={{ color: "#231B15" }}>{cat.label}</strong>
                    </td>
                    <td style={{ color: "#78695C", fontSize: 13 }}>{cat.slug}</td>
                    <td style={{ color: "#857567", fontSize: "13px", maxWidth: 300 }}>
                      {cat.description || "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className={styles.btnEdit}
                          title="Chỉnh sửa danh mục"
                        >
                          <MdEdit size={14} />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className={styles.btnDanger}
                          title="Xóa danh mục"
                        >
                          <MdDeleteOutline size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cats.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className={styles.emptyState}>
                        <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
                        <span>Chưa có danh mục nào. Hãy tạo danh mục đầu tiên ở trên!</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
