"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface PriceItem { name: string; duration: string; price: string; }
interface PriceCategory { category: string; items: PriceItem[]; order: number; }

const DEFAULT_CATEGORIES = ["Manicure", "Pedicure", "Gel Nails", "Nail Art", "Extensions"];

export default function PriceListPage() {
  const [categories, setCategories] = useState<PriceCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/pricing").then(r => r.json()).then((data: PriceCategory[]) => {
      if (data.length === 0) {
        // Init with default categories
        setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ category: c, items: [], order: i })));
      } else {
        setCategories(data);
      }
    });
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  function updateItem(catIdx: number, itemIdx: number, key: keyof PriceItem, val: string) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: next[catIdx].items.map((item, i) => i === itemIdx ? { ...item, [key]: val } : item),
    };
    setCategories(next);
  }

  function addItem(catIdx: number) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: [...next[catIdx].items, { name: "", duration: "", price: "" }],
    };
    setCategories(next);
  }

  function removeItem(catIdx: number, itemIdx: number) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: next[catIdx].items.filter((_, i) => i !== itemIdx),
    };
    setCategories(next);
  }

  function addCategory() {
    const name = prompt("Category name:");
    if (!name) return;
    setCategories(prev => [...prev, { category: name, items: [], order: prev.length }]);
  }

  function removeCategory(idx: number) {
    if (!confirm(`Delete category "${categories[idx].category}" and all its items?`)) return;
    setCategories(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: categories.map((c, i) => ({ ...c, order: i })) }),
      });
      if (res.ok) flash("success", "Price list saved!");
      else flash("error", "Error saving!");
    } catch {
      flash("error", "Network error");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Price List</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Manage your service pricing
          </p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={addCategory} className={styles.btnSecondary}>+ Add Category</button>
          <button onClick={handleSave} disabled={saving} className={styles.btnPrimary}>
            {saving ? "Saving..." : "💾 Save All"}
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      {categories.map((cat, catIdx) => (
        <div key={cat.category} className={styles.formCard} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={styles.cardSectionTitle} style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
              💅 {cat.category}
            </div>
            <button onClick={() => removeCategory(catIdx)} className={styles.btnDanger}
              style={{ fontSize: 11 }}>Remove</button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 120px 40px',
              gap: '0.5rem', marginBottom: '0.5rem',
              fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <span>Service</span><span>Duration</span><span>Price</span><span></span>
            </div>

            {cat.items.map((item, itemIdx) => (
              <div key={itemIdx} style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 120px 40px',
                gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem',
              }}>
                <input value={item.name} onChange={e => updateItem(catIdx, itemIdx, "name", e.target.value)}
                  placeholder="Classic Manicure"
                  style={{ padding: '0.5rem 0.75rem', border: '1px solid rgba(194,169,121,0.2)', borderRadius: 2, fontSize: 14 }} />
                <input value={item.duration} onChange={e => updateItem(catIdx, itemIdx, "duration", e.target.value)}
                  placeholder="45 min"
                  style={{ padding: '0.5rem 0.75rem', border: '1px solid rgba(194,169,121,0.2)', borderRadius: 2, fontSize: 14 }} />
                <input value={item.price} onChange={e => updateItem(catIdx, itemIdx, "price", e.target.value)}
                  placeholder="590 CZK"
                  style={{ padding: '0.5rem 0.75rem', border: '1px solid rgba(194,169,121,0.2)', borderRadius: 2, fontSize: 14 }} />
                <button onClick={() => removeItem(catIdx, itemIdx)} className={styles.btnDanger}
                  style={{ padding: '0.4rem', fontSize: 11 }}>✕</button>
              </div>
            ))}

            <button onClick={() => addItem(catIdx)} className={styles.btnSecondary}
              style={{ marginTop: '0.5rem', fontSize: 12 }}>
              + Add Service
            </button>
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
          No price categories yet. Add one to get started!
        </div>
      )}
    </div>
  );
}
