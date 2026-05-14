"use client";
import { useRef, useState, useCallback } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Ảnh đại diện" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File quá lớn (tối đa 5MB)");
      return;
    }
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error ?? "Upload thất bại");
      }
    } catch {
      setError("Lỗi kết nối, thử lại");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.fieldLabel}>{label}</label>

      {/* Drop zone */}
      <div
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""} ${value ? styles.hasImage : ""}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className={styles.preview} />
            <div className={styles.previewOverlay}>
              <span>🔄 Thay ảnh</span>
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            {uploading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p className={styles.placeholderText}>Kéo thả ảnh vào đây</p>
                <p className={styles.placeholderSub}>hoặc click để chọn file</p>
                <span className={styles.placeholderBtn}>Chọn ảnh</span>
              </>
            )}
          </div>
        )}
        {uploading && value && (
          <div className={styles.uploadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>

      {/* URL input fallback */}
      <div className={styles.urlRow}>
        <input
          className={styles.urlInput}
          type="text"
          placeholder="Hoặc nhập URL ảnh trực tiếp..."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {value && (
          <button type="button" className={styles.clearBtn} onClick={() => onChange("")} title="Xóa ảnh">
            ✕
          </button>
        )}
      </div>

      {error && <p className={styles.error}>⚠️ {error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
