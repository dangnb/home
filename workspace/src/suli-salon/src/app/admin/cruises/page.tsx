"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

interface Cruise { slug: string; name: string; categoryId: string; salePrice: string; originalPrice: string; capacity: number; mainImage: string; }

export default function CruisesListPage() {
  const [cruises, setCruises] = useState<Cruise[]>([]);

  useEffect(() => { fetch("/api/cruises").then(r => r.json()).then(setCruises); }, []);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Xóa "${name}"?`)) return;
    await fetch(`/api/cruises/${slug}`, { method: "DELETE" });
    setCruises(prev => prev.filter(c => c.slug !== slug));
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🚢 Quản Lý Du Thuyền</h1>
        <Link href="/admin/cruises/new" className={styles.btnPrimary}>+ Thêm Mới</Link>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Danh sách ({cruises.length} thuyền)</span>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Ảnh</th><th>Tên Du Thuyền</th><th>Danh Mục</th><th>Giá Gốc</th><th>Giá Sale</th><th>Sức Chứa</th><th>Thao Tác</th></tr>
          </thead>
          <tbody>
            {cruises.map(c => (
              <tr key={c.slug}>
                <td>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={c.mainImage} alt={c.name} className={styles.thumb} /></td>
                <td>
                  <strong>{c.name}</strong><br/>
                  <code style={{fontSize:'0.75rem',color:'#94a3b8'}}>/du-thuyen/{c.slug}</code>
                </td>
                <td><span className={styles.badge}>{c.categoryId}</span></td>
                <td style={{color:'#94a3b8',textDecoration:'line-through'}}>{c.originalPrice}</td>
                <td style={{color:'#ff3b30',fontWeight:700}}>{c.salePrice}</td>
                <td>{c.capacity} người</td>
                <td>
                  <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                    <Link href={`/admin/cruises/${c.slug}`} className={styles.btnEdit}>✏️ Sửa</Link>
                    <a href={`/du-thuyen/${c.slug}`} target="_blank" rel="noreferrer" className={styles.btnSecondary} style={{fontSize:'0.78rem',padding:'0.4rem 0.7rem'}}>👁️</a>
                    <button onClick={() => handleDelete(c.slug, c.name)} className={styles.btnDanger}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {cruises.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'3rem',color:'#94a3b8'}}>
                Chưa có du thuyền nào. <Link href="/admin/cruises/new" style={{color:'#01bf93'}}>Thêm ngay →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
