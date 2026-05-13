"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../admin.module.css";

interface Category { id: string; label: string; }
interface Tour { name: string; icon: string; schedule: string[]; }
interface Cruise {
  slug: string; name: string; categoryId: string; badge: string; tagline: string;
  originalPrice: string; salePrice: string; floors: number; capacity: number;
  mainImage: string; gallery: string[]; highlights: string[]; description: string;
  tours: Tour[]; includes: string[]; relatedSlugs: string[];
}

const empty: Cruise = {
  slug:"", name:"", categoryId:"regular", badge:"", tagline:"",
  originalPrice:"", salePrice:"", floors:2, capacity:0,
  mainImage:"", gallery:[], highlights:[], description:"",
  tours:[], includes:[], relatedSlugs:[]
};

export default function CruiseFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [form, setForm] = useState<Cruise>(empty);
  const [cats, setCats] = useState<Category[]>([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);

  // Temp string inputs for array fields
  const [hlInput, setHlInput] = useState("");
  const [incInput, setIncInput] = useState("");
  const [galInput, setGalInput] = useState("");
  const [relInput, setRelInput] = useState("");

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCats);
    params.then(({ slug }) => {
      if (slug === "new") { setIsNew(true); return; }
      setIsNew(false);
      fetch(`/api/cruises/${slug}`).then(r => r.json()).then(data => {
        setForm(data);
        setHlInput(data.highlights.join("\n"));
        setIncInput(data.includes.join("\n"));
        setGalInput(data.gallery.join("\n"));
        setRelInput(data.relatedSlugs.join("\n"));
      });
    });
  }, [params]);

  function flash(type: string, text: string) { setMsg({ type, text }); }
  function set(key: keyof Cruise, val: unknown) { setForm(p => ({ ...p, [key]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload: Cruise = {
      ...form,
      highlights: hlInput.split("\n").map(s => s.trim()).filter(Boolean),
      includes: incInput.split("\n").map(s => s.trim()).filter(Boolean),
      gallery: galInput.split("\n").map(s => s.trim()).filter(Boolean),
      relatedSlugs: relInput.split("\n").map(s => s.trim()).filter(Boolean),
    };
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/cruises" : `/api/cruises/${form.slug}`;
    const res = await fetch(url, { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) {
      flash("success", isNew ? "Đã tạo mới du thuyền!" : "Đã cập nhật!");
      if (isNew) setTimeout(() => router.push("/admin/cruises"), 1200);
    } else { const d = await res.json(); flash("error", d.error ?? "Lỗi!"); }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isNew ? "➕ Thêm Du Thuyền" : "✏️ Sửa Du Thuyền"}</h1>
        <div className={styles.pageActions}>
          <Link href="/admin/cruises" className={styles.btnSecondary}>← Quay lại</Link>
        </div>
      </div>
      {msg.text && <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess} style={{marginBottom:'1rem'}}>{msg.text}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <h3 style={{fontWeight:700,marginBottom:'1.25rem',color:'#0d1f2d'}}>Thông tin cơ bản</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Slug (URL duy nhất) *</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="thao-nhi-yatch" required disabled={!isNew} />
            </div>
            <div className={styles.formField}>
              <label>Tên Du Thuyền *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Du Thuyền Thảo Nhi Yatch" required />
            </div>
            <div className={styles.formField}>
              <label>Danh Mục</label>
              <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Badge (nhãn nhỏ)</label>
              <input value={form.badge} onChange={e => set("badge", e.target.value)} placeholder="Du thuyền nhà hàng" />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Tagline (khẩu hiệu)</label>
              <input value={form.tagline} onChange={e => set("tagline", e.target.value)} placeholder="Biệt Thự Di Động – Đẳng Cấp 5 Sao" />
            </div>
            <div className={styles.formField}>
              <label>Giá Gốc</label>
              <input value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} placeholder="1.500.000 ₫" />
            </div>
            <div className={styles.formField}>
              <label>Giá Sale *</label>
              <input value={form.salePrice} onChange={e => set("salePrice", e.target.value)} placeholder="900.000 ₫" required />
            </div>
            <div className={styles.formField}>
              <label>Số Tầng</label>
              <input type="number" value={form.floors} onChange={e => set("floors", +e.target.value)} min={1} />
            </div>
            <div className={styles.formField}>
              <label>Sức Chứa (người)</label>
              <input type="number" value={form.capacity} onChange={e => set("capacity", +e.target.value)} min={1} />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Ảnh Đại Diện (URL)</label>
              <input value={form.mainImage} onChange={e => set("mainImage", e.target.value)} placeholder="/images/ten-anh.jpg" />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Thư Viện Ảnh (mỗi URL một dòng)</label>
              <textarea value={galInput} onChange={e => setGalInput(e.target.value)} placeholder={"/images/anh1.jpg\n/images/anh2.jpg"} rows={4} />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Mô Tả Chi Tiết</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={6} placeholder="Nội dung mô tả..." />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Điểm Nổi Bật (mỗi điểm một dòng)</label>
              <textarea value={hlInput} onChange={e => setHlInput(e.target.value)} rows={4} placeholder={"Không gian riêng tư sang trọng\nSetup tiệc theo yêu cầu"} />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Dịch Vụ Bao Gồm (mỗi dòng một dịch vụ)</label>
              <textarea value={incInput} onChange={e => setIncInput(e.target.value)} rows={4} placeholder={"DJ chuyên nghiệp\nBuffet mini\nBảo hiểm hành khách"} />
            </div>
            <div className={styles.formField + " " + styles.fullWidth}>
              <label>Du Thuyền Liên Quan (mỗi slug một dòng)</label>
              <textarea value={relInput} onChange={e => setRelInput(e.target.value)} rows={3} placeholder={"du-thuyen-poseidon-cruise\ntau-rong-song-han"} />
            </div>
          </div>
          <div style={{marginTop:'1.5rem',display:'flex',gap:'0.75rem'}}>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Đang lưu..." : (isNew ? "➕ Tạo Mới" : "💾 Lưu Thay Đổi")}
            </button>
            <Link href="/admin/cruises" className={styles.btnSecondary}>Hủy</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
