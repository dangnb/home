"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdSpa, MdDeleteOutline, MdEdit, MdAdd } from "react-icons/md";

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
  const [services, setServices] = useState<Service[]>([]);
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

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${name}" không? Thao tác này không thể hoàn tác.`)) return;
    await fetch(`/api/services/${slug}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.slug !== slug));
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

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Tất cả dịch vụ" : `Tất cả dịch vụ (${services.length})`}
          </span>
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
                          alt={s.name}
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
                      <strong style={{ color: "#231B15" }}>{s.name}</strong>
                      <br />
                      <code style={{ fontSize: "11.5px", color: "#857567", fontWeight: 500 }}>{s.slug}</code>
                    </td>
                    <td>
                      <span className={styles.badge}>{s.categoryId}</span>
                    </td>
                    <td style={{ color: "#78695C", fontWeight: 500 }}>{s.duration} phút</td>
                    <td>
                      <span style={{ color: "#967840", fontWeight: 700 }}>{s.price}</span>
                      {s.promoPrice && (
                        <>
                          <br />
                          <span style={{ textDecoration: "line-through", color: "#A3968B", fontSize: 12 }}>
                            {s.promoPrice}
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
                          onClick={() => handleDelete(s.slug, s.name)}
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
