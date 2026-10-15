"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import cStyles from "./customers.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import {
  MdAdd,
  MdCake,
  MdClose,
  MdDeleteOutline,
  MdDiamond,
  MdEdit,
  MdHistory,
  MdLoyalty,
  MdNotificationsActive,
  MdPeople,
  MdPerson,
  MdPhone,
  MdSearch,
  MdStar,
  MdVisibility,
} from "react-icons/md";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  gender?: "female" | "male" | "other";
  tier: "standard" | "silver" | "gold" | "diamond";
  notes?: string;
  tags?: string[];
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  note: string;
  status: string;
}

const TIER_CONFIG = {
  diamond: {
    label: "Kim Cương VIP",
    icon: MdDiamond,
    className: cStyles.vipDiamond,
    discount: "Giảm 20% trọn đời + Miễn phí tháo gel & cắt da định kỳ",
  },
  gold: {
    label: "Hội Viên Vàng",
    icon: MdStar,
    className: cStyles.vipGold,
    discount: "Giảm 15% tổng hóa đơn + Ưu tiên chọn giờ vàng cuối tuần",
  },
  silver: {
    label: "Hội Viên Bạc",
    icon: MdLoyalty,
    className: cStyles.vipSilver,
    discount: "Giảm 10% từ lần ghé thứ hai + Tặng massage tay tháng sinh nhật",
  },
  standard: {
    label: "Tiêu Chuẩn",
    icon: MdPerson,
    className: cStyles.vipStandard,
    discount: "Tích lũy chi tiêu để nâng hạng Bạc sau 3 lượt đến",
  },
};

