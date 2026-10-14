"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdSpa, MdAdd, MdClose, MdCheck, MdDeleteOutline } from "react-icons/md";

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

const DEFAULT_CATEGORIES = ["Manicure", "Pedicure", "Gel Nails", "Nail Art", "Extensions"];

export default function PriceListPage() {
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

  function updateItem(catIdx: number, itemIdx: number, key: keyof PriceItem, val: string) {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      items: next[catIdx].items.map((item, i) => (i === itemIdx ? { ...item, [key]: val } : item)),
    };
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

  function addCategory() {
    const name = prompt("Nhập tên danh mục giá mới:");
    if (!name) return;
    setCategories((prev) => [...prev, { category: name, items: [], order: prev.length }]);
  }

  function removeCategory(idx: number) {
    if (!confirm(`Bạn có chắc muốn xóa nhóm giá "${categories[idx].category}" và toàn bộ dịch vụ bên trong?`)) return;
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: categories.map((c, i) => ({ ...c, order: i })) }),
      });
      if (res.ok) flash("success", "Đã lưu bảng giá thành công!");
      else flash("error", "Lỗi khi lưu bảng giá. Vui lòng thử lại!");
    } catch {
      flash("error", "Lỗi kết nối mạng.");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bảng giá dịch vụ</h1>
          <p className={styles.pageSubtitle}>Thiết lập chi tiết giá và thời lượng cho từng liệu trình tại salon.</p>
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

      {isInitialLoading ? (
        <AdminLoading variant="form" label="Đang tải dữ liệu bảng giá..." />
      ) : (
        categories.map((cat, catIdx) => (
          <div key={cat.category} className={styles.formCard} style={{ marginBottom: "1.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                className={styles.cardSectionTitle}
                style={{
                  borderBottom: "none",
                  marginBottom: 0,
                  paddingBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MdSpa size={18} style={{ color: "#967840" }} />
                <span>{cat.category}</span>
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
                  gridTemplateColumns: "1fr 130px 130px 42px",
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
                <span>Tên dịch vụ</span>
                <span>Thời lượng</span>
                <span>Giá dịch vụ</span>
                <span></span>
              </div>

              {cat.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className={styles.priceEditorRow}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 130px 130px 42px",
                    gap: "0.6rem",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                    placeholder="VD: Classic Manicure"
                    className={styles.controlInput}
                  />
                  <input
                    value={item.duration}
                    onChange={(e) => updateItem(catIdx, itemIdx, "duration", e.target.value)}
                    placeholder="VD: 45 phút"
                    className={styles.controlInput}
                  />
                  <input
                    value={item.price}
                    onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)}
                    placeholder="VD: 590 CZK"
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
              ))}

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
          <span>Chưa có danh mục giá nào. Hãy nhấn &quot;Thêm nhóm giá&quot; để bắt đầu.</span>
        </div>
      )}
    </div>
  );
}
