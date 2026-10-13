import { getServices, getCategories, getAppointments, getGalleryItems } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminDashboard() {
  const [services, cats, appointments, gallery] = await Promise.all([
    getServices(), getCategories(), getAppointments(), getGalleryItems(),
  ]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((appointment) => appointment.date === todayStr);
  const pendingAppts = appointments.filter((appointment) => appointment.status === "new");
  const statusLabel: Record<string, string> = { new: "Mới", confirmed: "Đã xác nhận", completed: "Hoàn thành", cancelled: "Đã hủy" };

  const stats = [
    { icon: "💅", label: "Dịch vụ", value: services.length, color: "#b69663", bg: "#f5ead7" },
    { icon: "📅", label: "Lịch hẹn hôm nay", value: todayAppts.length, color: "#9b7650", bg: "#f1e6d6" },
    { icon: "✦", label: "Đang chờ", value: pendingAppts.length, color: "#bd8e37", bg: "#f9efd5" },
    { icon: "🖼️", label: "Ảnh bộ sưu tập", value: gallery.length, color: "#80664b", bg: "#eee5d9" },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Tổng quan</h1>
          <p className={styles.pageSubtitle}>Theo dõi nhanh hoạt động của Mộc Salon hôm nay.</p>
        </div>
        <div className={styles.pageActions}>
          <Link href="/admin/services/new" className={styles.btnPrimary}>+ Thêm dịch vụ</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard} style={{ "--stat-color": stat.color, "--stat-bg": stat.bg } as React.CSSProperties}>
            <div className={styles.statIconWrap}><span className={styles.statIcon}>{stat.icon}</span></div>
            <div><span className={styles.statLabel}>{stat.label}</span><div className={styles.statValue}>{stat.value}</div></div>
          </div>
        ))}
      </div>

      <section className={styles.tableCard} style={{ marginBottom: "24px" }}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Lịch hẹn gần đây</span>
          <Link href="/admin/bookings" className={styles.btnSecondary}>Xem tất cả →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead><tr><th>Khách hàng</th><th>Dịch vụ</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {appointments.slice(0, 5).map((appointment) => (
                <tr key={appointment.id}>
                  <td><strong style={{ color: "#302821" }}>{appointment.customerName}</strong><div style={{ fontSize: 12, color: "#9a8f84", marginTop: 3 }}>{appointment.phone}</div></td>
                  <td>{appointment.serviceName || "—"}</td><td>{appointment.date}</td><td>{appointment.time}</td>
                  <td><span className={styles.badge}>{statusLabel[appointment.status] || appointment.status}</span></td>
                </tr>
              ))}
              {appointments.length === 0 && <tr><td colSpan={5}><div className={styles.emptyState}>📅<br />Chưa có lịch hẹn nào.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Dịch vụ mới cập nhật</span>
          <Link href="/admin/services" className={styles.btnSecondary}>Quản lý dịch vụ →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead><tr><th>Hình ảnh</th><th>Tên dịch vụ</th><th>Danh mục</th><th>Thời lượng</th><th>Giá</th><th></th></tr></thead>
            <tbody>
              {services.slice(0, 5).map((service) => (
                <tr key={service.slug}>
                  <td>
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={68}
                        height={50}
                        sizes="68px"
                        className={styles.thumb}
                      />
                    )}
                  </td>
                  <td><strong style={{ color: "#302821" }}>{service.name}</strong></td><td><span className={styles.badge}>{service.categoryId}</span></td>
                  <td style={{ color: "#7d7166" }}>{service.duration} phút</td>
                  <td><span style={{ color: "#876938", fontWeight: 700 }}>{service.price}</span>{service.promoPrice && <span style={{ textDecoration: "line-through", color: "#a79b90", marginLeft: 6, fontSize: 12 }}>{service.promoPrice}</span>}</td>
                  <td><Link href={`/admin/services/${service.slug}`} className={styles.btnEdit}>Chỉnh sửa</Link></td>
                </tr>
              ))}
              {services.length === 0 && <tr><td colSpan={6}><div className={styles.emptyState}>💅<br />Chưa có dịch vụ. <Link href="/admin/services/new" style={{ color: "#876938", fontWeight: 700 }}>Thêm dịch vụ đầu tiên →</Link></div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {cats.length === 0 && <p className={styles.pageSubtitle} style={{ marginTop: 16 }}>Hãy tạo danh mục trước khi thêm dịch vụ để quản lý thuận tiện hơn.</p>}
    </div>
  );
}
