"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdAdd, MdCloudUpload, MdDeleteOutline, MdPhotoLibrary, MdClose } from "react-icons/md";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = ["Tất cả", "Gel Nails", "Nail Art", "Manicure", "Pedicure", "Extensions", "Khác"];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("Tất cả");
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", image: "", category: "Gel Nails" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setNewItem((p) => ({ ...p, image: data.url }));
        flash("success", "Tải ảnh lên thành công!");
      } else {
        flash("error", data.error || "Tải ảnh thất bại");
      }
    } catch {
      flash("error", "Đã xảy ra lỗi trong quá trình tải ảnh");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAdd() {
    if (!newItem.image) return flash("error", "Vui lòng nhập URL ảnh hoặc tải tệp ảnh lên");
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      setNewItem({ title: "", image: "", category: "Gel Nails" });
      setShowAdd(false);
      flash("success", "Đã thêm tác phẩm vào bộ sưu tập!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa ảnh này khỏi bộ sưu tập?")) return;
    const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      flash("success", "Đã xóa ảnh thành công!");
    }
  }

  const filtered = filter === "Tất cả" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bộ sưu tập tác phẩm</h1>
          <p className={styles.pageSubtitle}>
            {isInitialLoading
              ? "Đang đồng bộ bộ sưu tập ảnh..."
              : `Lưu giữ và trưng bày các mẫu nail thiết kế nghệ thuật (${items.length} tác phẩm).`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className={styles.btnPrimary}
        >
          {showAdd ? <MdClose size={16} /> : <MdAdd size={16} />}
          <span>{showAdd ? "Đóng form" : "Thêm ảnh mới"}</span>
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className={styles.formCard} style={{ marginBottom: "1.8rem" }}>
          <div className={styles.cardSectionTitle}>Thêm tác phẩm vào bộ sưu tập</div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Đường dẫn ảnh hoặc tải tệp lên</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={newItem.image}
                  onChange={(e) => setNewItem((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                <label
                  style={{
                    background: "rgba(194, 169, 121, 0.12)",
                    padding: "9px 14px",
                    borderRadius: 11,
                    cursor: "pointer",
                    border: "1px solid rgba(194, 169, 121, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#967840",
                    fontWeight: 700,
                    fontSize: 12.5,
                  }}
                >
                  <MdCloudUpload size={16} />
                  <span>{isUploading ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div className={styles.formField}>
              <label>Tên tác phẩm (tùy chọn)</label>
              <input
                value={newItem.title}
                onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))}
                placeholder="VD: Rose Gold Gel Nails Art"
              />
            </div>

            <div className={styles.formField}>
              <label>Nhóm phong cách / Danh mục</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                onClick={handleAdd}
                className={styles.btnPrimary}
                style={{ width: "100%", minHeight: "42px" }}
              >
                <MdAdd size={16} />
                <span>Lưu vào bộ sưu tập</span>
              </button>
            </div>
          </div>

          {newItem.image && (
            <div style={{ marginTop: 16 }}>
              <span className={styles.formHelpText} style={{ marginBottom: 6 }}>Xem trước ảnh:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newItem.image}
                alt="Xem trước ảnh"
                style={{
                  width: 220,
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 14,
                  border: "1px solid rgba(194, 169, 121, 0.28)",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.segmentedControls}>
        {CATEGORIES.map((c) => {
          const isSelected = filter === c;
          const count = c === "Tất cả" ? items.length : items.filter((i) => i.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`${styles.statusChoice} ${isSelected ? styles.statusChoiceActive : ""}`}
            >
              <span>{c}</span>
              <span style={{ fontSize: 11.5, opacity: 0.85 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {isInitialLoading ? (
        <AdminLoading variant="cards" label="Đang tải các tác phẩm bộ sưu tập..." />
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
          <span>Chưa có tác phẩm nào trong danh mục này. Hãy thêm ảnh mới!</span>
        </div>
      ) : (
        <div className={styles.galleryGrid}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.galleryCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title || "Tác phẩm nail Mộc Salon"}
                className={styles.galleryImage}
              />
              <div className={styles.galleryCardBody}>
                {item.title ? (
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#231B15", marginBottom: 8, lineHeight: 1.35 }}>
                    {item.title}
                  </div>
                ) : (
                  <div style={{ fontSize: 12.5, color: "#857567", fontStyle: "italic", marginBottom: 8 }}>
                    Chưa đặt tên
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={styles.badge}>{item.category || "Chung"}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className={styles.btnDanger}
                    style={{ padding: "0 8px", minHeight: "30px" }}
                    title="Xóa ảnh này"
                  >
                    <MdDeleteOutline size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
