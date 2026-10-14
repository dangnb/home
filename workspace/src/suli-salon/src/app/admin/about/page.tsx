"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import aStyles from "./about.module.css";
import { SiteSettings } from "@/lib/db";
import AdminLoading from "@/components/Admin/AdminLoading";
import ImageUpload from "@/components/ImageUpload";
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdAutoAwesome,
  MdCheck,
  MdDeleteOutline,
  MdGroups,
  MdImage,
  MdInfoOutline,
  MdMenuBook,
  MdOpenInNew,
  MdStorefront,
  MdVisibility,
} from "react-icons/md";

const VALUE_PRESETS = [
  {
    title: "Vô trùng y tế 100% (Medical-grade Sterilization)",
    description: "Toàn bộ kềm, dũa và phụ kiện đều trải qua quy trình khử khuẩn bằng nồi sấy nhiệt cao cấp và đóng túi tiệt trùng riêng biệt cho từng khách.",
  },
  {
    title: "Sản phẩm thuần chay & Cruelty-Free",
    description: "Cam kết 100% dòng sơn gel hữu cơ nhập khẩu từ Hàn Quốc, Nhật Bản và Châu Âu, không chứa hóa chất độc hại, bảo vệ móng tự nhiên chắc khỏe.",
  },
  {
    title: "Nghệ thuật vẽ tay cá nhân hóa (Bespoke Artistry)",
    description: "Mỗi thiết kế móng là một tác phẩm độc bản được sáng tạo riêng theo phong cách, tone da và năng lượng cá nhân của từng khách hàng.",
  },
  {
    title: "Bảo hành độ bền móng 7 ngày",
    description: "Mộc Salon hỗ trợ dặm lại màu sơn hoặc đính lại đá hoàn toàn miễn phí trong vòng 7 ngày đầu tiên nếu xảy ra bất kỳ sự cố ngoài ý muốn.",
  },
  {
    title: "Không gian trà đạo & Thư giãn tĩnh lặng",
    description: "Tận hưởng những tách trà hoa cúc nóng ấm, hương tinh dầu dịu nhẹ và giai điệu thư thái sau những giờ làm việc căng thẳng.",
  },
  {
    title: "Chuyên viên tay nghề cao & Tận tâm",
    description: "Đội ngũ kỹ thuật viên tối thiểu 3-5 năm kinh nghiệm, sở hữu chứng chỉ thẩm mỹ quốc tế, luôn ân cần và nâng niu từng đầu ngón tay của bạn.",
  },
];

const DEFAULT_BANNER = "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg";
const DEFAULT_IMAGE1 = "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg";
const DEFAULT_IMAGE2 = "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg";

