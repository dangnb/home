"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { MdAdd, MdCloudUpload, MdDeleteOutline, MdPhotoLibrary, MdClose } from "react-icons/md";
import { confirmAction } from "@/lib/confirmDialog";

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
  const { locale, t, tOther, joinBilingual } = useAdminLocale();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("Tất cả");
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLang, setActiveLang] = useState<"vi" | "en">(locale);
  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("Gel Nails");
  const [image, setImage] = useState("");
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
        setImage(data.url);
        flash("success", "Tải ảnh lên thành công!");
      } else {
        flash("error", data.error || "Không thể tải ảnh lên. Vui lòng thử lại với tệp ảnh hợp lệ.");
      }
    } catch {
      flash("error", "Đã xảy ra sự cố trong quá trình tải ảnh. Vui lòng kiểm tra lại kết nối mạng.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAdd() {
    if (!image) return flash("error", "Vui lòng tải ảnh lên hoặc nhập đường dẫn hình ảnh.");
    const fullTitle = joinBilingual(titleVi, titleEn);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fullTitle || "Mẫu Móng Nghệ Thuật | Nail Art Design",
          image,
          category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, data.item]);
        setTitleVi("");
        setTitleEn("");
        setImage("");
        setCategory("Gel Nails");
        setShowAdd(false);
        flash("success", "Đã thêm tác phẩm vào bộ sưu tập!");
      } else {
        const d = await res.json().catch(() => ({}));
        flash("error", d.error || "Không thể thêm tác phẩm vào bộ sưu tập. Vui lòng thử lại.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi thêm tác phẩm.");
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirmAction({
      title: "Xóa tác phẩm?",
      text: "Bạn có chắc muốn xóa ảnh này khỏi bộ sưu tập?",
      confirmButtonText: "Xóa ảnh",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        flash("success", "Đã xóa ảnh khỏi bộ sưu tập thành công!");
      } else {
        const d = await res.json().catch(() => ({}));
        flash("error", d.error || "Không thể xóa ảnh. Vui lòng thử lại sau.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi xóa ảnh.");
    }
  }

  function matchesCategory(itemCat: string, filterCat: string) {
    if (filterCat === "Tất cả") return true;
    if (!itemCat) return filterCat === "Khác";
    const lowerItem = itemCat.toLowerCase();
    const lowerFilter = filterCat.toLowerCase();
    if (lowerFilter === "gel nails") return lowerItem.includes("gel");
    if (lowerFilter === "nail art") return lowerItem.includes("art") || lowerItem.includes("vẽ");
    if (lowerFilter === "manicure") return lowerItem.includes("manicure") || lowerItem.includes("tay");
    if (lowerFilter === "pedicure") return lowerItem.includes("pedicure") || lowerItem.includes("chân");
    if (lowerFilter === "extensions") return lowerItem.includes("extension") || lowerItem.includes("nối") || lowerItem.includes("đắp");
    return lowerItem.includes(lowerFilter);
  }

  const filtered = items.filter((i) => matchesCategory(i.category, filter));

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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AdminLanguageSelector compact light />
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className={styles.btnPrimary}
          >
            {showAdd ? <MdClose size={16} /> : <MdAdd size={16} />}
            <span>{showAdd ? "Đóng form" : "Thêm ảnh mới"}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className={styles.formCard} style={{ marginBottom: "1.8rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: "1.2rem",
            paddingBottom: "0.8rem",
            borderBottom: "1px solid rgba(194, 169, 121, 0.22)"
          }}>
            <div className={styles.cardSectionTitle} style={{ margin: 0, border: "none", padding: 0 }}>
              Thêm tác phẩm vào bộ sưu tập
            </div>

            <div style={{
              display: "inline-flex",
              padding: "3px",
              background: "rgba(194, 169, 121, 0.12)",
              borderRadius: "20px",
              border: "1px solid rgba(194, 169, 121, 0.35)",
              gap: "3px"
            }}>
              <button
                type="button"
                onClick={() => setActiveLang("vi")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeLang === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                  color: activeLang === "vi" ? "#FFFFFF" : "#78695C",
                }}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeLang === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                  color: activeLang === "en" ? "#FFFFFF" : "#78695C",
                }}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Đường dẫn ảnh hoặc tải tệp lên <span style={{ color: "#C0392B" }}>*</span></label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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

            {activeLang === "vi" ? (
              <div className={styles.formField}>
                <label>Tên tác phẩm (Tiếng Việt)</label>
                <input
                  value={titleVi}
                  onChange={(e) => setTitleVi(e.target.value)}
                  placeholder="VD: Móng Mắt Mèo Ánh Kim Sa"
                />
              </div>
            ) : (
              <div className={styles.formField}>
                <label>Artwork Title (English)</label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Cat Eye Shimmer Nails"
                />
              </div>
            )}

            <div className={styles.formField}>
              <label>Nhóm phong cách / Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          {image && (
            <div style={{ marginTop: 16 }}>
              <span className={styles.formHelpText} style={{ marginBottom: 6 }}>Xem trước ảnh:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
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
          const count = c === "Tất cả" ? items.length : items.filter((i) => matchesCategory(i.category, c)).length;
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
          {filtered.map((item) => {
            const displayTitle = t(item.title) || "Tác phẩm Nail";
            const otherTitle = tOther(item.title);
            const displayCategory = t(item.category) || "Chung";

            return (
              <div key={item.id} className={styles.galleryCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={displayTitle}
                  className={styles.galleryImage}
                />
                <div className={styles.galleryCardBody}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: "#231B15", marginBottom: otherTitle ? 3 : 8, lineHeight: 1.35 }}>
                    {displayTitle}
                  </div>
                  {otherTitle && (
                    <div style={{ fontSize: 11.5, color: "#857567", fontStyle: "italic", marginBottom: 8, lineHeight: 1.3 }}>
                      ({otherTitle})
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={styles.badge}>{displayCategory}</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
