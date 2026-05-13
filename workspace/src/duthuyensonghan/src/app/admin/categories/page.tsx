"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

interface Category { id: string; label: string; slug: string; description: string; }

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({ id: "", label: "", slug: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { fetch("/api/categories").then(r => r.json()).then(setCats); }, []);

  function flash(type: string, text: string) { setMsg({ type, text }); setTimeout(() => setMsg({ type: "", text: "" }), 3000); }

  async function handleSave() {
    if (!form.id || !form.label) return flash("error", "ID và Tên không được để trống");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/categories/${editing}` : "/api/categories";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      flash("success", editing ? "Đã cập nhật!" : "Đã thêm mới!");
      setEditing(null); setForm({ id: "", label: "", slug: "", description: "" });
      fetch("/api/categories").then(r => r.json()).then(setCats);
    } else { const d = await res.json(); flash("error", d.error); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa danh mục này?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    flash("success", "Đã xóa!");
    setCats(prev => prev.filter(c => c.id !== id));
  }

  function startEdit(cat: Category) { setEditing(cat.id); setForm({ id: cat.id, label: cat.label, slug: cat.slug, description: cat.description }); }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🗂️ Quản Lý Danh Mục</h1>
        <Link href="/admin" className={styles.btnSecondary}>← Về Dashboard</Link>
      </div>

      {msg.text && <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{marginBottom:'1rem'}}>{msg.text}</p>}

      {/* Form */}
      <div className={styles.formCard} style={{marginBottom:'1.5rem'}}>
        <h3 style={{marginBottom:'1rem',fontWeight:700,color:'#0d1f2d'}}>{editing ? "✏️ Chỉnh Sửa Danh Mục" : "➕ Thêm Danh Mục Mới"}</h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>ID (không dấu, không khoảng trắng)</label>
            <input value={form.id} onChange={e => setForm(p => ({...p, id: e.target.value}))} placeholder="regular" disabled={!!editing} />
          </div>
          <div className={styles.formField}>
            <label>Tên Danh Mục</label>
            <input value={form.label} onChange={e => setForm(p => ({...p, label: e.target.value}))} placeholder="Du Thuyền Không Ăn Tối" />
          </div>
          <div className={styles.formField}>
            <label>Slug (URL)</label>
            <input value={form.slug} onChange={e => setForm(p => ({...p, slug: e.target.value}))} placeholder="du-thuyen-khong-an-toi" />
          </div>
          <div className={styles.formField}>
            <label>Mô tả ngắn</label>
            <input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Mô tả..." />
          </div>
        </div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem'}}>
          <button onClick={handleSave} className={styles.btnPrimary}>{editing ? "💾 Lưu Cập Nhật" : "➕ Thêm Mới"}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ id:"",label:"",slug:"",description:"" }); }} className={styles.btnSecondary}>✕ Hủy</button>}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}><span className={styles.tableTitle}>Danh sách ({cats.length})</span></div>
        <table className={styles.dataTable}>
          <thead><tr><th>ID</th><th>Tên</th><th>Slug</th><th>Mô Tả</th><th>Thao Tác</th></tr></thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id}>
                <td><code style={{background:'#f1f5f9',padding:'0.15rem 0.4rem',borderRadius:4}}>{cat.id}</code></td>
                <td><strong>{cat.label}</strong></td>
                <td style={{color:'#64748b'}}>{cat.slug}</td>
                <td style={{color:'#94a3b8',fontSize:'0.85rem'}}>{cat.description}</td>
                <td style={{display:'flex',gap:'0.5rem'}}>
                  <button onClick={() => startEdit(cat)} className={styles.btnEdit}>✏️</button>
                  <button onClick={() => handleDelete(cat.id)} className={styles.btnDanger}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
