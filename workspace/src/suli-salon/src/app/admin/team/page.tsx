"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { TeamMemberData } from "@/lib/db";
import AdminLoading from "@/components/Admin/AdminLoading";
import { MdAdd, MdCloudUpload, MdDeleteOutline, MdClose, MdGroups } from "react-icons/md";

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMemberData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", role: "Nail Artist", image: "", bio: "", order: 0 });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
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
        flash("success", "Tải ảnh đại diện thành công!");
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
    if (!newItem.name) return flash("error", "Tên thành viên là bắt buộc");
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      setNewItem({ name: "", role: "Nail Artist", image: "", bio: "", order: 0 });
      setShowAdd(false);
      flash("success", "Đã thêm thành viên vào đội ngũ!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa thành viên này khỏi đội ngũ?")) return;
    const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      flash("success", "Đã xóa thành viên thành công!");
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Đội ngũ nghệ nhân</h1>
          <p className={styles.pageSubtitle}>
            {isInitialLoading
              ? "Đang tải danh sách đội ngũ..."
              : `Quản lý các nghệ sĩ nail và chuyên viên chăm sóc sắc đẹp tại salon (${items.length} thành viên).`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className={styles.btnPrimary}
        >
          {showAdd ? <MdClose size={16} /> : <MdAdd size={16} />}
          <span>{showAdd ? "Đóng form" : "Thêm thành viên"}</span>
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

      {showAdd && (
        <div className={styles.formCard} style={{ marginBottom: "1.8rem" }}>
          <div className={styles.cardSectionTitle}>Thêm thành viên mới</div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Họ và tên nghệ nhân</label>
              <input
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                placeholder="VD: Elena Nguyễn"
              />
            </div>
            <div className={styles.formField}>
              <label>Chức danh / Vị trí</label>
              <input
                value={newItem.role}
                onChange={(e) => setNewItem((p) => ({ ...p, role: e.target.value }))}
                placeholder="VD: Master Nail Artist & Educator"
              />
            </div>
            <div className={styles.formField}>
              <label>Ảnh đại diện hoặc tải tệp lên</label>
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
                  <span>{isUploading ? "Đang tải..." : "Tải ảnh"}</span>
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
              <label>Thứ tự hiển thị</label>
              <input
                type="number"
                value={newItem.order}
                onChange={(e) => setNewItem((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>Tiểu sử / Giới thiệu tay nghề</label>
              <input
                value={newItem.bio}
                onChange={(e) => setNewItem((p) => ({ ...p, bio: e.target.value }))}
                placeholder="VD: Hơn 6 năm kinh nghiệm trong kỹ thuật vẽ cọ nét và đính đá haute-couture..."
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "1.2rem" }}>
            <button type="button" onClick={handleAdd} className={styles.btnPrimary}>
              <MdAdd size={16} />
              <span>Lưu thành viên</span>
            </button>
            {newItem.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={newItem.image}
                alt="Xem trước ảnh chân dung"
                style={{
                  width: 52,
                  height: 52,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #C2A979",
                }}
              />
            )}
          </div>
        </div>
      )}

      {isInitialLoading ? (
        <AdminLoading variant="cards" label="Đang tải danh sách đội ngũ..." />
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: 26, opacity: 0.6 }}>✦</span>
          <span>Chưa có thành viên nào trong đội ngũ. Hãy thêm thành viên đầu tiên!</span>
        </div>
      ) : (
        <div className={styles.entityGrid}>
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.entityCard}
              style={{
                padding: "20px",
                position: "relative",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "rgba(184, 70, 59, 0.08)",
                  border: "1px solid rgba(184, 70, 59, 0.2)",
                  color: "#99352A",
                  borderRadius: 7,
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "grid",
                  placeItems: "center",
                  transition: "all 0.2s ease",
                }}
                title="Xóa thành viên"
              >
                <MdDeleteOutline size={15} />
              </button>

              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: "rgba(194, 169, 121, 0.12)",
                  border: "1.5px solid rgba(194, 169, 121, 0.35)",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#967840",
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              <div style={{ paddingRight: 28 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#231B15" }}>{item.name}</div>
                <div style={{ fontSize: 12.5, color: "#967840", fontWeight: 600, marginBottom: 4 }}>{item.role}</div>
                {item.bio && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#78695C",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.45,
                    }}
                  >
                    {item.bio}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