export default function AdminAboutContentPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    aboutHeadline: "",
    aboutSubheadline: "",
    bannerImage: "",
    aboutImage1: "",
    aboutImage2: "",
    aboutValues: [],
  });
  const [teamCount, setTeamCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"story" | "visuals" | "values" | "preview">("story");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => (r.ok ? (r.json() as Promise<Partial<SiteSettings>>) : ({} as Partial<SiteSettings>))),
      fetch("/api/team").then((r) => (r.ok ? (r.json() as Promise<unknown[]>) : ([] as unknown[]))),
    ])
      .then(([settingsData, teamData]: [Partial<SiteSettings>, unknown[]]) => {
        setSettings({
          aboutHeadline: settingsData.aboutHeadline || "Nghệ thuật chăm sóc móng tinh tế",
          aboutSubheadline:
            settingsData.aboutSubheadline ||
            "Với đội ngũ tận tâm và kỹ thuật tỉ mỉ, Mộc Salon là điểm đến lý tưởng cho những ai yêu thích vẻ đẹp tự nhiên, trang nhã.",
          bannerImage: settingsData.bannerImage || DEFAULT_BANNER,
          aboutImage1: settingsData.aboutImage1 || DEFAULT_IMAGE1,
          aboutImage2: settingsData.aboutImage2 || DEFAULT_IMAGE2,
          aboutValues: Array.isArray(settingsData.aboutValues) && settingsData.aboutValues.length > 0
            ? settingsData.aboutValues
            : [
                {
                  title: "Chăm chút tỉ mỉ từng chi tiết",
                  description: "Mỗi bộ móng đều được kỹ thuật viên chăm sóc tỉ mỉ từ phom dáng đến màu sắc.",
                },
                {
                  title: "Dòng sơn cao cấp & An toàn",
                  description: "Chỉ sử dụng sản phẩm sơn gel chính hãng, không chứa hóa chất độc hại, bảo vệ móng tự nhiên.",
                },
                {
                  title: "Vệ sinh vô trùng tuyệt đối",
                  description: "Toàn bộ kềm, dũa và phụ kiện đều được khử trùng bằng máy tiệt trùng chuyên dụng trước khi dùng.",
                },
              ],
        });
        setTeamCount(Array.isArray(teamData) ? teamData.length : 0);
      })
      .catch(() => setMsg({ type: "error", text: "Không thể tải cấu hình trang giới thiệu." }))
      .finally(() => setIsInitialLoading(false));
  }, []);

  function flash(type: string, text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aboutHeadline: settings.aboutHeadline,
          aboutSubheadline: settings.aboutSubheadline,
          bannerImage: settings.bannerImage,
          aboutImage1: settings.aboutImage1,
          aboutImage2: settings.aboutImage2,
          aboutValues: settings.aboutValues,
        }),
      });
      if (res.ok) {
        flash("success", "Đã lưu nội dung và bộ ảnh trang giới thiệu thành công!");
      } else {
        flash("error", "Lỗi khi lưu thiết lập trang giới thiệu.");
      }
    } catch {
      flash("error", "Lỗi kết nối máy chủ khi lưu.");
    } finally {
      setIsSaving(false);
    }
  }

  function addValue(preset?: { title: string; description: string }) {
    setSettings((prev) => ({
      ...prev,
      aboutValues: [
        ...(prev.aboutValues || []),
        preset ? { ...preset } : { title: "", description: "" },
      ],
    }));
    flash("success", preset ? `Đã thêm mẫu: "${preset.title}"` : "Đã thêm giá trị mới.");
  }

  function updateValue(index: number, field: "title" | "description", val: string) {
    setSettings((prev) => {
      const arr = [...(prev.aboutValues || [])];
      arr[index] = { ...arr[index], [field]: val };
      return { ...prev, aboutValues: arr };
    });
  }

  function moveValue(index: number, direction: "up" | "down") {
    setSettings((prev) => {
      const arr = [...(prev.aboutValues || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[targetIndex];
      arr[targetIndex] = temp;
      return { ...prev, aboutValues: arr };
    });
  }

  function removeValue(index: number) {
    setSettings((prev) => ({
      ...prev,
      aboutValues: (prev.aboutValues || []).filter((_, i) => i !== index),
    }));
  }

  if (isInitialLoading) {
    return <AdminLoading variant="form" label="Đang tải studio trang giới thiệu..." />;
  }

  const valuesCount = (settings.aboutValues || []).length;
  const imageCount = [settings.bannerImage, settings.aboutImage1, settings.aboutImage2].filter(Boolean).length;

  return (
    <div>
      {/* ── Studio Header ── */}
      <div className={aStyles.studioHeader}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 className={styles.pageTitle} style={{ margin: 0 }}>
              Quản lý trang giới thiệu (About Studio)
            </h1>
            <span className={aStyles.badgeLive}>
              <span className={aStyles.badgeLiveDot} />
              <span>Đang hoạt động</span>
            </span>
          </div>
          <p className={styles.pageSubtitle}>
            Thiết kế câu chuyện thương hiệu, hình ảnh không gian salon và những giá trị cốt lõi xuất hiện trên trang Giới thiệu.
          </p>
        </div>

        <div className={styles.pageActions}>
          <Link
            href="/vi/gioi-thieu"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondary}
            title="Mở trang Giới thiệu thực tế trên giao diện khách hàng"
          >
            <MdOpenInNew size={16} />
            <span>Xem trang thực tế</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className={styles.btnPrimary}
            disabled={isSaving}
          >
            <MdCheck size={17} />
            <span>{isSaving ? "Đang lưu thay đổi..." : "Lưu thay đổi"}</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{ marginBottom: "1.5rem" }}>
          {msg.text}
        </p>
      )}

      {/* ── Quick KPI / Architecture Stats ── */}
      <div className={styles.statsGrid} style={{ marginBottom: "22px" }}>
        <div
          className={styles.statCard}
          style={{ "--stat-color": "#967840", "--stat-bg": "rgba(194, 169, 121, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdMenuBook size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Tiêu đề câu chuyện</span>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#231B15", marginTop: 2 }}>
              {settings.aboutHeadline ? "Đã tối ưu chuẩn Salon" : "Chưa nhập tiêu đề"}
            </div>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#8C6514", "--stat-bg": "rgba(218, 165, 32, 0.14)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdImage size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Hình ảnh không gian</span>
            <div className={styles.statValue}>{imageCount}/3</div>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#2D603A", "--stat-bg": "rgba(86, 133, 92, 0.12)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdAutoAwesome size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Giá trị cốt lõi</span>
            <div className={styles.statValue}>{valuesCount}</div>
          </div>
        </div>

        <div
          className={styles.statCard}
          style={{ "--stat-color": "#85603F", "--stat-bg": "rgba(133, 96, 63, 0.1)" } as React.CSSProperties}
        >
          <div className={styles.statIconWrap}>
            <MdGroups size={22} className={styles.statIcon} />
          </div>
          <div>
            <span className={styles.statLabel}>Đội ngũ chuyên viên</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className={styles.statValue}>{teamCount}</span>
              <Link href="/admin/team" style={{ fontSize: 11.5, color: "#967840", fontWeight: 700, textDecoration: "none" }}>
                Quản lý →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Studio Section Tabs ── */}
      <div className={aStyles.tabsContainer}>
        <button
          type="button"
          onClick={() => setActiveTab("story")}
          className={`${aStyles.tabItem} ${activeTab === "story" ? aStyles.tabActive : ""}`}
        >
          <MdMenuBook size={16} />
          <span>1. Tiêu đề & Câu chuyện</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("visuals")}
          className={`${aStyles.tabItem} ${activeTab === "visuals" ? aStyles.tabActive : ""}`}
        >
          <MdStorefront size={16} />
          <span>2. Hình ảnh không gian & Sứ mệnh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("values")}
          className={`${aStyles.tabItem} ${activeTab === "values" ? aStyles.tabActive : ""}`}
        >
          <MdAutoAwesome size={16} />
          <span>3. Giá trị cốt lõi ({valuesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`${aStyles.tabItem} ${activeTab === "preview" ? aStyles.tabActive : ""}`}
        >
          <MdVisibility size={16} />
          <span>4. Xem trước trực tiếp (Live Preview)</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 1: STORY & HEADLINES                              */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "story" && (
        <div className={styles.formCard}>
          <div className={styles.cardSectionTitle}>Khối giới thiệu mở đầu (Hero Section)</div>

          <div className={styles.formField}>
            <label>
              Tiêu đề nghệ thuật (Headline) <span style={{ color: "#C0392B" }}>*</span>
            </label>
            <input
              value={settings.aboutHeadline || ""}
              onChange={(e) => setSettings((s) => ({ ...s, aboutHeadline: e.target.value }))}
              placeholder="VD: Nghệ thuật chăm sóc móng tinh tế"
              style={{ fontSize: "15px", fontWeight: 600 }}
            />
            <span className={styles.formHelpText}>
              Xuất hiện nổi bật với font chữ Playfair Display in nghiêng trên nền ảnh không gian tiệm.
            </span>
          </div>

          <div className={styles.formField} style={{ marginTop: "20px" }}>
            <label>
              Mô tả triết lý & Lời dẫn thương hiệu (Subheadline) <span style={{ color: "#C0392B" }}>*</span>
            </label>
            <textarea
              value={settings.aboutSubheadline || ""}
              onChange={(e) => setSettings((s) => ({ ...s, aboutSubheadline: e.target.value }))}
              placeholder="VD: Với đội ngũ tận tâm và kỹ thuật tỉ mỉ, Mộc Salon là điểm đến lý tưởng cho những ai yêu thích vẻ đẹp tự nhiên, trang nhã và sự thư thái trọn vẹn..."
              rows={4}
              style={{ lineHeight: 1.6 }}
            />
            <span className={styles.formHelpText}>
              Đoạn văn ngắn (khoảng 30 - 60 từ) truyền tải cảm hứng, phong cách móng và cam kết chất lượng phục vụ của salon.
            </span>
          </div>

          <div className={aStyles.adviceBox}>
            <strong style={{ color: "#8C6514", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <MdInfoOutline size={16} />
              <span>Gợi ý phong cách nghệ thuật Mộc Salon</span>
            </strong>
            Khách hàng làm móng cao cấp đặc biệt quan tâm đến 3 yếu tố: <em>sự tỉ mỉ, độ bền của form móng và cảm giác thư giãn tuyệt đối</em>. Hãy dùng ngôn từ ấm áp, tôn vinh vẻ đẹp tự nhiên và sự nâng niu bản thân.
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 2: SANCTUARY VISUALS                              */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "visuals" && (
        <div>
          <div className={aStyles.imagesGrid}>
            {/* 1. Banner Background */}
            <div className={aStyles.imageUploadCard}>
              <h3 className={aStyles.cardHeaderTitle}>Ảnh nền Hero Banner</h3>
              <p className={aStyles.cardHeaderSubtitle}>
                Ảnh toàn cảnh không gian salon hoặc bàn làm việc sang trọng (khuyên dùng tỉ lệ 16:9, tối thiểu 1920x1080px).
              </p>
              <ImageUpload
                value={settings.bannerImage || DEFAULT_BANNER}
                onChange={(url) => setSettings((s) => ({ ...s, bannerImage: url }))}
                label="Tải ảnh nền chính"
              />
            </div>

            {/* 2. About Image 1 */}
            <div className={aStyles.imageUploadCard}>
              <h3 className={aStyles.cardHeaderTitle}>Ảnh Sứ Mệnh 1 (Dụng cụ & Móng)</h3>
              <p className={aStyles.cardHeaderSubtitle}>
                Ảnh chụp cận cảnh bộ dụng cụ tiệt trùng, chai sơn gel cao cấp hoặc nét cọ vẽ nail art (tỉ lệ 1:1 hoặc 4:3).
              </p>
              <ImageUpload
                value={settings.aboutImage1 || DEFAULT_IMAGE1}
                onChange={(url) => setSettings((s) => ({ ...s, aboutImage1: url }))}
                label="Tải ảnh sứ mệnh 1"
              />
            </div>

            {/* 3. About Image 2 */}
            <div className={aStyles.imageUploadCard}>
              <h3 className={aStyles.cardHeaderTitle}>Ảnh Sứ Mệnh 2 (Thư giãn & Chăm sóc)</h3>
              <p className={aStyles.cardHeaderSubtitle}>
                Ảnh khách hàng tận hưởng ngâm chân thảo mộc, nối mi lụa hoặc góc trà đạo thư thái của salon.
              </p>
              <ImageUpload
                value={settings.aboutImage2 || DEFAULT_IMAGE2}
                onChange={(url) => setSettings((s) => ({ ...s, aboutImage2: url }))}
                label="Tải ảnh sứ mệnh 2"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 3: CORE VALUES STUDIO                             */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "values" && (
        <div className={styles.formCard}>
          {/* Preset Suggestions Box */}
          <div className={aStyles.presetBox}>
            <div className={aStyles.presetHeader}>
              <MdAutoAwesome size={16} />
              <span>Thư viện gợi ý nhanh chuẩn Salon (Nhấn để thêm ngay)</span>
            </div>
            <div className={aStyles.presetChips}>
              {VALUE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addValue(preset)}
                  className={aStyles.presetChip}
                  title="Nhấn để chèn giá trị này vào danh sách"
                >
                  <span>+</span>
                  <span>{preset.title.split("(")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className={styles.cardSectionTitle} style={{ margin: 0, padding: 0, border: "none" }}>
                Danh sách giá trị cốt lõi ({valuesCount})
              </div>
              <span style={{ fontSize: "12px", color: "#857567" }}>
                Các tiêu chí này được hiển thị kèm biểu tượng vàng champagne tinh tế trên trang Giới thiệu.
              </span>
            </div>

            <button type="button" onClick={() => addValue()} className={styles.btnSecondary} style={{ fontSize: 12.5 }}>
              <MdAdd size={16} />
              <span>Thêm giá trị tùy chỉnh</span>
            </button>
          </div>

          {valuesCount === 0 && (
            <div className={styles.emptyState}>
              <span style={{ fontSize: 28, opacity: 0.6 }}>✦</span>
              <span>Chưa có giá trị nào. Bạn có thể chọn từ gợi ý phía trên hoặc nhấn &quot;Thêm giá trị tùy chỉnh&quot;.</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(settings.aboutValues || []).map((val, i) => (
              <div key={i} className={aStyles.valueCard}>
                <div className={aStyles.valueIndexBadge}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className={aStyles.valueCardContent}>
                  <div className={styles.formField}>
                    <label>Tiêu đề giá trị</label>
                    <input
                      value={val.title}
                      onChange={(e) => updateValue(i, "title", e.target.value)}
                      placeholder="VD: Vô trùng y tế 100%"
                      style={{ fontWeight: 650 }}
                    />
                  </div>

                  <div className={styles.formField} style={{ marginBottom: 0 }}>
                    <label>Mô tả chi tiết cam kết</label>
                    <textarea
                      value={val.description}
                      onChange={(e) => updateValue(i, "description", e.target.value)}
                      placeholder="VD: Toàn bộ kềm, dũa và phụ kiện đều trải qua quy trình khử khuẩn bằng nhiệt cao cấp..."
                      rows={2}
                      style={{ lineHeight: 1.55 }}
                    />
                  </div>
                </div>

                <div className={aStyles.valueCardActions}>
                  <button
                    type="button"
                    onClick={() => moveValue(i, "up")}
                    disabled={i === 0}
                    className={aStyles.iconBtn}
                    title="Di chuyển lên trên"
                  >
                    <MdArrowUpward size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveValue(i, "down")}
                    disabled={i === (settings.aboutValues || []).length - 1}
                    className={aStyles.iconBtn}
                    title="Di chuyển xuống dưới"
                  >
                    <MdArrowDownward size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeValue(i)}
                    className={aStyles.iconBtnDanger}
                    title="Xóa giá trị này"
                  >
                    <MdDeleteOutline size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB 4: LIVE VISUAL MOCKUP                             */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === "preview" && (
        <div className={aStyles.mockupContainer}>
          <div className={aStyles.mockupBrowserBar}>
            <div className={aStyles.mockupDots}>
              <div className={aStyles.mockupDot} />
              <div className={aStyles.mockupDot} />
              <div className={aStyles.mockupDot} />
            </div>
            <div className={aStyles.mockupUrl}>
              https://mocsalon.vn/vi/gioi-thieu (Mô phỏng giao diện khách hàng)
            </div>
            <Link
              href="/vi/gioi-thieu"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#C2A979", fontSize: 11.5, fontWeight: 700, textDecoration: "none" }}
            >
              Mở tab mới ↗
            </Link>
          </div>

          <div className={aStyles.mockupBody}>
            {/* 1. Mockup Hero */}
            <div
              className={aStyles.mockupHero}
              style={{
                backgroundImage: `url('${settings.bannerImage || DEFAULT_BANNER}')`,
              }}
            >
              <div className={aStyles.mockupHeroOverlay} />
              <div className={aStyles.mockupHeroContent}>
                <div className={aStyles.mockupHeroTag}>SỨ MỆNH CỦA CHÚNG TÔI</div>
                <h2 className={aStyles.mockupHeroTitle}>
                  {settings.aboutHeadline || "Nghệ thuật chăm sóc móng tinh tế"}
                </h2>
                <p className={aStyles.mockupHeroDesc}>
                  {settings.aboutSubheadline || "Với đội ngũ tận tâm và kỹ thuật tỉ mỉ, Mộc Salon là điểm đến lý tưởng..."}
                </p>
                <div className={aStyles.mockupHeroBtn}>ĐẶT LỊCH HẸN NGAY →</div>
              </div>
            </div>

            {/* 2. Mockup Mission Section */}
            <div className={aStyles.mockupMission}>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 8 }}>
                  SỨ MỆNH
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 700, fontStyle: "italic", margin: "0 0 12px", color: "#2E2E2E" }}>
                  Tái định nghĩa sự thư giãn và vẻ đẹp tinh tế
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "#666", margin: 0 }}>
                  Được xây dựng dựa trên sự tận tâm và tỉ mỉ, Mộc Salon không chỉ là một tiệm làm móng thông thường, mà là một không gian thư thái, nơi mỗi bộ móng là một tác phẩm mang đậm phong cách riêng của bạn.
                </p>
              </div>

              <div className={aStyles.mockupCollage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.aboutImage1 || DEFAULT_IMAGE1} alt="Collage 1" className={aStyles.mockupCollageImg} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={settings.aboutImage2 || DEFAULT_IMAGE2} alt="Collage 2" className={aStyles.mockupCollageImg} />
                <div className={aStyles.mockupBadge}>
                  <div className={aStyles.mockupBadgeNum}>10k+</div>
                  <div className={aStyles.mockupBadgeText}>Khách hàng<br />hài lòng</div>
                </div>
              </div>
            </div>

            {/* 3. Mockup Core Values */}
            <div className={aStyles.mockupValuesSec}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C2A979", marginBottom: 6 }}>
                  GIÁ TRỊ CỐT LÕI
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 700, fontStyle: "italic", margin: 0, color: "#2E2E2E" }}>
                  Không gian riêng tư & Cam kết của Mộc Salon
                </h3>
              </div>

              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                {(settings.aboutValues || []).map((v, idx) => (
                  <div key={idx} className={aStyles.mockupValueItem}>
                    <div className={aStyles.mockupValueIcon}>✦</div>
                    <div>
                      <strong style={{ color: "#231B15", fontSize: 13, display: "block", marginBottom: 2 }}>
                        {v.title || `Giá trị ${idx + 1}`}
                      </strong>
                      <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                        {v.description || "Chưa có mô tả chi tiết."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
