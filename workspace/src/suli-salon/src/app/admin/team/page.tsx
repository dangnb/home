"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { TeamMemberData } from "@/lib/db";

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMemberData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", role: "Nail Artist", image: "", bio: "", order: 0 });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/team").then(r => r.json()).then(setItems);
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
        setNewItem(p => ({ ...p, image: data.url }));
        flash("success", "Image uploaded successfully!");
      } else {
        flash("error", data.error || "Upload failed");
      }
    } catch (error) {
      flash("error", "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAdd() {
    if (!newItem.name) return flash("error", "Name is required");
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(prev => [...prev, data.item]);
      setNewItem({ name: "", role: "Nail Artist", image: "", bio: "", order: 0 });
      setShowAdd(false);
      flash("success", "Team member added!");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== id));
      flash("success", "Deleted!");
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Team Members</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Manage your salon staff ({items.length} members)
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={styles.btnPrimary}>
          {showAdd ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {msg.text && (
        <p className={msg.type === "error" ? styles.alertError : styles.alertSuccess}
          style={{ marginBottom: "1rem" }}>{msg.text}</p>
      )}

      {showAdd && (
        <div className={styles.formCard} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.cardSectionTitle}>Add Team Member</div>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Name</label>
              <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Elena" />
            </div>
            <div className={styles.formField}>
              <label>Role</label>
              <input value={newItem.role} onChange={e => setNewItem(p => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Master Nail Artist" />
            </div>
            <div className={styles.formField}>
              <label>Image URL</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))}
                  placeholder="https://..." style={{ flex: 1 }} />
                <label style={{ background: "#F4F1EA", padding: "8px 12px", borderRadius: 4, cursor: "pointer", border: "1px solid #EAE5DC", display: "inline-block" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#2E2E2E" }}>{isUploading ? "Uploading..." : "Upload File"}</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            <div className={styles.formField}>
              <label>Bio (Short description)</label>
              <input value={newItem.bio} onChange={e => setNewItem(p => ({ ...p, bio: e.target.value }))}
                placeholder="e.g. 5+ years of experience..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <div className={styles.formField} style={{ flex: 1, marginBottom: 0 }}>
                <label>Display Order</label>
                <input type="number" value={newItem.order} onChange={e => setNewItem(p => ({ ...p, order: parseInt(e.target.value)||0 }))} />
              </div>
              <button onClick={handleAdd} className={styles.btnPrimary} style={{ height: 40, alignSelf: 'flex-end' }}>Add Member</button>
            </div>
          </div>
          {newItem.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={newItem.image} alt="Preview" style={{
              width: 100, height: 100, objectFit: 'cover', borderRadius: '50%', marginTop: 16,
              border: '2px solid #C2A979',
            }} />
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa', border: '1px dashed #ccc', borderRadius: 8 }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
          No team members added yet.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: '#fff',
              border: '1px solid rgba(194,169,121,0.15)',
              borderRadius: 8,
              padding: '1.25rem',
              position: 'relative',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
                <button onClick={() => handleDelete(item.id)} 
                    style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: 16 }}
                    title="Delete Member"
                >🗑️</button>
              
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#F4F1EA', flexShrink: 0, overflow: 'hidden' }}>
                {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#C2A979' }}>{item.name.charAt(0)}</div>
                )}
              </div>
              
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#2E2E2E' }}>{item.name}</div>
                <div style={{ fontSize: 13, color: '#C2A979', fontWeight: 500, marginBottom: 4 }}>{item.role}</div>
                {item.bio && <div style={{ fontSize: 12, color: '#888', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.bio}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
