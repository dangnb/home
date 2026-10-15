"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { TeamMemberData } from "@/lib/db";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale, AdminLanguageSelector } from "@/components/Admin/AdminLocaleContext";
import { MdAdd, MdCloudUpload, MdDeleteOutline, MdClose, MdGroups, MdLanguage } from "react-icons/md";

export default function AdminTeamPage() {
  const { locale, t, tOther, joinBilingual } = useAdminLocale();
  const [activeLang, setActiveLang] = useState<"vi" | "en">(locale);

  const [items, setItems] = useState<TeamMemberData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [roleVi, setRoleVi] = useState("Nghệ Nhân Móng");
  const [roleEn, setRoleEn] = useState("Nail Artist");
  const [bioVi, setBioVi] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState(0);

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
        setImage(data.url);
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
    if (!name.trim()) return flash("error", "Tên thành viên là bắt buộc");

    const fullRole = joinBilingual(roleVi, roleEn);
    const fullBio = joinBilingual(bioVi, bioEn);

    const payload = {
      name: name.trim(),
      role: fullRole || "Nail Artist",
      bio: fullBio,
      image,
      order,
    };

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      setName("");
      setRoleVi("Nghệ Nhân Móng");
      setRoleEn("Nail Artist");
      setBioVi("");
      setBioEn("");
      setImage("");
      setOrder(0);
      setShowAdd(false);
      flash("success", "Đã thêm thành viên vào đội ngũ!");
    } else {
      flash("error", "Không thể thêm thành viên. Vui lòng thử lại.");
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
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AdminLanguageSelector compact light />
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className={styles.btnPrimary}
          >
            {showAdd ? <MdClose size={16} /> : <MdAdd size={16} />}
            <span>{showAdd ? "Đóng form" : "Thêm thành viên"}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.2rem" }}>
          {msg.text}
        </p>
      )}

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
              Thêm thành viên mới
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
              <label>Họ và tên nghệ nhân <span style={{ color: "#C0392B" }}>*</span></label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Linh Trần (Master Linh)"
              />
            </div>

            {activeLang === "vi" ? (
              <div className={styles.formField}>
                <label>Chức danh / Vị trí (Tiếng Việt)</label>
                <input
                  value={roleVi}
                  onChange={(e) => setRoleVi(e.target.value)}
                  placeholder="VD: Nghệ Nhân Móng Trưởng & Đồng Sáng Lập"
                />
              </div>
            ) : (
              <div className={styles.formField}>
                <label>Role / Position (English)</label>
                <input
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="e.g. Head Nail Artist & Co-Founder"
                />
              </div>
            )}

            <div className={styles.formField}>
              <label>Ảnh đại diện hoặc tải tệp lên</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#231B15",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: isUploading ? "not-allowed" : "pointer",
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
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className={`${styles.formField} ${styles.fullWidth}`}>
              <label>
                {activeLang === "vi" ? "Tiểu sử / Giới thiệu tay nghề (Tiếng Việt)" : "Biography / Expertise (English)"}
              </label>
              {activeLang === "vi" ? (
                <textarea
                  value={bioVi}
                  onChange={(e) => setBioVi(e.target.value)}
                  placeholder="VD: Hơn 8 năm tâm huyết với nghệ thuật móng, theo đuổi trường phái tối giản tinh tế..."
                  rows={3}
                />
              ) : (
                <textarea
                  value={bioEn}
                  onChange={(e) => setBioEn(e.target.value)}
                  placeholder="e.g. Over 8 years mastering nail artistry, embracing mindful minimalism..."
                  rows={3}
                />
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button type="button" onClick={handleAdd} className={styles.btnPrimary}>
              <MdAdd size={16} />
              <span>Lưu thành viên</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className={styles.btnSecondary}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {isInitialLoading ? (
        <AdminLoading variant="grid" label="Đang tải danh sách thành viên..." />
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: 32, opacity: 0.5 }}>✦</span>
          <span>Chưa có thành viên nào trong đội ngũ. Bấm nút Thêm thành viên ở trên.</span>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.formCard}
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

              <div style={{ paddingRight: 28, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#231B15" }}>{item.name}</div>
                <div style={{ fontSize: 12.5, color: "#967840", fontWeight: 600, marginTop: 2 }}>
                  {t(item.role)}
                </div>
                {tOther(item.role) && (
                  <div style={{ fontSize: 11, color: "#8C7B6D", fontStyle: "italic", marginBottom: 4 }}>
                    ({tOther(item.role)})
                  </div>
                )}
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
                      marginTop: 4,
                    }}
                  >
                    {t(item.bio)}
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
