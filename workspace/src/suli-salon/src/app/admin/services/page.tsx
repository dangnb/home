"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

interface Service { slug: string; name: string; categoryId: string; price: string; promoPrice: string; duration: number; image: string; isActive: boolean; }

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => { fetch("/api/services").then(r => r.json()).then(setServices); }, []);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/services/${slug}`, { method: "DELETE" });
    setServices(prev => prev.filter(s => s.slug !== slug));
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Nail Services</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Manage your salon services
          </p>
        </div>
        <Link href="/admin/services/new" className={styles.btnPrimary}>+ Add Service</Link>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>All Services ({services.length})</span>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr><th>Image</th><th>Service Name</th><th>Category</th><th>Duration</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.slug}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.image ? <img src={s.image} alt={s.name} className={styles.thumb} /> : <div className={styles.thumb} style={{background:'#f4f1ea',display:'flex',alignItems:'center',justifyContent:'center'}}>💅</div>}
                </td>
                <td>
                  <strong>{s.name}</strong><br/>
                  <code style={{fontSize:'11px',color:'#aaa'}}>{s.slug}</code>
                </td>
                <td><span className={styles.badge}>{s.categoryId}</span></td>
                <td style={{color:'#888'}}>{s.duration} min</td>
                <td>
                  <span style={{color:'#C2A979',fontWeight:700}}>{s.price}</span>
                  {s.promoPrice && <><br/><span style={{textDecoration:'line-through',color:'#aaa',fontSize:12}}>{s.promoPrice}</span></>}
                </td>
                <td>
                  <span className={styles.badge} style={{
                    background: s.isActive ? '#d1fae5' : '#fee2e2',
                    color: s.isActive ? '#065f46' : '#991b1b',
                    border: 'none',
                  }}>{s.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                  <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                    <Link href={`/admin/services/${s.slug}`} className={styles.btnEdit}>✏️ Edit</Link>
                    <button onClick={() => handleDelete(s.slug, s.name)} className={styles.btnDanger}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'3rem',color:'#aaa'}}>
                <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>💅</div>
                No services yet. <Link href="/admin/services/new" style={{color:'#C2A979'}}>Add one →</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
