"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./admin.module.css";
import {
  MdCalendarMonth,
  MdPendingActions,
  MdPhotoLibrary,
  MdSpa,
  MdArrowForward,
  MdPeople,
} from "react-icons/md";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { ServiceData, CategoryData, AppointmentData, GalleryItemData, CustomerData } from "@/lib/db";

const STATUS_BADGE_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "Mới", color: "#967840", bg: "rgba(194, 169, 121, 0.14)", border: "rgba(194, 169, 121, 0.35)" },
  confirmed: { label: "Đã xác nhận", color: "#2D603A", bg: "rgba(86, 133, 92, 0.12)", border: "rgba(86, 133, 92, 0.3)" },
  completed: { label: "Hoàn thành", color: "#594B40", bg: "rgba(120, 105, 92, 0.12)", border: "rgba(120, 105, 92, 0.3)" },
  cancelled: { label: "Đã hủy", color: "#99352A", bg: "rgba(184, 70, 59, 0.1)", border: "rgba(184, 70, 59, 0.28)" },
};

interface AdminDashboardClientProps {
  services: ServiceData[];
  cats: CategoryData[];
  appointments: AppointmentData[];
  gallery: GalleryItemData[];
  customers: CustomerData[];
}

export default function AdminDashboardClient({
  services,
  cats,
  appointments,
  gallery,
  customers,
}: AdminDashboardClientProps) {
  const { locale, t, tPrice, tOther } = useAdminLocale();

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((appointment) => appointment.date === todayStr);
  const pendingAppts = appointments.filter((appointment) => appointment.status === "new");

  const stats = [
    { icon: MdSpa, label: "Dịch vụ salon", value: services.length, color: "#967840", bg: "rgba(194, 169, 121, 0.12)" },
    { icon: MdPeople, label: "Khách hàng", value: customers.length, color: "#2D603A", bg: "rgba(86, 133, 92, 0.12)" },
    { icon: MdCalendarMonth, label: "Lịch hẹn hôm nay", value: todayAppts.length, color: "#85603F", bg: "rgba(133, 96, 63, 0.1)" },
    { icon: MdPendingActions, label: "Đang chờ duyệt", value: pendingAppts.length, color: "#A87932", bg: "rgba(168, 121, 50, 0.12)" },
    { icon: MdPhotoLibrary, label: "Ảnh bộ sưu tập", value: gallery.length, color: "#6E5B4B", bg: "rgba(110, 91, 75, 0.1)" },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Tổng quan</h1>
          <p className={styles.pageSubtitle}>Theo dõi nhịp làm việc và lịch hẹn của Mộc Salon hôm nay.</p>
        </div>
        <div className={styles.pageActions} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AdminLanguageSelector compact light />
          <Link href="/admin/services/new" className={styles.btnPrimary}>
            + Thêm dịch vụ
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={styles.statCard}
              style={{ "--stat-color": stat.color, "--stat-bg": stat.bg } as React.CSSProperties}
            >
              <div className={styles.statIconWrap}>
                <Icon size={22} className={styles.statIcon} />
              </div>
              <div>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statValue}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <section className={styles.tableCard} style={{ marginBottom: "26px" }}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Lịch hẹn gần đây</span>
          <Link href="/admin/bookings" className={styles.btnSecondary}>
            <span>Xem tất cả</span>
            <MdArrowForward size={14} />
          </Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((appointment) => {
                const badge = STATUS_BADGE_STYLE[appointment.status] || {
                  label: appointment.status,
                  color: "#967840",
                  bg: "rgba(194, 169, 121, 0.14)",
                  border: "rgba(194, 169, 121, 0.35)",
                };
                return (
                  <tr key={appointment.id}>
                    <td>
                      <strong style={{ color: "#231B15" }}>{appointment.customerName}</strong>
                      <div style={{ fontSize: 12, color: "#857567", marginTop: 3 }}>{appointment.phone}</div>
                    </td>
                    <td>
                      <span style={{ color: "#3B322A", fontWeight: 600 }}>{t(appointment.serviceName) || "—"}</span>
                      {tOther(appointment.serviceName) && (
                        <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2 }}>
                          ({tOther(appointment.serviceName)})
                        </div>
                      )}
                    </td>
                    <td style={{ color: "#54473C" }}>{appointment.date}</td>
                    <td style={{ color: "#54473C", fontWeight: 600 }}>{appointment.time}</td>
                    <td>
                      <span
                        className={styles.badge}
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          borderColor: badge.border,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.emptyState}>
                      <span style={{ fontSize: 24, opacity: 0.6 }}>✦</span>
                      <span>Chưa có lịch hẹn nào được ghi nhận.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Services List */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Dịch vụ mới cập nhật</span>
          <Link href="/admin/services" className={styles.btnSecondary}>
            <span>Quản lý dịch vụ</span>
            <MdArrowForward size={14} />
          </Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Danh mục</th>
                <th>Thời lượng</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.slice(0, 5).map((service) => (
                <tr key={service.slug}>
                  <td>
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={t(service.name)}
                        width={68}
                        height={50}
                        sizes="68px"
                        className={styles.thumb}
                      />
                    ) : (
                      <div
                        className={styles.thumb}
                        style={{
                          background: "rgba(194, 169, 121, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#C2A979",
                        }}
                      >
                        <MdSpa size={20} />
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: "#231B15" }}>{t(service.name)}</strong>
                    {tOther(service.name) && (
                      <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2 }}>
                        {locale === "vi" ? "EN: " : "VI: "}{tOther(service.name)}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={styles.badge}>{t(service.categoryId)}</span>
                  </td>
                  <td style={{ color: "#7A6C5F" }}>{service.duration} phút</td>
                  <td>
                    <span style={{ color: "#967840", fontWeight: 700 }}>{tPrice(service.price)}</span>
                    {service.promoPrice && (
                      <span style={{ textDecoration: "line-through", color: "#A3968B", marginLeft: 8, fontSize: 12 }}>
                        {tPrice(service.promoPrice)}
                      </span>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/services/${service.slug}`} className={styles.btnEdit}>
                      Chỉnh sửa
                    </Link>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <span style={{ fontSize: 24, opacity: 0.6 }}>✦</span>
                      <span>
                        Chưa có dịch vụ nào.{" "}
                        <Link href="/admin/services/new" style={{ color: "#967840", fontWeight: 700 }}>
                          Thêm dịch vụ đầu tiên →
                        </Link>
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {cats.length === 0 && (
        <p className={styles.pageSubtitle} style={{ marginTop: 20 }}>
          ✦ Hãy tạo danh mục trước khi thêm dịch vụ để quản lý không gian salon thuận tiện hơn.
        </p>
      )}
    </div>
  );
}
