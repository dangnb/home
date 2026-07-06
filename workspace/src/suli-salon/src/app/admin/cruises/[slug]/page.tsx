"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../admin.module.css";
import { FormInput, FormTextarea, FormSelect } from "@/components/Admin/FormComponents";

interface Category { id: string; label: string; slug: string; }

interface ServiceForm {
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  duration: number;
  price: string;
  promoPrice: string;
  image: string;
  gallery: string[];
  isActive: boolean;
}

const emptyForm: ServiceForm = {
  slug: "", name: "", categoryId: "", description: "",
  duration: 60, price: "", promoPrice: "",
  image: "", gallery: [], isActive: true,
};

export default function ServiceFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const isNew = slug === "new";

  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
    if (!isNew) {
      fetch(`/api/cruises/${slug}`).then(r => r.json()).then(data => {
        setForm({
          slug: data.slug, name: data.name, categoryId: data.categoryId,
          description: data.description ?? "", duration: data.duration ?? 60,
          price: data.price ?? "", promoPrice: data.promoPrice ?? "",
          image: data.image ?? "", gallery: data.gallery ?? [],
          isActive: data.isActive ?? true,
        });
      });
    }
  }, [slug, isNew]);

  function set(key: keyof ServiceForm, val: unknown) {
    setForm(p => ({ ...p, [key]: val }));
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    if (!form.name || !form.categoryId || !form.price) {
      setMsg({ type: "error", text: "Name, Category, and Price are required" });
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.name),
      gallery: JSON.stringify(form.gallery),
    };

    const url = isNew ? "/api/cruises" : `/api/cruises/${slug}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "Saved!" });
        if (isNew) setTimeout(() => router.push("/admin/cruises"), 1200);
      } else {
        const data = await res.json();
        setMsg({ type: "error", text: data.error || "Error saving" });
      }
    } catch {
      setMsg({ type: "error", text: "Network error" });
    }
    setSaving(false);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{isNew ? "Add New Service" : `Edit: ${form.name}`}</h1>
        </div>
        <div className={styles.pageActions}>
          <Link href="/admin/cruises" className={styles.btnSecondary}>← Back</Link>
        </div>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      <div className={styles.formCard}>
        <div className={styles.cardSectionTitle}>Basic Info</div>
        <div className={styles.formGrid}>
          <FormInput label="Service Name" required value={form.name}
            onChange={e => { set("name", e.target.value); if (isNew) set("slug", autoSlug(e.target.value)); }}
            placeholder="e.g. Gel Manicure" />

          <FormInput label="Slug (URL)" value={form.slug}
            onChange={e => set("slug", e.target.value)}
            placeholder="gel-manicure" />

          <FormSelect label="Category" required value={form.categoryId}
            onChange={e => set("categoryId", e.target.value)}
            options={[{ label: "— Select —", value: "" }, ...categories.map(c => ({ label: c.label, value: c.id }))]} />

          <FormInput label="Duration (minutes)" required type="number" value={form.duration}
            onChange={e => set("duration", parseInt(e.target.value) || 0)}
            icon="⏱️" />

          <FormInput label="Price" required value={form.price}
            onChange={e => set("price", e.target.value)}
            placeholder="890 CZK" icon="💰" />

          <FormInput label="Promo Price (optional)" value={form.promoPrice}
            onChange={e => set("promoPrice", e.target.value)}
            placeholder="690 CZK" icon="🏷️" />
        </div>

        <div className={styles.cardSectionTitle} style={{ marginTop: '2rem' }}>Description</div>
        <FormTextarea label="Description" value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Describe this service..."
          rows={6} />

        <div className={styles.cardSectionTitle} style={{ marginTop: '2rem' }}>Image</div>
        <FormInput label="Main Image URL" value={form.image}
          onChange={e => set("image", e.target.value)}
          placeholder="https://..." />
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image} alt="Preview" style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 2, marginTop: 8, border: '1px solid rgba(194,169,121,0.15)' }} />
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
          <Link href="/admin/cruises" className={styles.btnSecondary} style={{ padding: "0.7rem 1.25rem" }}>
            Cancel
          </Link>
          <button onClick={handleSave} disabled={saving} className={styles.btnPrimary}
            style={{ padding: "0.7rem 1.5rem" }}>
            {saving ? "Saving..." : isNew ? "Create Service" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
