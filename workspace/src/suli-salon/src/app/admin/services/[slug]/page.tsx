"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../admin.module.css";
import { FormInput, FormTextarea, FormSelect } from "@/components/Admin/FormComponents";
import AdminLoading from "@/components/Admin/AdminLoading";
import { useAdminLocale } from "@/components/Admin/AdminLocaleContext";
import { MdAccessTime, MdPayments, MdLocalOffer, MdLanguage } from "react-icons/md";

interface Category { id: string; label: string; slug: string; }

interface ServiceForm {
  slug: string;
  categoryId: string;
  duration: number;
  image: string;
  gallery: string[];
  isActive: boolean;
}

const emptyForm: ServiceForm = {
  slug: "",
  categoryId: "",
  duration: 60,
  image: "",
  gallery: [],
  isActive: true,
};

export default function ServiceFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const isNew = slug === "new";

  const { locale, t, splitBilingual, joinBilingual } = useAdminLocale();
  const [activeLang, setActiveLang] = useState<"vi" | "en">(locale);

  // Form base
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Bilingual fields
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [priceVi, setPriceVi] = useState("");
  const [priceEn, setPriceEn] = useState("");
  const [promoPriceVi, setPromoPriceVi] = useState("");
  const [promoPriceEn, setPromoPriceEn] = useState("");
  const [descVi, setDescVi] = useState("");
  const [descEn, setDescEn] = useState("");

  useEffect(() => {
    const requests: Promise<void>[] = [
      fetch("/api/categories")
        .then(async r => {
          if (!r.ok) throw new Error("Fetch categories failed");
          return r.json();
        })
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([])),
    ];

    if (!isNew) {
      requests.push(
        fetch(`/api/services/${slug}`)
          .then(async r => {
            if (!r.ok) throw new Error("Service not found");
            return r.json();
          })
          .then(data => {
            setForm({
              slug: data.slug,
              categoryId: data.categoryId,
              duration: data.duration ?? 60,
              image: data.image ?? "",
              gallery: Array.isArray(data.gallery) ? data.gallery : [],
              isActive: data.isActive ?? true,
            });

            // Parse bilingual values
            const nameParts = splitBilingual(data.name);
            setNameVi(nameParts.vi);
            setNameEn(nameParts.en);

            const priceParts = splitBilingual(data.price);
            setPriceVi(priceParts.vi);
            setPriceEn(priceParts.en);

            const promoParts = splitBilingual(data.promoPrice);
            setPromoPriceVi(promoParts.vi);
            setPromoPriceEn(promoParts.en);

            const descParts = splitBilingual(data.description);
            setDescVi(descParts.vi);
            setDescEn(descParts.en);
          })
          .catch(() => setMsg({ type: "error", text: "Không thể tải dịch vụ. Vui lòng thử lại." })),
      );
    }

    Promise.all(requests).finally(() => setIsInitialLoading(false));
  }, [slug, isNew, splitBilingual]);

  function set(key: keyof ServiceForm, val: unknown) {
    setForm(p => ({ ...p, [key]: val }));
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    const fullName = joinBilingual(nameVi, nameEn);
    const fullPrice = joinBilingual(priceVi, priceEn);
    const fullPromo = joinBilingual(promoPriceVi, promoPriceEn);
    const fullDesc = joinBilingual(descVi, descEn);

    if (!fullName) {
      setMsg({ type: "error", text: "Vui lòng nhập tên dịch vụ (ít nhất một ngôn ngữ)." });
      return;
    }
    if (!form.categoryId) {
      setMsg({ type: "error", text: "Vui lòng chọn danh mục dịch vụ." });
      return;
    }
    if (!fullPrice) {
      setMsg({ type: "error", text: "Vui lòng nhập bảng giá dịch vụ." });
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      name: fullName,
      price: fullPrice,
      promoPrice: fullPromo || null,
      description: fullDesc,
      slug: form.slug || autoSlug(nameVi || nameEn),
      gallery: JSON.stringify(form.gallery),
    };

    const url = isNew ? "/api/services" : `/api/services/${slug}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg({ type: "success", text: isNew ? "Đã thêm dịch vụ mới thành công!" : "Đã cập nhật dịch vụ thành công!" });
        if (isNew) setTimeout(() => router.push("/admin/services"), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg({ type: "error", text: data.error || "Không thể lưu thông tin dịch vụ. Vui lòng kiểm tra lại các trường dữ liệu." });
      }
    } catch {
      setMsg({ type: "error", text: "Lỗi kết nối máy chủ hoặc mạng không ổn định. Vui lòng thử lại sau." });
    }
    setSaving(false);
  }

  if (isInitialLoading) {
    return <AdminLoading variant="form" label="Đang tải thông tin dịch vụ..." />;
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {isNew ? "Thêm dịch vụ mới" : `Chỉnh sửa: ${nameVi || nameEn || form.slug}`}
          </h1>
        </div>
        <div className={styles.pageActions}>
          <Link href="/admin/services" className={styles.btnSecondary}>← Quay lại</Link>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      <div className={styles.formCard}>
        {/* Language Tabs for Form */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(194, 169, 121, 0.22)"
        }}>
          <div>
            <div style={{ fontSize: "13.5px", fontWeight: 750, color: "#231B15", display: "flex", alignItems: "center", gap: 6 }}>
              <MdLanguage size={18} color="#967840" />
              <span>Soạn thảo nội dung theo ngôn ngữ</span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#857567" }}>
              Hệ thống tự động đồng bộ song ngữ Việt - Anh mà không cần nhập ký tự phân tách thủ công.
            </p>
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
                padding: "6px 14px",
                borderRadius: "16px",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeLang === "vi" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                color: activeLang === "vi" ? "#FFFFFF" : "#78695C",
                boxShadow: activeLang === "vi" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
              }}
            >
              🇻🇳 Tiếng Việt {nameVi ? "✓" : ""}
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              style={{
                padding: "6px 14px",
                borderRadius: "16px",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeLang === "en" ? "linear-gradient(135deg, #C2A979, #967840)" : "transparent",
                color: activeLang === "en" ? "#FFFFFF" : "#78695C",
                boxShadow: activeLang === "en" ? "0 2px 8px rgba(194, 169, 121, 0.35)" : "none",
              }}
            >
              🇬🇧 English {nameEn ? "✓" : ""}
            </button>
          </div>
        </div>

        <div className={styles.cardSectionTitle}>
          {activeLang === "vi" ? "Thông tin dịch vụ (Tiếng Việt 🇻🇳)" : "Service Details (English 🇬🇧)"}
        </div>

        <div className={styles.formGrid}>
          {activeLang === "vi" ? (
            <>
              <FormInput
                label="Tên dịch vụ (Tiếng Việt)"
                required
                value={nameVi}
                onChange={e => {
                  setNameVi(e.target.value);
                  if (isNew && !nameEn) set("slug", autoSlug(e.target.value));
                }}
                placeholder="VD: Chăm Sóc Móng Cổ Điển"
              />
              <FormInput
                label="Đường dẫn tĩnh (Slug URL)"
                value={form.slug}
                onChange={e => set("slug", e.target.value)}
                placeholder="cham-soc-mong-co-dien"
              />
              <FormSelect
                label="Danh mục dịch vụ"
                required
                value={form.categoryId}
                onChange={e => set("categoryId", e.target.value)}
                options={[{ label: "— Chọn danh mục —", value: "" }, ...categories.map(c => ({ label: t(c.label), value: c.id }))]}
              />
              <FormInput
                label="Thời lượng thực hiện (phút)"
                required
                type="number"
                value={form.duration}
                onChange={e => set("duration", parseInt(e.target.value) || 0)}
                icon={<MdAccessTime size={17} />}
              />
              <FormInput
                label="Bảng giá (Tiếng Việt / VNĐ)"
                required
                value={priceVi}
                onChange={e => setPriceVi(e.target.value)}
                placeholder="VD: 250.000 VNĐ"
                icon={<MdPayments size={17} />}
              />
              <FormInput
                label="Giá ưu đãi (tùy chọn)"
                value={promoPriceVi}
                onChange={e => setPromoPriceVi(e.target.value)}
                placeholder="VD: 200.000 VNĐ"
                icon={<MdLocalOffer size={17} />}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Service Name (English)"
                required
                value={nameEn}
                onChange={e => {
                  setNameEn(e.target.value);
                  if (isNew && !nameVi) set("slug", autoSlug(e.target.value));
                }}
                placeholder="e.g. Classic Manicure"
              />
              <FormInput
                label="Slug URL"
                value={form.slug}
                onChange={e => set("slug", e.target.value)}
                placeholder="classic-manicure"
              />
              <FormSelect
                label="Service Category"
                required
                value={form.categoryId}
                onChange={e => set("categoryId", e.target.value)}
                options={[{ label: "— Select category —", value: "" }, ...categories.map(c => ({ label: t(c.label, "en"), value: c.id }))]}
              />
              <FormInput
                label="Duration (minutes)"
                required
                type="number"
                value={form.duration}
                onChange={e => set("duration", parseInt(e.target.value) || 0)}
                icon={<MdAccessTime size={17} />}
              />
              <FormInput
                label="Price (English / Currency)"
                required
                value={priceEn}
                onChange={e => setPriceEn(e.target.value)}
                placeholder="e.g. $10 or 250,000 VND"
                icon={<MdPayments size={17} />}
              />
              <FormInput
                label="Promo Price (optional)"
                value={promoPriceEn}
                onChange={e => setPromoPriceEn(e.target.value)}
                placeholder="e.g. $8"
                icon={<MdLocalOffer size={17} />}
              />
            </>
          )}
        </div>

        <div className={styles.cardSectionTitle} style={{ marginTop: '2rem' }}>
          {activeLang === "vi" ? "Mô tả chi tiết (Tiếng Việt 🇻🇳)" : "Service Description (English 🇬🇧)"}
        </div>
        {activeLang === "vi" ? (
          <FormTextarea
            label="Mô tả liệu trình"
            value={descVi}
            onChange={e => setDescVi(e.target.value)}
            placeholder="Mô tả kỹ thuật, các bước thực hiện và lợi ích của liệu trình..."
            rows={5}
          />
        ) : (
          <FormTextarea
            label="Detailed Description"
            value={descEn}
            onChange={e => setDescEn(e.target.value)}
            placeholder="Describe techniques, steps, and benefits in English..."
            rows={5}
          />
        )}

        <div className={styles.cardSectionTitle} style={{ marginTop: '2rem' }}>Hình ảnh dịch vụ</div>
        <FormInput
          label="Đường dẫn ảnh đại diện (Image URL)"
          value={form.image}
          onChange={e => set("image", e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image} alt="Preview" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 14, marginTop: 8, border: '1px solid rgba(194,169,121,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(194,169,121,0.2)', paddingTop: '1.2rem' }}>
          <Link href="/admin/services" className={styles.btnSecondary} style={{ padding: "0.7rem 1.4rem" }}>
            Hủy
          </Link>
          <button onClick={handleSave} disabled={saving} className={styles.btnPrimary}
            style={{ padding: "0.7rem 1.8rem" }}>
            {saving ? "Đang lưu..." : isNew ? "Tạo dịch vụ" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
