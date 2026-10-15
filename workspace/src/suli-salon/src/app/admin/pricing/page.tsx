"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { MdSpa, MdAdd, MdClose, MdCheck, MdDeleteOutline, MdLanguage } from "react-icons/md";
import Swal from "sweetalert2";
import { confirmAction } from "@/lib/confirmDialog";

interface PriceItem {
  name: string;
  duration: string;
  price: string;
}
interface PriceCategory {
  category: string;
  items: PriceItem[];
  order: number;
}

const DEFAULT_CATEGORIES = [
  "Chăm Sóc Móng Tay | Manicure",
  "Chăm Sóc Móng Chân | Pedicure",
  "Nghệ Thuật Vẽ Móng | Nail Art",
  "Nối Móng & Đắp Bột | Extensions",
];

export default function PriceListPage() {
  const { locale, t, tOther, splitBilingual, joinBilingual } = useAdminLocale();
  const [editLang, setEditLang] = useState<"vi" | "en">(locale);

  const [categories, setCategories] = useState<PriceCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then(async (r) => {
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
      })
      .then((data: PriceCategory[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ category: c, items: [], order: i })));
        } else {
          setCategories(data);
        }
      })
      .catch(() => setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ category: c, items: [], order: i }))))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  }

  function getPart(val: string, lang: "vi" | "en") {
    return splitBilingual(val)[lang] || "";
  }

  function setPart(original: string, newVal: string, lang: "vi" | "en") {
    const parts = splitBilingual(original);
    parts[lang] = newVal;
    return joinBilingual(parts.vi, parts.en);
  }

  function updateItem(catIdx: number, itemIdx: number, key: keyof PriceItem, val: string) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: next[catIdx].items.map((item, i) => {
        if (i !== itemIdx) return item;
        const currentVal = item[key];
        const updatedVal = setPart(currentVal, val, editLang);
        return { ...item, [key]: updatedVal };
      }),
    };
    setCategories(next);
  }

  function updateCategoryName(catIdx: number, val: string) {
    const next = [...categories];
    const updated = setPart(next[catIdx].category, val, editLang);
    next[catIdx] = { ...next[catIdx], category: updated };
    setCategories(next);
  }

  function addItem(catIdx: number) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: [...next[catIdx].items, { name: "", duration: "", price: "" }],
    };
    setCategories(next);
  }

  function removeItem(catIdx: number, itemIdx: number) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: next[catIdx].items.filter((_, i) => i !== itemIdx),
    };
    setCategories(next);
  }

  async function addCategory() {
    const isVi = editLang === "vi";
    const { value: name } = await Swal.fire({
      title: isVi ? "Thêm nhóm bảng giá" : "Add Price Category",
      input: "text",
      inputLabel: isVi ? "Nhập tên nhóm dịch vụ mới:" : "Enter new category name:",
      inputPlaceholder: isVi ? "VD: Chăm Sóc Móng Chân" : "e.g. Pedicure Spa",
      showCancelButton: true,
      confirmButtonText: isVi ? "Thêm nhóm" : "Add Category",
      cancelButtonText: isVi ? "Hủy bỏ" : "Cancel",
      confirmButtonColor: "#967840",
      cancelButtonColor: "#857567",
      reverseButtons: true,
      background: "#FDFBF7",
      color: "#2C2219",
      backdrop: "rgba(20, 16, 12, 0.65)",
      customClass: {
        popup: "luxury-swal-popup",
        title: "luxury-swal-title",
        htmlContainer: "luxury-swal-text",
        confirmButton: "luxury-swal-confirm-btn",
        cancelButton: "luxury-swal-cancel-btn",
        input: "luxury-swal-input",
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return isVi ? "Vui lòng nhập tên nhóm dịch vụ!" : "Please enter a category name!";
        }
      },
    });
    if (!name || !name.trim()) return;
    const catName = isVi ? joinBilingual(name.trim(), "") : joinBilingual("", name.trim());
    setCategories((prev) => [...prev, { category: catName, items: [], order: prev.length }]);
    flash("success", "Đã thêm nhóm giá mới. Hãy lưu lại thay đổi sau khi hoàn tất.");
  }

  async function removeCategory(idx: number) {
    const catTitle = t(categories[idx].category) || categories[idx].category;
    const ok = await confirmAction({
      title: "Xóa nhóm giá?",
      text: `Bạn có chắc muốn xóa nhóm giá "${catTitle}" và toàn bộ dịch vụ bên trong?`,
      confirmButtonText: "Xóa nhóm giá",
    });
    if (!ok) return;
    setCategories((prev) => prev.filter((_, i) => i !== idx));
    flash("success", `Đã xóa nhóm giá "${catTitle}".`);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: categories.map((c, i) => ({ ...c, order: i })) }),
      });
      if (res.ok) {
        flash("success", "Đã lưu bảng giá dịch vụ thành công!");
      } else {
        flash("error", "Không thể lưu bảng giá dịch vụ. Vui lòng kiểm tra lại thông tin.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ hoặc mạng không ổn định. Vui lòng thử lại sau.");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng giá dịch vụ</h1>
          <p className={styles.pageSubtitle}>Thiết lập chi tiết giá và thời lượng cho từng liệu trình tại salon theo ngôn ngữ.</p>
        </div>
        <div className={styles.pageActions}>
          <button type="button" onClick={addCategory} className={styles.btnSecondary}>
            <MdAdd size={16} />
            <span>Thêm nhóm giá</span>
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className={styles.btnPrimary}>
            <MdCheck size={16} />
            <span>{saving ? "Đang lưu..." : "Lưu bảng giá"}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {/* Language Switcher Toolbar for Pricing */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid rgba(194, 169, 121, 0.28)",
        borderRadius: "14px",
        padding: "14px 20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        boxShadow: "0 2px 10px rgba(35, 27, 21, 0.03)"
      }}>
        <div>
          <strong style={{ fontSize: "13.5px", color: "#231B15", display: "flex", alignItems: "center", gap: 6 }}>
            <MdLanguage size={18} color="#967840" />
            <span>Chế độ ngôn ngữ soạn bảng giá:</span>
          </strong>
          <span style={{ fontSize: "12px", color: "#857567", marginTop: 2, display: "block" }}>
            Đang chỉnh sửa và hiển thị nội dung theo: <b>{editLang === "vi" ? "Tiếng Việt (VNĐ)" : "English (Currency)"}</b>
          </span>
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
            onClick={() => setEditLang("vi")}
            style={{
              padding: "6px 14px",
              borderRadius: "16px",
              border: "none",
              fontSize: "12px",
              fontWeight: 750,
              cursor: "pointer",
              background: editLang === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
              color: editLang === "vi" ? "#FFFFFF" : "#78695C",
              boxShadow: editLang === "vi" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
            }}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setEditLang("en")}
            style={{
              padding: "6px 14px",
              borderRadius: "16px",
              border: "none",
              fontSize: "12px",
              fontWeight: 750,
              cursor: "pointer",
              background: editLang === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
              color: editLang === "en" ? "#FFFFFF" : "#78695C",
              boxShadow: editLang === "en" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {isInitialLoading ? (
        <AdminLoading variant="form" label="Đang tải dữ liệu bảng giá..." />
      ) : (
        categories.map((cat, catIdx) => (
          <div key={catIdx} className={styles.formCard} style={{ marginBottom: "1.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div
                className={styles.cardSectionTitle}
                style={{
                  borderBottom: "none",
                  marginBottom: 0,
                  paddingBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: 1
                }}
              >
                <MdSpa size={18} style={{ color: "#967840" }} />
                <input
                  value={getPart(cat.category, editLang)}
                  onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                  placeholder={editLang === "vi" ? "Tên nhóm (Tiếng Việt)..." : "Category name (English)..."}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#231B15",
                    border: "1px solid rgba(194, 169, 121, 0.3)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    maxWidth: "320px",
                    background: "#FDFBF7",
                  }}
                />
                {getPart(cat.category, editLang === "vi" ? "en" : "vi") && (
                  <span style={{ fontSize: "12px", color: "#8C7B6D", fontStyle: "italic" }}>
                    ({editLang === "vi" ? "EN: " : "VI: "}{getPart(cat.category, editLang === "vi" ? "en" : "vi")})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeCategory(catIdx)}
                className={styles.btnDanger}
                style={{ fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <MdDeleteOutline size={14} />
                <span>Xóa nhóm</span>
              </button>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              {/* Header */}
              <div
                className={styles.priceEditorHeader}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 140px 42px",
                  gap: "0.6rem",
                  marginBottom: "0.6rem",
                  fontSize: 11,
                  fontWeight: 750,
                  color: "#78695C",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.3,
                }}
              >
                <span>{editLang === "vi" ? "Tên dịch vụ (Tiếng Việt)" : "Service Name (English)"}</span>
                <span>{editLang === "vi" ? "Thời lượng" : "Duration"}</span>
                <span>{editLang === "vi" ? "Bảng giá" : "Price"}</span>
                <span></span>
              </div>

              {cat.items.map((item, itemIdx) => {
                const currentName = getPart(item.name, editLang);
                const otherName = getPart(item.name, editLang === "vi" ? "en" : "vi");

                const currentDuration = getPart(item.duration, editLang);
                const currentPrice = getPart(item.price, editLang);

                return (
                  <div
                    key={itemIdx}
                    className={styles.priceEditorRow}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 140px 140px 42px",
                      gap: "0.6rem",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <input
                        value={currentName}
                        onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                        placeholder={editLang === "vi" ? "VD: Cắt Da & Sơn Móng" : "e.g. Classic Manicure"}
                        className={styles.controlInput}
                      />
                      {otherName && (
                        <div style={{ fontSize: "11px", color: "#8C7B6D", fontStyle: "italic", marginTop: 2, paddingLeft: 4 }}>
                          {editLang === "vi" ? "EN: " : "VI: "}{otherName}
                        </div>
                      )}
                    </div>
                    <input
                      value={currentDuration}
                      onChange={(e) => updateItem(catIdx, itemIdx, "duration", e.target.value)}
                      placeholder={editLang === "vi" ? "VD: 45 phút" : "e.g. 45 mins"}
                      className={styles.controlInput}
                    />
                    <input
                      value={currentPrice}
                      onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)}
                      placeholder={editLang === "vi" ? "VD: 250.000 VNĐ" : "e.g. $10"}
                      className={styles.controlInput}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(catIdx, itemIdx)}
                      className={styles.btnDanger}
                      style={{ padding: 0, minHeight: 40, width: 42, display: "grid", placeItems: "center" }}
                      title="Xóa dịch vụ này"
                    >
                      <MdClose size={15} />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => addItem(catIdx)}
                className={styles.btnSecondary}
                style={{ marginTop: "0.8rem", fontSize: 12.5 }}
              >
                <MdAdd size={15} />
                <span>Thêm dòng dịch vụ</span>
              </button>
            </div>
          </div>
        ))
      )}

      {!isInitialLoading && categories.length === 0 && (
        <div className={styles.emptyState}>
          <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
          <span>Chưa có nhóm giá nào. Bấm "Thêm nhóm giá" để bắt đầu.</span>
        </div>
      )}
    </div>
  );
}