const SUGGESTED_TAGS = [
  "VIP Kim Cương",
  "Khách ruột",
  "Da nhạy cảm",
  "Móng mỏng yếu",
  "Thích Nail Art",
  "Form thang Coffin",
  "Form Hạnh nhân Almond",
  "Sơn gel thạch",
  "Tráng gương Chrome",
  "Mắt mèo Velvet",
  "Spa Pedicure",
  "Khách văn phòng",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(isoOrDate?: string) {
  if (!isoOrDate) return "—";
  try {
    return new Date(isoOrDate).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoOrDate;
  }
}

function isBirthdayThisMonth(bday?: string) {
  if (!bday) return false;
  try {
    const currentMonth = new Date().getMonth() + 1;
    const parts = bday.split(/[-/]/);
    if (parts.length >= 2) {
      const monthPart = parts.length === 3 ? parseInt(parts[1], 10) : parseInt(parts[1], 10);
      return monthPart === currentMonth;
    }
  } catch {
    return false;
  }
  return false;
}

function daysSinceLastVisit(dateStr?: string) {
  if (!dateStr) return 999;
  try {
    const last = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.floor((now - last) / (1000 * 60 * 60 * 24));
  } catch {
    return 999;
  }
}

export default function CustomersPage() {
  const { locale, t, tOther } = useAdminLocale();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<{ type: string; text: string }>({ type: "", text: "" });

  // Modal states
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [detailAppointments, setDetailAppointments] = useState<Appointment[]>([]);
  const [loadingDetailAppts, setLoadingDetailAppts] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  function fetchCustomers() {
    setLoading(true);
    fetch("/api/customers")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setMsg({ type: "error", text: "Không thể tải danh sách khách hàng." }))
      .finally(() => setLoading(false));
  }

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  }

  async function openDetailModal(customer: Customer) {
    setDetailCustomer(customer);
    setLoadingDetailAppts(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetailAppointments(Array.isArray(data.appointments) ? data.appointments : []);
      }
    } catch {
      setDetailAppointments([]);
    } finally {
      setLoadingDetailAppts(false);
    }
  }

  function openAddModal() {
    setEditingCustomer({
      name: "",
      phone: "",
      email: "",
      birthday: "",
      gender: "female",
      tier: "standard",
      notes: "",
      tags: [],
      totalSpent: 0,
      visitCount: 1,
    });
    setEditModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setEditingCustomer({ ...customer });
    setEditModalOpen(true);
  }

  async function handleSaveCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCustomer?.name?.trim() || !editingCustomer?.phone?.trim()) {
      flash("error", "Vui lòng nhập họ tên và số điện thoại.");
      return;
    }

    setIsSaving(true);
    try {
      const isUpdating = Boolean(editingCustomer.id);
      const url = isUpdating ? `/api/customers/${editingCustomer.id}` : "/api/customers";
      const method = isUpdating ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCustomer),
      });

      const data = await res.json();
      if (res.ok) {
        flash("success", isUpdating ? "Đã cập nhật thông tin khách hàng!" : "Đã thêm khách hàng mới thành công!");
        setEditModalOpen(false);
        fetchCustomers();
        if (detailCustomer && detailCustomer.id === editingCustomer.id) {
          setDetailCustomer(data.customer);
        }
      } else {
        flash("error", data.error || "Không thể lưu thông tin.");
      }
    } catch {
      flash("error", "Đã xảy ra lỗi khi lưu thông tin.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCustomer(id: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa khách hàng "${name}" khỏi danh sách? Thao tác này không thể hoàn tác.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("success", `Đã xóa khách hàng "${name}".`);
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        if (detailCustomer?.id === id) setDetailCustomer(null);
      } else {
        flash("error", "Không thể xóa khách hàng này.");
      }
    } catch {
      flash("error", "Lỗi xảy ra khi xóa.");
    }
  }

  function toggleTag(tag: string) {
    if (!editingCustomer) return;
    const current = editingCustomer.tags || [];
    if (current.includes(tag)) {
      setEditingCustomer({ ...editingCustomer, tags: current.filter((t) => t !== tag) });
    } else {
      setEditingCustomer({ ...editingCustomer, tags: [...current, tag] });
    }
  }

  // Filter logic
  const filtered = customers.filter((c) => {
    const matchTier = tierFilter === "all" || c.tier === tierFilter;
    const matchTag = tagFilter === "all" || (c.tags && c.tags.includes(tagFilter));
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)));

    return matchTier && matchTag && matchSearch;
  });

  // KPI Calculations
  const vipCount = customers.filter((c) => c.tier === "diamond" || c.tier === "gold").length;
  const birthdayCount = customers.filter((c) => isBirthdayThisMonth(c.birthday)).length;
  const needCareCount = customers.filter((c) => daysSinceLastVisit(c.lastVisit) >= 21).length;

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý khách hàng & Chăm sóc</h1>
          <p className={styles.pageSubtitle}>
            {loading
              ? "Đang đồng bộ danh sách khách hàng..."
              : `Theo dõi hồ sơ, sở thích làm móng, lịch sử dịch vụ và chăm sóc khách hàng (${customers.length} khách hàng).`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AdminLanguageSelector compact light />
          <button type="button" onClick={openAddModal} className={styles.btnPrimary}>
            <MdAdd size={18} />
            <span>Thêm khách hàng mới</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.8rem" }}>
        <div
          className={styles.statCard}
          style={{ "--stat-color": "#967840", "--stat-bg": "rgba(194, 169, 121, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdPeople size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Tổng khách hàng</span>
            <span className={styles.statValue}>{loading ? "—" : customers.length}</span>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#B8860B", "--stat-bg": "rgba(218, 165, 32, 0.14)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdStar size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Khách hàng VIP (Gold & Diamond)</span>
            <span className={styles.statValue}>{loading ? "—" : vipCount}</span>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#8E44AD", "--stat-bg": "rgba(142, 68, 173, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdCake size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Sinh nhật tháng này</span>
            <span className={styles.statValue}>{loading ? "—" : birthdayCount}</span>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#C0392B", "--stat-bg": "rgba(192, 57, 43, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdNotificationsActive size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Nhắc làm móng lại (&gt;21 ngày)</span>
            <span className={styles.statValue}>{loading ? "—" : needCareCount}</span>
          </div>
        </div>
      </div>

      {/* Segmented Controls (Filter Tabs) */}
      <div className={styles.segmentedControls} style={{ marginBottom: "1rem" }}>
        {[
          { key: "all", label: "Tất cả hạng", count: customers.length },
          { key: "diamond", label: "Kim Cương VIP", count: customers.filter((c) => c.tier === "diamond").length },
          { key: "gold", label: "Hội Viên Vàng", count: customers.filter((c) => c.tier === "gold").length },
          { key: "silver", label: "Hội Viên Bạc", count: customers.filter((c) => c.tier === "silver").length },
          { key: "standard", label: "Tiêu Chuẩn", count: customers.filter((c) => c.tier === "standard").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTierFilter(tab.key)}
            className={`${styles.statusChoice} ${tierFilter === tab.key ? styles.statusChoiceActive : ""}`}
          >
            <span>{tab.label}</span>
            <span style={{ fontSize: 11.5, opacity: 0.85 }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {loading ? "Danh sách khách hàng" : `Danh sách khách hàng (${filtered.length})`}
          </span>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Tìm tên, SĐT, sở thích, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.controlInput}
                style={{ minWidth: "260px", paddingLeft: "34px", minHeight: "38px" }}
              />
              <MdSearch
                size={18}
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#A3968B",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Tag filter */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={styles.controlInput}
              style={{ minHeight: "38px", cursor: "pointer", width: "auto" }}
            >
              <option value="all">Tất cả nhãn / tags</option>
              {SUGGESTED_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <AdminLoading variant="table" label="Đang tải dữ liệu khách hàng..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ & Chăm sóc</th>
                  <th>Hạng hội viên</th>
                  <th>Chi tiêu & Lượt đến</th>
                  <th>Lần ghé gần nhất</th>
                  <th>Sở thích & Ghi chú chăm sóc</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const cfg = TIER_CONFIG[c.tier] || TIER_CONFIG.standard;
                  const TierIcon = cfg.icon;
                  const initial = c.name ? c.name.trim().charAt(0).toUpperCase() : "K";
                  const daysElapsed = daysSinceLastVisit(c.lastVisit);
                  const isBday = isBirthdayThisMonth(c.birthday);

                  return (
                    <tr key={c.id}>
                      {/* Name & Avatar */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className={cStyles.customerAvatar}>{initial}</div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <strong style={{ color: "#231B15", fontSize: "14px" }}>{c.name}</strong>
                              {isBday && (
                                <span title="Sinh nhật trong tháng này!" style={{ color: "#8E44AD", display: "inline-flex" }}>
                                  <MdCake size={16} />
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "11.5px", color: "#857567" }}>
                              {c.gender === "male" ? "Nam" : c.gender === "other" ? "Khác" : "Nữ"}
                              {c.birthday ? ` · Sinh: ${formatDate(c.birthday)}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Contacts */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <strong style={{ fontSize: "13px", color: "#2E2319" }}>{c.phone}</strong>
                          <a
                            href={`tel:${c.phone}`}
                            className={cStyles.contactBtn}
                            title="Gọi điện trực tiếp"
                          >
                            <MdPhone size={14} />
                          </a>
                          <a
                            href={`https://zalo.me/${c.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className={cStyles.zaloBtn}
                            title="Chat Zalo chăm sóc khách hàng"
                          >
                            Z
                          </a>
                        </div>
                        {c.email && (
                          <div style={{ fontSize: "11.5px", color: "#857567", marginTop: 2 }}>{c.email}</div>
                        )}
                      </td>

                      {/* Tier Badge */}
                      <td>
                        <span className={cfg.className}>
                          <TierIcon size={14} />
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      {/* Spent & Visits */}
                      <td>
                        <strong style={{ color: "#8C6514", display: "block", fontSize: "13px" }}>
                          {formatCurrency(c.totalSpent)}
                        </strong>
                        <span style={{ fontSize: "11.5px", color: "#78695C" }}>{c.visitCount} lượt làm dịch vụ</span>
                      </td>

                      {/* Last visit */}
                      <td>
                        <span style={{ fontSize: "12.5px", color: "#231B15" }}>{formatDate(c.lastVisit)}</span>
                        {daysElapsed < 999 && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: daysElapsed >= 21 ? "#C0392B" : "#857567",
                              fontWeight: daysElapsed >= 21 ? 700 : 500,
                            }}
                          >
                            {daysElapsed === 0
                              ? "Hôm nay"
                              : `${daysElapsed} ngày trước ${daysElapsed >= 21 ? "(cần nhắc lại)" : ""}`}
                          </span>
                        )}
                      </td>

                      {/* Notes & Tags */}
                      <td style={{ maxWidth: 260 }}>
                        {c.tags && c.tags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
                            {c.tags.slice(0, 3).map((t) => (
                              <span key={t} className={cStyles.tagChip}>
                                {t}
                              </span>
                            ))}
                            {c.tags.length > 3 && (
                              <span className={cStyles.tagChip} style={{ opacity: 0.8 }}>
                                +{c.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#5C4F44",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.45,
                          }}
                          title={c.notes}
                        >
                          {c.notes || "Chưa có ghi chú chăm sóc."}
                        </p>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => openDetailModal(c)}
                            className={styles.btnSecondary}
                            style={{ minHeight: "32px", padding: "0 9px" }}
                            title="Xem hồ sơ & Lịch sử dịch vụ"
                          >
                            <MdVisibility size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className={styles.btnEdit}
                            style={{ minHeight: "32px", padding: "0 9px" }}
                            title="Chỉnh sửa thông tin"
                          >
                            <MdEdit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(c.id, c.name)}
                            className={styles.btnDanger}
                            style={{ minHeight: "32px", padding: "0 8px" }}
                            title="Xóa khách hàng"
                          >
                            <MdDeleteOutline size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.emptyState}>
                        <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
                        <span>Không tìm thấy khách hàng nào phù hợp với bộ lọc.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL (Customer Profile & Care History) */}
      {detailCustomer && (
        <div className={cStyles.modalBackdrop} onClick={() => setDetailCustomer(null)}>
          <div className={cStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={cStyles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className={cStyles.customerAvatar} style={{ width: 46, height: 46, fontSize: 18 }}>
                  {detailCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#231B15" }}>{detailCustomer.name}</h3>
                  <span style={{ fontSize: 12, color: "#857567" }}>
                    Khách hàng từ {formatDate(detailCustomer.createdAt)} · {detailCustomer.visitCount} lượt đến
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailCustomer(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#857567" }}
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className={cStyles.modalBody}>
              {/* Privilege Banner */}
              {(() => {
                const cfg = TIER_CONFIG[detailCustomer.tier] || TIER_CONFIG.standard;
                const TierIcon = cfg.icon;
                return (
                  <div className={cStyles.privilegeBanner}>
                    <div style={{ fontSize: 26, color: "#8C6514" }}>
                      <TierIcon />
                    </div>
                    <div>
                      <strong style={{ color: "#2E2319", fontSize: 14 }}>
                        Đặc quyền {cfg.label}:
                      </strong>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#594B40" }}>{cfg.discount}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Contact & Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 14,
                  marginBottom: 20,
                  padding: "14px 16px",
                  background: "#F8F5F0",
                  borderRadius: 12,
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "#857567", textTransform: "uppercase", fontWeight: 700 }}>
                    Số điện thoại
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <strong style={{ color: "#231B15", fontSize: 14 }}>{detailCustomer.phone}</strong>
                    <a href={`tel:${detailCustomer.phone}`} className={cStyles.contactBtn} title="Gọi ngay">
                      <MdPhone size={13} />
                    </a>
                    <a
                      href={`https://zalo.me/${detailCustomer.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cStyles.zaloBtn}
                      title="Mở Zalo"
                    >
                      Z
                    </a>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: "#857567", textTransform: "uppercase", fontWeight: 700 }}>
                    Ngày sinh nhật
                  </span>
                  <div style={{ marginTop: 3, fontSize: 13.5, color: "#2E2319" }}>
                    {formatDate(detailCustomer.birthday)}
                    {isBirthdayThisMonth(detailCustomer.birthday) && (
                      <span style={{ color: "#8E44AD", fontWeight: 700, marginLeft: 6 }}>🎂 (Tháng này!)</span>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: "#857567", textTransform: "uppercase", fontWeight: 700 }}>
                    Tổng chi tiêu tích lũy
                  </span>
                  <div style={{ marginTop: 3, fontSize: 14, fontWeight: 750, color: "#8C6514" }}>
                    {formatCurrency(detailCustomer.totalSpent)}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: "#857567", textTransform: "uppercase", fontWeight: 700 }}>
                    Lần ghé gần nhất
                  </span>
                  <div style={{ marginTop: 3, fontSize: 13.5, color: "#2E2319" }}>
                    {formatDate(detailCustomer.lastVisit)} ({daysSinceLastVisit(detailCustomer.lastVisit)} ngày trước)
                  </div>
                </div>
              </div>

              {/* Tags */}
              {detailCustomer.tags && detailCustomer.tags.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontSize: 11, color: "#857567", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }}>
                    Nhãn phân loại (Tags)
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {detailCustomer.tags.map((t) => (
                      <span key={t} className={cStyles.tagChip} style={{ fontSize: 12, padding: "3px 9px" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Notes & Preferences */}
              <div className={cStyles.profileSection}>
                <div className={cStyles.profileSectionTitle}>
                  <span>Sổ tay sở thích & Ghi chú chăm sóc móng</span>
                </div>
                <div className={cStyles.notesCard}>
                  {detailCustomer.notes ? (
                    <div style={{ whiteSpace: "pre-wrap" }}>{detailCustomer.notes}</div>
                  ) : (
                    <span style={{ color: "#857567", fontStyle: "italic" }}>
                      Chưa có ghi chú sở thích móng cho khách này. Nhấn nút &quot;Chỉnh sửa&quot; để bổ sung thông tin
                      như: form móng ưa chuộng, màu sơn quen thuộc, tình trạng da nhạy cảm,...
                    </span>
                  )}
                </div>
              </div>

              {/* Appointment History */}
              <div className={cStyles.profileSection} style={{ marginBottom: 0 }}>
                <div className={cStyles.profileSectionTitle}>
                  <MdHistory size={18} />
                  <span>Lịch sử đặt hẹn & Sử dụng dịch vụ</span>
                </div>

                {loadingDetailAppts ? (
                  <p style={{ color: "#857567", fontSize: 13 }}>Đang tìm kiếm lịch sử các cuộc hẹn...</p>
                ) : detailAppointments.length === 0 ? (
                  <div
                    style={{
                      background: "#F8F5F0",
                      padding: "16px 20px",
                      borderRadius: 12,
                      fontSize: 13,
                      color: "#78695C",
                      textAlign: "center",
                    }}
                  >
                    Chưa có lịch hẹn nào được ghi nhận từ số điện thoại này trong hệ thống đặt lịch.
                  </div>
                ) : (
                  <div style={{ border: "1px solid rgba(194,169,121,0.25)", borderRadius: 12, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                      <thead style={{ background: "#F4EFE6", color: "#5C4F44", textAlign: "left" }}>
                        <tr>
                          <th style={{ padding: "8px 12px" }}>Ngày & Giờ</th>
                          <th style={{ padding: "8px 12px" }}>Dịch vụ</th>
                          <th style={{ padding: "8px 12px" }}>Trạng thái</th>
                          <th style={{ padding: "8px 12px" }}>Ghi chú hẹn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailAppointments.map((appt) => (
                          <tr key={appt.id} style={{ borderTop: "1px solid rgba(194,169,121,0.15)" }}>
                            <td style={{ padding: "9px 12px", whiteSpace: "nowrap", fontWeight: 600 }}>
                              {appt.date} · {appt.time}
                            </td>
                            <td style={{ padding: "9px 12px" }}>
                              <span style={{ fontWeight: 600, color: "#2E2319" }}>{t(appt.serviceName) || "—"}</span>
                              {tOther(appt.serviceName) && (
                                <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2 }}>
                                  ({tOther(appt.serviceName)})
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "9px 12px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background:
                                    appt.status === "confirmed"
                                      ? "rgba(86,133,92,0.12)"
                                      : appt.status === "completed"
                                      ? "rgba(120,105,92,0.12)"
                                      : appt.status === "cancelled"
                                      ? "rgba(184,70,59,0.1)"
                                      : "rgba(194,169,121,0.14)",
                                  color:
                                    appt.status === "confirmed"
                                      ? "#2D603A"
                                      : appt.status === "completed"
                                      ? "#594B40"
                                      : appt.status === "cancelled"
                                      ? "#99352A"
                                      : "#967840",
                                }}
                              >
                                {appt.status === "confirmed"
                                  ? "Đã xác nhận"
                                  : appt.status === "completed"
                                  ? "Hoàn thành"
                                  : appt.status === "cancelled"
                                  ? "Đã hủy"
                                  : "Mới"}
                              </span>
                            </td>
                            <td style={{ padding: "9px 12px", color: "#78695C" }}>{appt.note || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className={cStyles.modalFooter}>
              <button
                type="button"
                onClick={() => {
                  const cust = detailCustomer;
                  setDetailCustomer(null);
                  openEditModal(cust);
                }}
                className={styles.btnPrimary}
              >
                <MdEdit size={15} />
                <span>Chỉnh sửa hồ sơ này</span>
              </button>
              <button type="button" onClick={() => setDetailCustomer(null)} className={styles.btnSecondary}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {editModalOpen && editingCustomer && (
        <div className={cStyles.modalBackdrop} onClick={() => setEditModalOpen(false)}>
          <div className={cStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveCustomer}>
              <div className={cStyles.modalHeader}>
                <h3 style={{ margin: 0, fontSize: 17, color: "#231B15" }}>
                  {editingCustomer.id ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#857567" }}
                >
                  <MdClose size={22} />
                </button>
              </div>

              <div className={cStyles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>
                      Họ và tên khách hàng <span style={{ color: "#C0392B" }}>*</span>
                    </label>
                    <input
                      required
                      value={editingCustomer.name || ""}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      placeholder="VD: Elena Minh Anh"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>
                      Số điện thoại <span style={{ color: "#C0392B" }}>*</span>
                    </label>
                    <input
                      required
                      value={editingCustomer.phone || ""}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                      placeholder="VD: 0988 654 321"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Email liên hệ</label>
                    <input
                      type="email"
                      value={editingCustomer.email || ""}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                      placeholder="VD: minhanh@gmail.com"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Ngày sinh (YYYY-MM-DD hoặc DD/MM)</label>
                    <input
                      value={editingCustomer.birthday || ""}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, birthday: e.target.value })}
                      placeholder="VD: 1996-10-18"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Giới tính</label>
                    <select
                      value={editingCustomer.gender || "female"}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          gender: e.target.value as "female" | "male" | "other",
                        })
                      }
                    >
                      <option value="female">Nữ</option>
                      <option value="male">Nam</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>Hạng hội viên</label>
                    <select
                      value={editingCustomer.tier || "standard"}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          tier: e.target.value as "standard" | "silver" | "gold" | "diamond",
                        })
                      }
                    >
                      <option value="standard">Tiêu chuẩn (Khách mới)</option>
                      <option value="silver">Hội viên Bạc (Silver)</option>
                      <option value="gold">Hội viên Vàng (Gold)</option>
                      <option value="diamond">Hội viên Kim Cương VIP (Diamond)</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>Tổng chi tiêu tích lũy (VNĐ)</label>
                    <input
                      type="number"
                      value={editingCustomer.totalSpent ?? 0}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, totalSpent: parseInt(e.target.value, 10) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Số lượt đã làm dịch vụ</label>
                    <input
                      type="number"
                      value={editingCustomer.visitCount ?? 0}
                      onChange={(e) =>
                        setEditingCustomer({ ...editingCustomer, visitCount: parseInt(e.target.value, 10) || 0 })
                      }
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Quick Tags Selection */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#231B15" }}>
                    Nhãn chăm sóc (Bấm để chọn nhanh)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = editingCustomer.tags?.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          style={{
                            padding: "5px 11px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            border: isSelected
                              ? "1px solid #967840"
                              : "1px solid rgba(194, 169, 121, 0.3)",
                            background: isSelected ? "rgba(194, 169, 121, 0.22)" : "#FFFFFF",
                            color: isSelected ? "#8C6514" : "#6E5E52",
                          }}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Care Notes */}
                <div style={{ marginTop: 18 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#231B15" }}>
                    Sổ tay sở thích & Ghi chú chăm sóc móng
                  </label>
                  <textarea
                    rows={4}
                    value={editingCustomer.notes || ""}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                    placeholder="VD: Thích form Hạnh nhân, màu sơn thạch nude nhẹ nhàng. Da khóe mỏng nhạy cảm dễ xước, lưu ý dùng kềm bén nhẹ tay. Thích uống trà hoa cúc nóng khi ngâm chân..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(194, 169, 121, 0.3)",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              <div className={cStyles.modalFooter}>
                <button type="button" onClick={() => setEditModalOpen(false)} className={styles.btnSecondary}>
                  Hủy bỏ
                </button>
                <button type="submit" disabled={isSaving} className={styles.btnPrimary}>
                  {isSaving ? "Đang lưu..." : editingCustomer.id ? "Lưu thay đổi" : "Tạo khách hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
