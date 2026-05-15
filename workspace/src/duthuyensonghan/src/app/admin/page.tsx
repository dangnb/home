import { getCruises, getCategories } from "@/lib/db";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const cruises = getCruises();
  const cats = getCategories();
  const minPrice = cruises.length ? Math.min(...cruises.map(c => parseInt(c.salePrice.replace(/\D/g,"")))) : 0;

  const stats = [
    {
      icon: "🚢",
      label: "Tổng Du Thuyền",
      value: cruises.length,
      color: "#01bf93",
      bg: "#f0fdf9",
    },
    {
      icon: "🗂️",
      label: "Danh Mục",
      value: cats.length,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      icon: "💰",
      label: "Giá Thấp Nhất",
      value: minPrice.toLocaleString("vi-VN") + "đ",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      icon: "✅",
      label: "Trạng Thái",
      value: "Online",
      color: "#10b981",
      bg: "#ecfdf5",
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p style={{fontSize:'0.875rem',color:'#64748b',marginTop:'0.25rem'}}>Chào mừng trở lại, Admin 👋</p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/admin/cruises/new" className={styles.btnPrimary}>+ Thêm Du Thuyền</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div
            key={s.label}
            className={styles.statCard}
            style={{ "--stat-color": s.color, "--stat-bg": s.bg } as React.CSSProperties}
          >
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>{s.icon}</span>
            </div>
            <div>
              <span className={styles.statLabel}>{s.label}</span>
              <div className={styles.statValue}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Du Thuyền gần đây</span>
          <Link href="/admin/cruises" className={styles.btnSecondary}>Xem tất cả →</Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Ảnh</th><th>Tên</th><th>Danh Mục</th>
              <th>Giá Gốc</th><th>Giá Sale</th><th>Sức Chứa</th><th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {cruises.slice(0,5).map(c => (
              <tr key={c.slug}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.mainImage} alt={c.name} className={styles.thumb} />
                </td>
                <td><strong style={{color:'#0f172a'}}>{c.name}</strong></td>
                <td><span className={styles.badge}>{c.categoryId}</span></td>
                <td style={{textDecoration:'line-through',color:'#94a3b8'}}>{c.originalPrice}</td>
                <td style={{color:'#ef4444',fontWeight:700}}>{c.salePrice}</td>
                <td style={{color:'#64748b'}}>{c.capacity} người</td>
                <td>
                  <Link href={`/admin/cruises/${c.slug}`} className={styles.btnEdit}>✏️ Sửa</Link>
                </td>
              </tr>
            ))}
            {cruises.length === 0 && (
              <tr>
                <td colSpan={7} style={{textAlign:'center',color:'#94a3b8',padding:'3rem'}}>
                  <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🚢</div>
                  Chưa có du thuyền nào.{" "}
                  <Link href="/admin/cruises/new" style={{color:'#01bf93',fontWeight:600}}>Thêm ngay →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
