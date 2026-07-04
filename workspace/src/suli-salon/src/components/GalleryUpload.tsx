"use client";
import { useRef, useState, useCallback } from "react";
import styles from "./GalleryUpload.module.css";

interface GalleryUploadProps {
  value: string[];          // array of URLs
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export default function GalleryUpload({
  value,
  onChange,
  label = "Thư viện ảnh",
  max = 20,
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (!imageFiles.length) return;

    const remaining = max - value.length;
    if (remaining <= 0) {
      setError(`Đã đạt tối đa ${max} ảnh`);
      return;
    }
    const toUpload = imageFiles.slice(0, remaining);
    setError("");
    setUploading(true);
    setProgress({ done: 0, total: toUpload.length });

    const newUrls: string[] = [];
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" quá lớn (tối đa 5MB)`);
        continue;
      }
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
        else setError(data.error ?? "Upload thất bại");
      } catch {
        setError("Lỗi kết nối");
      }
      setProgress(p => ({ ...p, done: p.done + 1 }));
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
    setProgress({ done: 0, total: 0 });
  }, [value, onChange, max]);

  function removeImage(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function moveImage(from: number, to: number) {
    const arr = [...value];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  }

  function addUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.fieldLabel}>
        {label}
        <span className={styles.count}>{value.length}/{max}</span>
      </label>

      {/* Image grid */}
      {value.length > 0 && (
        <div className={styles.grid}>
          {value.map((url, i) => (
            <div key={url + i} className={`${styles.thumb} ${i === 0 ? styles.thumbMain : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Ảnh ${i + 1}`} />
              {i === 0 && <span className={styles.mainBadge}>Ảnh chính</span>}
              <div className={styles.thumbActions}>
                {i > 0 && (
                  <button type="button" title="Đặt làm ảnh chính" onClick={() => moveImage(i, 0)}>
                    ⭐
                  </button>
                )}
                {i > 0 && (
                  <button type="button" title="Lên trước" onClick={() => moveImage(i, i - 1)}>
                    ←
                  </button>
                )}
                {i < value.length - 1 && (
                  <button type="button" title="Xuống sau" onClick={() => moveImage(i, i + 1)}>
                    →
                  </button>
                )}
                <button type="button" title="Xóa ảnh" className={styles.removeBtn} onClick={() => removeImage(i)}>
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {value.length < max && (
            <div
              className={`${styles.addSlot} ${dragOver ? styles.dragOver : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className={styles.uploadProgress}>
                  <div className={styles.spinner} />
                  <span>{progress.done}/{progress.total}</span>
                </div>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Thêm ảnh</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state drop zone */}
      {value.length === 0 && (
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className={styles.uploadProgress}>
              <div className={styles.spinner} />
              <span>Đang tải {progress.done}/{progress.total} ảnh...</span>
            </div>
          ) : (
            <>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p className={styles.dropText}>Kéo thả nhiều ảnh vào đây</p>
              <p className={styles.dropSub}>hoặc click để chọn (tối đa {max} ảnh, mỗi ảnh ≤ 5MB)</p>
              <span className={styles.dropBtn}>Chọn ảnh</span>
            </>
          )}
        </div>
      )}

      {/* URL input */}
      <div className={styles.urlRow}>
        <input
          className={styles.urlInput}
          type="text"
          placeholder="Hoặc dán URL ảnh rồi nhấn Enter..."
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <span className={styles.urlHint}>↵ Enter</span>
      </div>

      {error && <p className={styles.error}>⚠️ {error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={e => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) uploadFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
