"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { MdSpa, MdDeleteOutline, MdEdit, MdAdd } from "react-icons/md";
import { confirmAction } from "@/lib/confirmDialog";

interface Service {
  slug: string;
  name: string;
  categoryId: string;
  price: string;
  promoPrice: string;
  duration: number;
  image: string;
  isActive: boolean;
}

export default function ServicesListPage() {
  const { locale, t, tPrice, tOther } = useAdminLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  }

  async function handleDelete(slug: string, name: string) {
    const displayTitle = t(name) || name;
    const ok = await confirmAction({
      title: "Xóa dịch vụ?",
      text: `Bạn có chắc muốn xóa dịch vụ "${displayTitle}" không? Thao tác này không thể hoàn tác.`,
      confirmButtonText: "Xóa dịch vụ",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/services/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.slug !== slug));
        flash("success", `Đã xóa dịch vụ "${displayTitle}" thành công.`);
      } else {
        const d = await res.json().catch(() => ({}));
        flash("error", d.error || "Không thể xóa dịch vụ này. Vui lòng thử lại sau.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi xóa dịch vụ.");
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dịch vụ salon</h1>
          <p className={styles.pageSubtitle}>Quản lý các liệu trình chăm sóc móng và làm đẹp tại Mộc Salon.</p>
        </div>
        <Link href="/admin/services/new" className={styles.btnPrimary}>
          <MdAdd size={16} />
          <span>Thêm dịch vụ</span>
        </Link>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Tất cả dịch vụ" : `Tất cả dịch vụ (${services.length})`}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "12px", color: "#857567", fontWeight: 600 }}>Ngôn ngữ hiển thị:</span>
            <AdminLanguageSelector compact light />
          </div>
        </div>

        {isInitialLoading ? (
          <AdminLoading variant="table" label="Đang tải danh sách dịch vụ..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên liệu trình</th>
                  <th>Danh mục</th>
                  <th>Thời lượng</th>
                  <th>Bảng giá</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.slug}>
                    <td>
                      {s.image ? (
                        <Image
                          src={s.image}
                          alt={t(s.name)}
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
                      <strong style={{ color: "#231B15" }}>{t(s.name)}</strong>
                      {tOther(s.name) && (
                        <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2 }}>
                          {locale === "vi" ? "EN: " : "VI: "}{tOther(s.name)}
                        </div>
                      )}
                      <code style={{ fontSize: "11.5px", color: "#857567", fontWeight: 500, display: "block", marginTop: 2 }}>{s.slug}</code>
                    </td>
                    <td>
                      <span className={styles.badge}>{t(s.categoryId)}</span>
                    </td>
                    <td style={{ color: "#78695C", fontWeight: 500 }}>{s.duration} phút</td>
                    <td>
                      <span style={{ color: "#967840", fontWeight: 700 }}>{tPrice(s.price)}</span>
                      {s.promoPrice && (
                        <>
                          <br />
                          <span style={{ textDecoration: "line-through", color: "#A3968B", fontSize: 12 }}>
                            {tPrice(s.promoPrice)}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <span
                        className={styles.badge}
                        style={{
                          background: s.isActive ? "rgba(86, 133, 92, 0.12)" : "rgba(120, 105, 92, 0.12)",
                          color: s.isActive ? "#2D603A" : "#594B40",
                          borderColor: s.isActive ? "rgba(86, 133, 92, 0.3)" : "rgba(120, 105, 92, 0.26)",
                        }}
                      >
                        {s.isActive ? "✦ Đang hiển thị" : "— Đang ẩn"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <Link href={`/admin/services/${s.slug}`} className={styles.btnEdit} title="Chỉnh sửa">
                          <MdEdit size={14} />
                          <span>Sửa</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.slug, t(s.name) || s.name)}
                          className={styles.btnDanger}
                          title="Xóa dịch vụ"
                          style={{ padding: "0 10px", minHeight: "33px" }}
                        >
                          <MdDeleteOutline size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.emptyState}>
                        <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
                        <span>
                          Chưa có dịch vụ nào trong salon.{" "}
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
        )}
      </div>
    </div>
  );
}
