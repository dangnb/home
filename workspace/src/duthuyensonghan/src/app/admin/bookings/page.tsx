"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import bStyles from "./bookings.module.css";

type BookingStatus = "new" | "confirmed" | "cancelled";

interface Booking {
  id: string;
  cruiseSlug: string;
  cruiseName: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  note: string;
  status: BookingStatus;
  createdAt: string;
}

const STATUS_LABELS: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "Mới",       color: "#1d4ed8", bg: "#dbeafe" },
  confirmed: { label: "Xác nhận", color: "#065f46", bg: "#d1fae5" },
  cancelled: { label: "Đã hủy",   color: "#991b1b", bg: "#fee2e2" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); });
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      flash("success", "Đã cập nhật trạng thái!");
    } else {
      flash("error", "Lỗi cập nhật!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa booking này?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id));
      flash("success", "Đã xóa!");
    }
  }

  const filtered = bookings.filter(b => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.customerName.toLowerCase().includes(q) ||
      b.phone.includes(q) || b.cruiseName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: bookings.length,
    new: bookings.filter(b => b.status === "new").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Đặt Lịch</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
            Tổng {bookings.length} lượt đặt · {counts.new} mới chờ xử lý
          </p>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>
          {msg.text}
        </p>
      )}

      {/* Stats */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.5rem" }}>
        {[
          { key: "new",       icon: "🆕", label: "Mới",       color: "#1d4ed8", bg: "#eff6ff" },
          { key: "confirmed", icon: "✅", label: "Xác nhận", color: "#065f46", bg: "#f0fdf4" },
          { key: "cancelled", icon: "❌", label: "Đã hủy",   color: "#991b1b", bg: "#fef2f2" },
          { key: "all",       icon: "📋", label: "Tổng",     color: "#374151", bg: "#f8fafc" },
        ].map(s => (
          <div
            key={s.key}
            className={styles.statCard}
            style={{ "--stat-color": s.color, "--stat-bg": s.bg, cursor: "pointer",
              outline: filter === s.key ? `2px solid ${s.color}` : "none" } as React.CSSProperties}
            onClick={() => setFilter(s.key as typeof filter)}
          >
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>{s.icon}</span>
            </div>
            <div>
              <span className={styles.statLabel}>{s.label}</span>
              <div className={styles.statValue}>{counts[s.key as keyof typeof counts]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className={bStyles.toolbar}>
        <input
          className={bStyles.searchInput}
          type="text"
          placeholder="🔍 Tìm theo tên, SĐT, du thuyền..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={bStyles.filterBtns}>
          {(["all", "new", "confirmed", "cancelled"] as const).map(s => (
            <button
              key={s}
              className={`${bStyles.filterBtn} ${filter === s ? bStyles.filterBtnActive : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Tất cả" : STATUS_LABELS[s].label}
              <span className={bStyles.filterCount}>{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {filter === "all" ? "Tất cả đặt lịch" : STATUS_LABELS[filter].label}
            {" "}({filtered.length})
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            Đang tải...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📭</div>
            Không có đặt lịch nào
          </div>
        ) : (
          <div className={bStyles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Du thuyền</th>
                  <th>Ngày / Giờ</th>
                  <th>Số người</th>
                  <th>Ghi chú</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const st = STATUS_LABELS[b.status];
                  // Format date without locale to avoid hydration mismatch
                  const d = new Date(b.date);
                  const dateStr = `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()}`;
                  const createdD = new Date(b.createdAt);
                  const createdStr = `${createdD.getDate().toString().padStart(2,"0")}/${(createdD.getMonth()+1).toString().padStart(2,"0")}/${createdD.getFullYear()} ${createdD.getHours().toString().padStart(2,"0")}:${createdD.getMinutes().toString().padStart(2,"0")}`;
                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{b.customerName}</div>
                        <a href={`tel:${b.phone}`} style={{ fontSize: "0.82rem", color: "#01bf93", fontWeight: 600 }}>
                          📞 {b.phone}
                        </a>
                        {b.email && (
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{b.email}</div>
                        )}
                        <div style={{ fontSize: "0.72rem", color: "#cbd5e1", marginTop: "0.2rem" }}>
                          {createdStr}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{b.cruiseName || "—"}</div>
                        {b.cruiseSlug && (
                          <a href={`/du-thuyen/${b.cruiseSlug}`} target="_blank" rel="noreferrer"
                            style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            Xem trang ↗
                          </a>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{dateStr}</div>
                        <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.15rem" }}>{b.time}</div>
                      </td>
                      <td>
                        <span style={{
                          background: "#f0fdf9", color: "#065f46", border: "1px solid #a7f3d0",
                          borderRadius: "100px", padding: "0.2rem 0.7rem",
                          fontWeight: 700, fontSize: "0.875rem"
                        }}>
                          {b.guests} người
                        </span>
                      </td>
                      <td style={{ maxWidth: "160px" }}>
                        <span style={{ fontSize: "0.82rem", color: "#64748b", display: "block",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.note || "—"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={b.status}
                          onChange={e => updateStatus(b.id, e.target.value as BookingStatus)}
                          className={bStyles.statusSelect}
                          style={{ background: st.bg, color: st.color, borderColor: st.bg }}
                        >
                          <option value="new">🆕 Mới</option>
                          <option value="confirmed">✅ Xác nhận</option>
                          <option value="cancelled">❌ Đã hủy</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          <a href={`tel:${b.phone}`} className={styles.btnEdit} title="Gọi ngay">
                            📞
                          </a>
                          {b.email && (
                            <a href={`mailto:${b.email}`} className={styles.btnSecondary}
                              style={{ fontSize: "0.78rem", padding: "0.4rem 0.6rem" }} title="Gửi email">
                              ✉️
                            </a>
                          )}
                          <button onClick={() => handleDelete(b.id)} className={styles.btnDanger} title="Xóa">
                            🗑️
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
