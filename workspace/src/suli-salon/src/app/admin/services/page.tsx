"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";

interface Service { slug: string; name: string; categoryId: string; price: string; promoPrice: string; duration: number; image: string; isActive: boolean; }

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(async r => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/services/${slug}`, { method: "DELETE" });
    setServices(prev => prev.filter(s => s.slug !== slug));
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dịch vụ</h1>
          <p className={styles.pageSubtitle}>Quản lý các liệu trình chăm sóc móng của salon.</p>
        </div>
        <Link href="/admin/services/new" className={styles.btnPrimary}>+ Thêm dịch vụ</Link>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Tất cả dịch vụ" : `Tất cả dịch vụ (${services.length})`}
          </span>
        </div>
        {isInitialLoading ? (
          <AdminLoading variant="table" label="Đang tải dịch vụ..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên dịch vụ</th>
                  <th>Danh mục</th>
                  <th>Thời lượng</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.slug}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {s.image ? (
                        <img src={s.image} alt={s.name} className={styles.thumb} />
                      ) : (
                        <div
                          className={styles.thumb}
                          style={{
                            background: "#f4f1ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          💅
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{s.name}</strong>
                      <br />
                      <code style={{ fontSize: "12px", color: "#75695e", fontWeight: 500 }}>{s.slug}</code>
                    </td>
                    <td>
                      <span className={styles.badge}>{s.categoryId}</span>
                    </td>
                    <td style={{ color: "#888" }}>{s.duration} min</td>
                    <td>
                      <span style={{ color: "#C2A979", fontWeight: 700 }}>{s.price}</span>
                      {s.promoPrice && (
                        <>
                          <br />
                          <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: 12 }}>
                            {s.promoPrice}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <span
                        className={styles.badge}
                        style={{
                          background: s.isActive ? "#d1fae5" : "#fee2e2",
                          color: s.isActive ? "#065f46" : "#991b1b",
                          border: "none",
                        }}
                      >
                        {s.isActive ? "Đang hiển thị" : "Đang ẩn"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <Link href={`/admin/services/${s.slug}`} className={styles.btnEdit}>
                          Chỉnh sửa
                        </Link>
                        <button onClick={() => handleDelete(s.slug, s.name)} className={styles.btnDanger}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💅</div>
                      Chưa có dịch vụ.{" "}
                      <Link href="/admin/services/new" style={{ color: "#876938", fontWeight: 700 }}>
                        Thêm dịch vụ →
                      </Link>
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
