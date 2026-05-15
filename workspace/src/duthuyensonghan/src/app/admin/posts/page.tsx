"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

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
  "tin-tuc": "Tin Tức",
  "kinh-nghiem": "Kinh Nghiệm",
  "gia-ve": "Giá Vé",
  "phao-hoa": "Pháo Hoa",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  const filtered = posts.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📝 Quản Lý Bài Viết</h1>
        <Link href="/admin/posts/new" className={styles.btnPrimary}>
          + Thêm Bài Viết
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid} style={{ marginBottom: "1.5rem" }}>
        <div className={styles.statCard} style={{ "--stat-color": "#01bf93", "--stat-bg": "#f0fdf9" } as React.CSSProperties}>
          <div className={styles.statIconWrap}><span className={styles.statIcon}>📝</span></div>
          <div>
            <span className={styles.statLabel}>Tổng Bài Viết</span>
            <span className={styles.statValue}>{posts.length}</span>
          </div>
        </div>
        <div className={styles.statCard} style={{ "--stat-color": "#3b82f6", "--stat-bg": "#eff6ff" } as React.CSSProperties}>
          <div className={styles.statIconWrap}><span className={styles.statIcon}>🌐</span></div>
          <div>
            <span className={styles.statLabel}>Đã Xuất Bản</span>
            <span className={styles.statValue}>{publishedCount}</span>
          </div>
        </div>
        <div className={styles.statCard} style={{ "--stat-color": "#f59e0b", "--stat-bg": "#fffbeb" } as React.CSSProperties}>
          <div className={styles.statIconWrap}><span className={styles.statIcon}>📋</span></div>
          <div>
            <span className={styles.statLabel}>Bản Nháp</span>
            <span className={styles.statValue}>{draftCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Danh sách ({filtered.length} bài)</span>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Tìm theo tiêu đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "0.45rem 0.85rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.875rem",
                outline: "none",
                minWidth: "200px",
              }}
            />
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.45rem 0.85rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.875rem",
                outline: "none",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu Đề</th>
              <th>Danh Mục</th>
              <th>Trạng Thái</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
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
                      style={{
                        width: 64,
                        height: 48,
                        background: "#f1f5f9",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                      }}
                    >
                      📝
                    </div>
                  )}
                </td>
                <td>
                  <strong style={{ display: "block", marginBottom: "0.2rem" }}>{p.title}</strong>
                  <code style={{ fontSize: "0.75rem", color: "#94a3b8" }}>/bai-viet/{p.slug}</code>
                </td>
                <td>
                  <span className={styles.badge}>
                    {CATEGORY_LABELS[p.categoryId] ?? p.categoryId}
                  </span>
                </td>
                <td>
                  {p.status === "published" ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      🌐 Xuất bản
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        background: "#fef3c7",
                        color: "#92400e",
                        border: "1px solid #fde68a",
                      }}
                    >
                      📋 Nháp
                    </span>
                  )}
                </td>
                <td style={{ color: "#64748b", fontSize: "0.82rem" }}>
                  {formatDate(p.createdAt)}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <Link href={`/admin/posts/${p.id}`} className={styles.btnEdit}>
                      ✏️ Sửa
                    </Link>
                    {p.status === "published" && (
                      <a
                        href={`/bai-viet/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.btnSecondary}
                        style={{ fontSize: "0.78rem", padding: "0.4rem 0.7rem" }}
                      >
                        👁️
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className={styles.btnDanger}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
                >
                  {search || statusFilter !== "all"
                    ? "Không tìm thấy bài viết phù hợp."
                    : <>Chưa có bài viết nào. <Link href="/admin/posts/new" style={{ color: "#01bf93" }}>Thêm ngay →</Link></>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
