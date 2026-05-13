import { getCruises, getCategories } from "@/lib/db";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const cruises = getCruises();
  const cats = getCategories();
  const minPrice = cruises.length ? Math.min(...cruises.map(c => parseInt(c.salePrice.replace(/\D/g,"")))) : 0;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📊 Dashboard</h1>
        <div className={styles.pageActions}>
          <Link href="/admin/cruises/new" className={styles.btnPrimary}>+ Thêm Du Thuyền</Link>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><span className={styles.statIcon}>🚢</span><div><div className={styles.statLabel}>Tổng Du Thuyền</div><div className={styles.statValue}>{cruises.length}</div></div></div>
        <div className={styles.statCard}><span className={styles.statIcon}>🗂️</span><div><div className={styles.statLabel}>Danh Mục</div><div className={styles.statValue}>{cats.length}</div></div></div>
        <div className={styles.statCard}><span className={styles.statIcon}>💰</span><div><div className={styles.statLabel}>Giá Thấp Nhất</div><div className={styles.statValue}>{minPrice.toLocaleString("vi-VN")}đ</div></div></div>
        <div className={styles.statCard}><span className={styles.statIcon}>📋</span><div><div className={styles.statLabel}>Trạng Thái</div><div className={styles.statValue} style={{fontSize:'1rem',color:'#01bf93'}}>Online ✓</div></div></div>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Du Thuyền gần đây</span>
          <Link href="/admin/cruises" className={styles.btnSecondary}>Xem tất cả</Link>
        </div>
        <table className={styles.dataTable}>
          <thead><tr><th>Ảnh</th><th>Tên</th><th>Danh Mục</th><th>Giá Gốc</th><th>Giá Sale</th><th>Sức Chứa</th><th>Thao Tác</th></tr></thead>
          <tbody>
            {cruises.slice(0,5).map(c => (
              <tr key={c.slug}>
                <td>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={c.mainImage} alt={c.name} className={styles.thumb} /></td>
                <td><strong>{c.name}</strong></td>
                <td><span className={styles.badge}>{c.categoryId}</span></td>
                <td style={{textDecoration:'line-through',color:'#999'}}>{c.originalPrice}</td>
                <td style={{color:'#ff3b30',fontWeight:700}}>{c.salePrice}</td>
                <td>{c.capacity} người</td>
                <td><Link href={`/admin/cruises/${c.slug}`} className={styles.btnEdit}>✏️ Sửa</Link></td>
              </tr>
            ))}
            {cruises.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',color:'#94a3b8',padding:'2rem'}}>Chưa có du thuyền nào</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
