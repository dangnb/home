import { getServices, getCategories, getAppointments, getGalleryItems } from "@/lib/db";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminDashboard() {
  const [services, cats, appointments, gallery] = await Promise.all([
    getServices(), getCategories(), getAppointments(), getGalleryItems(),
  ]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const pendingAppts = appointments.filter(a => a.status === "new");

  const stats = [
    { icon: "💅", label: "Services", value: services.length, color: "#C2A979", bg: "#faf6ef" },
    { icon: "📅", label: "Today", value: todayAppts.length, color: "#a08040", bg: "#f8f3e8" },
    { icon: "⏳", label: "Pending", value: pendingAppts.length, color: "#d4a019", bg: "#fdf6e3" },
    { icon: "🖼️", label: "Gallery", value: gallery.length, color: "#8a6d2f", bg: "#faf6ef" },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px', fontFamily: 'Montserrat, sans-serif' }}>
            Welcome back, Admin
          </p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/admin/cruises/new" className={styles.btnPrimary}>+ Add Service</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}
            style={{ "--stat-color": s.color, "--stat-bg": s.bg } as React.CSSProperties}>
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

      {/* Recent Appointments */}
      <div className={styles.tableCard} style={{ marginBottom: '2rem' }}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Recent Appointments</span>
          <Link href="/admin/bookings" className={styles.btnSecondary}>View all →</Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.slice(0, 5).map(a => (
              <tr key={a.id}>
                <td>
                  <strong style={{ color: '#2E2E2E' }}>{a.customerName}</strong>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>{a.phone}</div>
                </td>
                <td>{a.serviceName}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>
                  <span className={styles.badge} style={{
                    background: a.status === 'new' ? '#dbeafe' : a.status === 'confirmed' ? '#d1fae5' : a.status === 'completed' ? '#faf6ef' : '#fee2e2',
                    color: a.status === 'new' ? '#1d4ed8' : a.status === 'confirmed' ? '#065f46' : a.status === 'completed' ? '#a08040' : '#991b1b',
                    border: 'none',
                  }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '3rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Services */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Services</span>
          <Link href="/admin/cruises" className={styles.btnSecondary}>Manage →</Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th>
              <th>Duration</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.slice(0, 5).map(s => (
              <tr key={s.slug}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.image && <img src={s.image} alt={s.name} className={styles.thumb} />}
                </td>
                <td><strong style={{ color: '#2E2E2E' }}>{s.name}</strong></td>
                <td><span className={styles.badge}>{s.categoryId}</span></td>
                <td style={{ color: '#888' }}>{s.duration} min</td>
                <td>
                  <span style={{ color: '#C2A979', fontWeight: 700 }}>{s.price}</span>
                  {s.promoPrice && (
                    <span style={{ textDecoration: 'line-through', color: '#aaa', marginLeft: 6, fontSize: 12 }}>{s.promoPrice}</span>
                  )}
                </td>
                <td>
                  <Link href={`/admin/cruises/${s.slug}`} className={styles.btnEdit}>✏️ Edit</Link>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '3rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💅</div>
                  No services yet.{" "}
                  <Link href="/admin/cruises/new" style={{ color: '#C2A979', fontWeight: 600 }}>Add one →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
