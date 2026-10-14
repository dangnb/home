"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";

interface Category { id: string; label: string; slug: string; description: string; }

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({ id: "", label: "", slug: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then(async r => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then(data => setCats(Array.isArray(data) ? data : []))
      .catch(() => setCats([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) { setMsg({ type, text }); setTimeout(() => setMsg({ type: "", text: "" }), 3000); }

  async function handleSave() {
    if (!form.label || !form.slug) return flash("error", "Tên và slug là bắt buộc");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/categories/${editing}` : "/api/categories";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      flash("success", editing ? "Updated!" : "Added!");
      setEditing(null); setForm({ id: "", label: "", slug: "", description: "" });
      fetch("/api/categories").then(r => r.json()).then(setCats);
    } else { const d = await res.json(); flash("error", d.error); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete danh mục này?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    flash("success", "Deleted!");
    setCats(prev => prev.filter(c => c.id !== id));
  }

  function startEdit(cat: Category) { setEditing(cat.id); setForm({ id: cat.id, label: cat.label, slug: cat.slug, description: cat.description }); }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Danh mục dịch vụ</h1>
          <p className={styles.pageSubtitle}>Sắp xếp các nhóm dịch vụ để khách dễ tìm kiếm.</p>
        </div>
        <Link href="/admin" className={styles.btnSecondary}>← Về tổng quan</Link>
      </div>

      {msg.text && <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{marginBottom:'1rem'}}>{msg.text}</p>}

      {/* Form */}
      <div className={styles.formCard} style={{marginBottom:'1.5rem'}}>
        <h3 className={styles.cardSectionTitle}>{editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h3>
        <div className={styles.formGrid}>
          {editing && (
            <div className={styles.formField}>
              <label>ID</label>
              <input value={form.id} disabled />
            </div>
          )}
          <div className={styles.formField}>
            <label>Tên Categories</label>
            <input value={form.label} onChange={e => setForm(p => ({...p, label: e.target.value}))} placeholder="e.g. Nail Art" />
          </div>
          <div className={styles.formField}>
            <label>Slug (URL)</label>
            <input value={form.slug} onChange={e => setForm(p => ({...p, slug: e.target.value}))} placeholder="nail-art" />
          </div>
          <div className={styles.formField}>
            <label>Mô tả ngắn</label>
            <input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Mô tả..." />
          </div>
        </div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem'}}>
          <button onClick={handleSave} className={styles.btnPrimary}>{editing ? "Lưu cập nhật" : "Thêm danh mục"}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ id:"",label:"",slug:"",description:"" }); }} className={styles.btnSecondary}>Hủy</button>}
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
          <AdminLoading variant="table" label="Đang tải danh mục..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <code style={{ background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: 4 }}>
                        {cat.id}
                      </code>
                    </td>
                    <td>
                      <strong>{cat.label}</strong>
                    </td>
                    <td style={{ color: "#888" }}>{cat.slug}</td>
                    <td style={{ color: "#aaa", fontSize: "0.85rem" }}>{cat.description}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEdit(cat)} className={styles.btnEdit}>
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className={styles.btnDanger}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {cats.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗂️</div>
                      Chưa có danh mục nào.
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
