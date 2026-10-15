"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import {
  MdArticle,
  MdPublic,
  MdDrafts,
  MdEdit,
  MdVisibility,
  MdDeleteOutline,
  MdAdd,
  MdSearch,
} from "react-icons/md";
import { confirmAction } from "@/lib/confirmDialog";

interface Post {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  status: "published" | "draft";
  thumbnail: string;
  createdAt: string;
  excerpt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "xu-huong": "Xu hướng Nail Art",
  "kinh-nghiem": "Bí quyết & Kinh nghiệm",
  "cham-soc": "Chăm sóc & Dưỡng móng",
  "tin-tuc": "Tin tức & Salon",
  "uu-dai": "Ưu đãi đặc quyền",
  "gia-ve": "Bảng giá",
  "phao-hoa": "Ưu đãi",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PostsListPage() {
  const { locale, t, tOther } = useAdminLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  }

  async function handleDelete(id: string, title: string) {
    const displayTitle = t(title) || title;
    const ok = await confirmAction({
      title: "Xóa bài viết?",
      text: `Bạn có chắc muốn xóa bài viết "${displayTitle}" không? Thao tác này không thể hoàn tác.`,
      confirmButtonText: "Xóa bài viết",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        flash("success", `Đã xóa bài viết "${displayTitle}" thành công.`);
      } else {
        const d = await res.json().catch(() => ({}));
        flash("error", d.error || "Không thể xóa bài viết này. Vui lòng thử lại sau.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi xóa bài viết.");
    }
  }

  const filtered = posts.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const localizedTitle = t(p.title);
    const matchSearch = localizedTitle.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bài viết & Tin tức</h1>
          <p className={styles.pageSubtitle}>Soạn thảo, lưu nháp và xuất bản các bài viết chia sẻ từ Mộc Salon.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AdminLanguageSelector compact light />
          <Link href="/admin/posts/new" className={styles.btnPrimary}>
            <MdAdd size={16} />
            <span>Thêm bài viết</span>
          </Link>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Stats */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.8rem" }}>
        <div
          className={styles.statCard}
          style={{ "--stat-color": "#967840", "--stat-bg": "rgba(194, 169, 121, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdArticle size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Tổng bài viết</span>
            <span className={styles.statValue}>{isInitialLoading ? "—" : posts.length}</span>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#2D603A", "--stat-bg": "rgba(86, 133, 92, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdPublic size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Đã xuất bản</span>
            <span className={styles.statValue}>{isInitialLoading ? "—" : publishedCount}</span>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#A87932", "--stat-bg": "rgba(168, 121, 50, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdDrafts size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Bản nháp</span>
            <span className={styles.statValue}>{isInitialLoading ? "—" : draftCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>
            {isInitialLoading ? "Danh sách bài viết" : `Danh sách bài viết (${filtered.length})`}
          </span>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.controlInput}
                style={{ minWidth: "220px", paddingLeft: "34px", minHeight: "38px" }}
              />
              <MdSearch
                size={16}
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
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.controlInput}
              style={{ minHeight: "38px", cursor: "pointer", width: "auto" }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">✦ Đã xuất bản</option>
              <option value="draft">— Bản nháp</option>
            </select>
          </div>
        </div>

        {isInitialLoading ? (
          <AdminLoading variant="table" label="Đang tải danh sách bài viết..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Ảnh bìa</th>
                  <th>Tiêu đề bài viết</th>
                  <th>Chuyên mục</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} className={styles.thumb} />
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
                          <MdArticle size={20} />
                        </div>
                      )}
                    </td>
                    <td>
                      <strong style={{ display: "block", marginBottom: 3, color: "#231B15" }}>{t(p.title)}</strong>
                      {tOther(p.title) && (
                        <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginBottom: 3 }}>
                          ({tOther(p.title)})
                        </div>
                      )}
                      <code style={{ fontSize: "11.5px", color: "#857567", fontWeight: 500 }}>/bai-viet/{p.slug}</code>
                    </td>
                    <td>
                      <span className={styles.badge}>{CATEGORY_LABELS[p.categoryId] ?? p.categoryId}</span>
                    </td>
                    <td>
                      {p.status === "published" ? (
                        <span
                          className={styles.badge}
                          style={{
                            background: "rgba(86, 133, 92, 0.12)",
                            color: "#2D603A",
                            borderColor: "rgba(86, 133, 92, 0.3)",
                          }}
                        >
                          ✦ Đã xuất bản
                        </span>
                      ) : (
                        <span
                          className={styles.badge}
                          style={{
                            background: "rgba(168, 121, 50, 0.12)",
                            color: "#A87932",
                            borderColor: "rgba(168, 121, 50, 0.3)",
                          }}
                        >
                          — Bản nháp
                        </span>
                      )}
                    </td>
                    <td style={{ color: "#78695C", fontSize: "12.5px" }}>{formatDate(p.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <Link href={`/admin/posts/${p.id}`} className={styles.btnEdit} title="Chỉnh sửa bài viết">
                          <MdEdit size={14} />
                          <span>Sửa</span>
                        </Link>
                        {p.status === "published" && (
                          <a
                            href={`/bai-viet/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.btnSecondary}
                            style={{ minHeight: "33px", padding: "0 10px" }}
                            title="Xem trên website"
                          >
                            <MdVisibility size={15} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          className={styles.btnDanger}
                          title="Xóa bài viết"
                          style={{ minHeight: "33px", padding: "0 10px" }}
                        >
                          <MdDeleteOutline size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className={styles.emptyState}>
                        <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
                        <span>Không tìm thấy bài viết nào phù hợp.</span>
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
