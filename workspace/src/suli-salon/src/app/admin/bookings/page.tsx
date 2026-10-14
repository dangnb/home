"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import bStyles from "./bookings.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import {
  MdPendingActions,
  MdCheckCircleOutline,
  MdDoneAll,
  MdClose,
  MdPhone,
  MdMailOutline,
  MdDeleteOutline,
  MdSearch,
} from "react-icons/md";

type AppointmentStatus = "new" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceName: string;
  date: string;
  time: string;
  note: string;
  status: AppointmentStatus;
  createdAt: string;
}

const STATUS_CFG: Record<AppointmentStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "Mới", color: "#967840", bg: "rgba(194, 169, 121, 0.14)", border: "rgba(194, 169, 121, 0.35)" },
  confirmed: { label: "Đã xác nhận", color: "#2D603A", bg: "rgba(86, 133, 92, 0.12)", border: "rgba(86, 133, 92, 0.3)" },
  completed: { label: "Hoàn thành", color: "#594B40", bg: "rgba(120, 105, 92, 0.12)", border: "rgba(120, 105, 92, 0.3)" },
  cancelled: { label: "Đã hủy", color: "#99352A", bg: "rgba(184, 70, 59, 0.1)", border: "rgba(184, 70, 59, 0.28)" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setMsg({ type: "error", text: "Không thể tải danh sách lịch hẹn. Vui lòng thử lại." }))
      .finally(() => setLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      flash("success", "Đã cập nhật trạng thái lịch hẹn.");
    } else {
      flash("error", "Cập nhật thất bại. Vui lòng thử lại.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không? Thao tác này không thể hoàn tác.")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      flash("success", "Đã xóa lịch hẹn thành công.");
    } else {
      flash("error", "Không thể xóa lịch hẹn.");
    }
  }

  const filtered = appointments.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.serviceName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: appointments.length,
    new: appointments.filter((a) => a.status === "new").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Lịch hẹn salon</h1>
          <p className={styles.pageSubtitle}>
            {loading ? "Đang đồng bộ dữ liệu lịch hẹn..." : `${appointments.length} lịch hẹn tổng cộng · ${counts.new} lượt đang chờ xác nhận`}
          </p>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Filter Stat Cards */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.8rem" }}>
        {(
          [
            { key: "new", icon: MdPendingActions, label: "Mới chờ duyệt", color: "#967840", bg: "rgba(194, 169, 121, 0.12)" },
            { key: "confirmed", icon: MdCheckCircleOutline, label: "Đã xác nhận", color: "#2D603A", bg: "rgba(86, 133, 92, 0.12)" },
            { key: "completed", icon: MdDoneAll, label: "Đã hoàn thành", color: "#594B40", bg: "rgba(120, 105, 92, 0.12)" },
            { key: "cancelled", icon: MdClose, label: "Đã hủy", color: "#99352A", bg: "rgba(184, 70, 59, 0.1)" },
          ] as const
        ).map((s) => {
          const Icon = s.icon;
          const isCurrent = filter === s.key;
          return (
            <div
              key={s.key}
              className={styles.statCard}
              style={
                {
                  "--stat-color": s.color,
                  "--stat-bg": s.bg,
                  cursor: "pointer",
                  borderColor: isCurrent ? s.color : undefined,
                  boxShadow: isCurrent ? `0 0 0 1px ${s.color}, 0 12px 30px -10px rgba(35, 27, 21, 0.1)` : undefined,
                } as React.CSSProperties
              }
              onClick={() => setFilter(filter === s.key ? "all" : s.key)}
            >
              <div className={styles.statIconWrap}>
                <Icon size={22} className={styles.statIcon} />
              </div>
              <div>
                <span className={styles.statLabel}>{s.label}</span>
                <div className={styles.statValue}>{loading ? "—" : counts[s.key]}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className={bStyles.toolbar}>
        <div style={{ position: "relative", width: "min(460px, 100%)" }}>
          <input
            className={bStyles.searchInput}
            type="text"
            placeholder="Tìm theo tên khách, số điện thoại hoặc dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "38px" }}
          />
          <MdSearch
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#A3968B",
              pointerEvents: "none",
            }}
          />
        </div>

        {filter !== "all" && (
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={styles.btnSecondary}
            style={{ minHeight: "44px", fontSize: "12.5px" }}
          >
            ✕ Xóa bộ lọc ({STATUS_CFG[filter].label})
          </button>
        )}
      </div>

      {/* Main Appointments Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {filter === "all" ? "Tất cả lịch hẹn" : STATUS_CFG[filter].label} ({filtered.length})
          </span>
        </div>

        {loading ? (
          <AdminLoading variant="table" label="Đang tải danh sách lịch hẹn..." />
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
            <span>Chưa tìm thấy lịch hẹn phù hợp với điều kiện tìm kiếm.</span>
          </div>
        ) : (
          <div className={bStyles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ yêu cầu</th>
                  <th>Ngày & Giờ</th>
                  <th>Ghi chú</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const st = STATUS_CFG[a.status];
                  return (
                    <tr key={a.id}>
                      <td>
                        <strong style={{ color: "#231B15" }}>{a.customerName}</strong>
                        <div style={{ marginTop: 4 }}>
                          <a
                            href={`tel:${a.phone}`}
                            style={{
                              fontSize: "12.5px",
                              color: "#967840",
                              fontWeight: 600,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <MdPhone size={13} />
                            <span>{a.phone}</span>
                          </a>
                        </div>
                        {a.email && (
                          <div style={{ fontSize: "12px", color: "#857567", marginTop: 2 }}>{a.email}</div>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: "#3B322A" }}>{a.serviceName || "—"}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#231B15" }}>{a.date}</div>
                        <div style={{ fontSize: "12.5px", color: "#857567", marginTop: "2px", fontWeight: 600 }}>
                          {a.time}
                        </div>
                      </td>
                      <td style={{ maxWidth: "200px" }}>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#78695C",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={a.note || undefined}
                        >
                          {a.note || "—"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={a.status}
                          onChange={(e) => updateStatus(a.id, e.target.value as AppointmentStatus)}
                          className={bStyles.statusSelect}
                          style={{
                            background: st.bg,
                            color: st.color,
                            borderColor: st.border,
                          }}
                        >
                          <option value="new">✦ Mới</option>
                          <option value="confirmed">✓ Đã xác nhận</option>
                          <option value="completed">◈ Hoàn thành</option>
                          <option value="cancelled">✕ Đã hủy</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <a
                            href={`tel:${a.phone}`}
                            className={styles.btnEdit}
                            title="Gọi điện cho khách"
                            style={{ padding: "0 10px", minHeight: "30px" }}
                          >
                            <MdPhone size={15} />
                          </a>
                          {a.email && (
                            <a
                              href={`mailto:${a.email}`}
                              className={styles.btnSecondary}
                              style={{ padding: "0 10px", minHeight: "30px", fontSize: "12px" }}
                              title="Gửi email"
                            >
                              <MdMailOutline size={15} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(a.id)}
                            className={styles.btnDanger}
                            title="Xóa lịch hẹn"
                            style={{ padding: "0 10px", minHeight: "30px" }}
                          >
                            <MdDeleteOutline size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
