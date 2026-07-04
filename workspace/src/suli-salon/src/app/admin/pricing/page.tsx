"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

interface PriceItem { label: string; price: string; }
interface Pricing {
  regularNote: string; regularPrices: PriceItem[];
  dinnerNote: string; dinnerPrices: PriceItem[];
  fireworksNote: string; fireworksPrices: PriceItem[];
}

function PriceList({ items, onChange }: { items: PriceItem[]; onChange: (v: PriceItem[]) => void }) {
  function update(i: number, key: keyof PriceItem, val: string) {
    const next = [...items]; next[i] = { ...next[i], [key]: val }; onChange(next);
  }
  function add() { onChange([...items, { label: "", price: "" }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
      {items.map((item, i) => (
        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:"0.5rem",alignItems:"center"}}>
          <input value={item.label} onChange={e => update(i, "label", e.target.value)} placeholder="Tên loại vé" className={styles.formField} style={{padding:"0.5rem 0.75rem",border:"1.5px solid #e2e8f0",borderRadius:"6px",fontSize:"0.88rem"}} />
          <input value={item.price} onChange={e => update(i, "price", e.target.value)} placeholder="Giá" style={{padding:"0.5rem 0.75rem",border:"1.5px solid #e2e8f0",borderRadius:"6px",fontSize:"0.88rem"}} />
          <button onClick={() => remove(i)} className={styles.btnDanger}>✕</button>
        </div>
      ))}
      <button type="button" onClick={add} className={styles.btnSecondary} style={{width:"fit-content",fontSize:"0.82rem"}}>+ Thêm dòng giá</button>
    </div>
  );
}

export default function PricingPage() {
  const [data, setData] = useState<Pricing | null>(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch("/api/pricing").then(r => r.json()).then(setData); }, []);
  function flash(type: string, text: string) { setMsg({ type, text }); setTimeout(() => setMsg({ type: "", text: "" }), 3000); }
  function set<K extends keyof Pricing>(key: K, val: Pricing[K]) { setData(p => p ? { ...p, [key]: val } : p); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/pricing", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data) });
    setLoading(false);
    res.ok ? flash("success", "Đã lưu bài viết giá!") : flash("error", "Lỗi khi lưu!");
  }

  if (!data) return <p style={{padding:"2rem",color:"#64748b"}}>Đang tải...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>💰 Bài Viết Giá Vé</h1>
        <div className={styles.pageActions}>
          <a href="/gia-ve" target="_blank" rel="noreferrer" className={styles.btnSecondary}>👁️ Xem trang giá</a>
          <Link href="/admin" className={styles.btnSecondary}>← Dashboard</Link>
        </div>
      </div>
      {msg.text && <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{marginBottom:"1rem"}}>{msg.text}</p>}

      <form onSubmit={handleSave} style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
        {/* Không ăn tối */}
        <div className={styles.formCard}>
          <h3 style={{fontWeight:700,marginBottom:"1.25rem",color:"#0d1f2d",fontSize:"1.05rem"}}>🚢 Du Thuyền Không Ăn Tối</h3>
          <div className={styles.formField} style={{marginBottom:"1rem"}}>
            <label>Ghi chú giới thiệu</label>
            <textarea value={data.regularNote} onChange={e => set("regularNote", e.target.value)} rows={3} style={{padding:"0.7rem",border:"1.5px solid #e2e8f0",borderRadius:"8px",fontSize:"0.9rem"}} />
          </div>
          <label style={{fontSize:"0.82rem",fontWeight:600,color:"#475569",display:"block",marginBottom:"0.5rem"}}>Bảng giá</label>
          <PriceList items={data.regularPrices} onChange={v => set("regularPrices", v)} />
        </div>

        {/* Có ăn tối */}
        <div className={styles.formCard}>
          <h3 style={{fontWeight:700,marginBottom:"1.25rem",color:"#0d1f2d",fontSize:"1.05rem"}}>🍽️ Du Thuyền Có Ăn Tối</h3>
          <div className={styles.formField} style={{marginBottom:"1rem"}}>
            <label>Ghi chú giới thiệu</label>
            <textarea value={data.dinnerNote} onChange={e => set("dinnerNote", e.target.value)} rows={3} style={{padding:"0.7rem",border:"1.5px solid #e2e8f0",borderRadius:"8px",fontSize:"0.9rem"}} />
          </div>
          <label style={{fontSize:"0.82rem",fontWeight:600,color:"#475569",display:"block",marginBottom:"0.5rem"}}>Bảng giá</label>
          <PriceList items={data.dinnerPrices} onChange={v => set("dinnerPrices", v)} />
        </div>

        {/* Pháo hoa */}
        <div className={styles.formCard}>
          <h3 style={{fontWeight:700,marginBottom:"1.25rem",color:"#0d1f2d",fontSize:"1.05rem"}}>🎆 Pháo Hoa DIFF</h3>
          <div className={styles.formField} style={{marginBottom:"1rem"}}>
            <label>Ghi chú giới thiệu</label>
            <textarea value={data.fireworksNote} onChange={e => set("fireworksNote", e.target.value)} rows={3} style={{padding:"0.7rem",border:"1.5px solid #e2e8f0",borderRadius:"8px",fontSize:"0.9rem"}} />
          </div>
          <label style={{fontSize:"0.82rem",fontWeight:600,color:"#475569",display:"block",marginBottom:"0.5rem"}}>Bảng giá</label>
          <PriceList items={data.fireworksPrices} onChange={v => set("fireworksPrices", v)} />
        </div>

        <div style={{paddingBottom:"2rem"}}>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Đang lưu..." : "💾 Lưu Tất Cả Thay Đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
