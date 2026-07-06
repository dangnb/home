"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import bStyles from "./bookings.module.css";

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

const STATUS_CFG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#1d4ed8", bg: "#dbeafe" },
  confirmed: { label: "Confirmed", color: "#065f46", bg: "#d1fae5" },
  completed: { label: "Completed", color: "#a08040", bg: "#faf6ef" },
  cancelled: { label: "Cancelled", color: "#991b1b", bg: "#fee2e2" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(data => { setAppointments(data); setLoading(false); });
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
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      flash("success", "Status updated!");
    } else flash("error", "Update failed!");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this appointment? This cannot be undone.")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      flash("success", "Deleted!");
    }
  }

  const filtered = appointments.filter(a => {
    const matchStatus = filter === "all" || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.customerName.toLowerCase().includes(q) ||
      a.phone.includes(q) || a.serviceName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: appointments.length,
    new: appointments.filter(a => a.status === "new").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Appointments</h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
            {appointments.length} total · {counts.new} pending
          </p>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      {/* Stats */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.5rem" }}>
        {([
          { key: "new", icon: "🆕", label: "New", color: "#1d4ed8", bg: "#dbeafe" },
          { key: "confirmed", icon: "✅", label: "Confirmed", color: "#065f46", bg: "#d1fae5" },
          { key: "completed", icon: "🏆", label: "Completed", color: "#a08040", bg: "#faf6ef" },
          { key: "cancelled", icon: "❌", label: "Cancelled", color: "#991b1b", bg: "#fee2e2" },
        ] as const).map(s => (
          <div key={s.key} className={styles.statCard}
            style={{
              "--stat-color": s.color, "--stat-bg": s.bg, cursor: "pointer",
              outline: filter === s.key ? `2px solid ${s.color}` : "none"
            } as React.CSSProperties}
            onClick={() => setFilter(filter === s.key ? "all" : s.key)}>
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>{s.icon}</span>
            </div>
            <div>
              <span className={styles.statLabel}>{s.label}</span>
              <div className={styles.statValue}>{counts[s.key]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={bStyles.toolbar}>
        <input className={bStyles.searchInput} type="text"
          placeholder="🔍 Search by name, phone, service..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {filter === "all" ? "All Appointments" : STATUS_CFG[filter].label} ({filtered.length})
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#aaa" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#aaa" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📅</div>
            No appointments found
          </div>
        ) : (
          <div className={bStyles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date / Time</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const st = STATUS_CFG[a.status];
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#2E2E2E" }}>{a.customerName}</div>
                        <a href={`tel:${a.phone}`} style={{ fontSize: "13px", color: "#C2A979", fontWeight: 600 }}>
                          📞 {a.phone}
                        </a>
                        {a.email && <div style={{ fontSize: "12px", color: "#aaa" }}>{a.email}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.serviceName || "—"}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#2E2E2E" }}>{a.date}</div>
                        <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{a.time}</div>
                      </td>
                      <td style={{ maxWidth: "160px" }}>
                        <span style={{ fontSize: "13px", color: "#888", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.note || "—"}
                        </span>
                      </td>
                      <td>
                        <select value={a.status}
                          onChange={e => updateStatus(a.id, e.target.value as AppointmentStatus)}
                          className={bStyles.statusSelect}
                          style={{ background: st.bg, color: st.color, borderColor: st.bg }}>
                          <option value="new">🆕 New</option>
                          <option value="confirmed">✅ Confirmed</option>
                          <option value="completed">🏆 Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          <a href={`tel:${a.phone}`} className={styles.btnEdit} title="Call">📞</a>
                          {a.email && (
                            <a href={`mailto:${a.email}`} className={styles.btnSecondary}
                              style={{ fontSize: "12px", padding: "0.4rem 0.6rem" }} title="Email">✉️</a>
                          )}
                          <button onClick={() => handleDelete(a.id)} className={styles.btnDanger} title="Delete">🗑️</button>
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
