"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = ["All", "Gel Nails", "Nail Art", "Manicure", "Pedicure", "Extensions", "Other"];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", image: "", category: "Gel Nails" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/gallery").then(r => r.json()).then(setItems);
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  async function handleAdd() {
    if (!newItem.image) return flash("error", "Image URL is required");
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(prev => [...prev, data.item]);
      setNewItem({ title: "", image: "", category: "Gel Nails" });
      setShowAdd(false);
      flash("success", "Added!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== id));
      flash("success", "Deleted!");
    }
  }

  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Showcase your nail art portfolio ({items.length} images)
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={styles.btnPrimary}>
          {showAdd ? "Cancel" : "+ Add Image"}
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className={styles.formCard} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.cardSectionTitle}>Add New Image</div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Image URL</label>
              <input value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))}
                placeholder="https://..." />
            </div>
            <div className={styles.formField}>
              <label>Title (optional)</label>
              <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Rose Gold Gel Design" />
            </div>
            <div className={styles.formField}>
              <label>Category</label>
              <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={handleAdd} className={styles.btnPrimary}>Add to Gallery</button>
            </div>
          </div>
          {newItem.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={newItem.image} alt="Preview" style={{
              width: 200, height: 150, objectFit: 'cover', borderRadius: 2, marginTop: 12,
              border: '1px solid rgba(194,169,121,0.15)',
            }} />
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={styles.btnSecondary}
            style={{
              background: filter === c ? 'rgba(194,169,121,0.12)' : undefined,
              borderColor: filter === c ? '#C2A979' : undefined,
              color: filter === c ? '#C2A979' : undefined,
            }}>
            {c} {c === "All" ? `(${items.length})` : `(${items.filter(i => i.category === c).length})`}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖼️</div>
          No images yet. Add your first nail art photo!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: '#fff',
              border: '1px solid rgba(194,169,121,0.15)',
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title || "Nail art"}
                style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '0.75rem' }}>
                {item.title && (
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#2E2E2E', marginBottom: 4 }}>{item.title}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.badge}>{item.category || "Uncategorized"}</span>
                  <button onClick={() => handleDelete(item.id)} className={styles.btnDanger}
                    style={{ fontSize: 11, padding: '0.3rem 0.5rem' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
