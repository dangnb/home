"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { useEffect, useRef, useCallback, useState } from "react";
import styles from "./RichEditor.module.css";
import { ImageWithEffects } from "./ImageExtension";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

type Level = 1 | 2 | 3 | 4;

export default function RichEditor({
  value,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung...",
  minHeight = 400,
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  const COLORS = [
    // Row 1 — neutrals
    "#000000","#374151","#6b7280","#9ca3af","#d1d5db","#ffffff",
    // Row 2 — reds/oranges
    "#dc2626","#ea580c","#d97706","#ca8a04","#65a30d","#16a34a",
    // Row 3 — greens/teals
    "#059669","#0d9488","#0891b2","#0284c7","#2563eb","#4f46e5",
    // Row 4 — purples/pinks
    "#7c3aed","#9333ea","#c026d3","#db2777","#e11d48","#f43f5e",
    // Row 5 — brand + highlights
    "#01bf93","#00a87c","#fef08a","#fed7aa","#fecaca","#bbf7d0",
  ];

  // Close palette on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(e.target as Node)) {
        setShowColorPalette(false);
      }
    }
    if (showColorPalette) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showColorPalette]);

  // Track last HTML emitted to avoid sync loop
  const lastEmitted = useRef<string>("");
  // Track whether initial content has been set
  const initialized = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false, // disable bundled link, use separate below
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      ImageWithEffects,      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: styles.proseMirror,
        style: `min-height: ${minHeight}px`,
      },
      handleDrop(_view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
        if (!imgs.length) return false;
        event.preventDefault();
        imgs.forEach(f => uploadAndInsert(f));
        return true;
      },
      handlePaste(_view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const imgItem = Array.from(items).find(i => i.type.startsWith("image/"));
        if (!imgItem) return false;
        const file = imgItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        uploadAndInsert(file);
        return true;
      },
    },
    immediatelyRender: false,
  });

  // Set initial content once when editor is ready AND value is available
  useEffect(() => {
    if (!editor || initialized.current) return;
    if (value) {
      editor.commands.setContent(value, false);
      lastEmitted.current = value;
      initialized.current = true;
    }
  }, [editor, value]);

  // Sync external value changes (e.g. reset form) — only if different from what we emitted
  useEffect(() => {
    if (!editor || !initialized.current) return;
    if (value !== lastEmitted.current) {
      editor.commands.setContent(value || "", false);
      lastEmitted.current = value;
    }
  }, [value, editor]);

  const uploadAndInsert = useCallback(async (file: File) => {
    if (!editor) return;

    // Show base64 preview immediately
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();

      // Upload to server and replace
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          const html = editor.getHTML().replace(base64, data.url);
          editor.commands.setContent(html, false);
          lastEmitted.current = editor.getHTML();
          onChange(lastEmitted.current);
        }
      } catch {
        // Keep base64 on failure
      }
    };
    reader.readAsDataURL(file);
  }, [editor, onChange]);

  const insertImageFromUrl = useCallback(() => {
    const url = urlInputRef.current?.value?.trim();
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    if (urlInputRef.current) urlInputRef.current.value = "";
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Nhập URL liên kết:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  // ── Toolbar button ──
  const T = ({
    onClick, active = false, title, disabled = false, children,
  }: {
    onClick: () => void; active?: boolean; title: string;
    disabled?: boolean; children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.tb} ${active ? styles.tbActive : ""} ${disabled ? styles.tbDisabled : ""}`}
    >
      {children}
    </button>
  );

  const Sep = () => <div className={styles.sep} />;

  const currentColor = editor.getAttributes("textStyle").color ?? "#000000";
  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className={styles.wrapper}>

      {/* ══ TOOLBAR ══ */}
      <div className={styles.toolbar}>

        {/* Undo / Redo */}
        <div className={styles.group}>
          <T title="Hoàn tác (Ctrl+Z)" disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M3 13C5.5 6.5 14 4 20 8"/></svg>
          </T>
          <T title="Làm lại (Ctrl+Y)" disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M21 13C18.5 6.5 10 4 4 8"/></svg>
          </T>
        </div>

        <Sep />

        {/* Heading dropdown */}
        <div className={styles.group}>
          <select
            className={styles.headingSelect}
            value={
              editor.isActive("heading", { level: 1 }) ? "h1" :
              editor.isActive("heading", { level: 2 }) ? "h2" :
              editor.isActive("heading", { level: 3 }) ? "h3" :
              editor.isActive("heading", { level: 4 }) ? "h4" : "p"
            }
            onChange={e => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as Level }).run();
            }}
          >
            <option value="p">Đoạn văn</option>
            <option value="h1">Tiêu đề 1</option>
            <option value="h2">Tiêu đề 2</option>
            <option value="h3">Tiêu đề 3</option>
            <option value="h4">Tiêu đề 4</option>
          </select>
        </div>

        <Sep />

        {/* Text formatting */}
        <div className={styles.group}>
          <T title="Đậm (Ctrl+B)" active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}>
            <strong style={{ fontSize: "0.88rem", letterSpacing: "-0.02em" }}>B</strong>
          </T>
          <T title="Nghiêng (Ctrl+I)" active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}>
            <em style={{ fontSize: "0.88rem" }}>I</em>
          </T>
          <T title="Gạch chân (Ctrl+U)" active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span style={{ textDecoration: "underline", fontSize: "0.88rem" }}>U</span>
          </T>
          <T title="Gạch ngang" active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}>
            <span style={{ textDecoration: "line-through", fontSize: "0.88rem" }}>S</span>
          </T>
          <T title="Tô sáng văn bản" active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l-4 4 2 2 4-4"/><path d="M13 7l4-4 4 4-4 4-4-4z"/><line x1="5" y1="19" x2="19" y2="19"/></svg>
          </T>
        </div>

        <Sep />

        {/* Color picker — inline palette */}
        <div className={styles.group} style={{ position: "relative" }} ref={colorPaletteRef}>
          <button
            type="button"
            title="Màu chữ"
            className={styles.tb}
            onClick={() => setShowColorPalette(v => !v)}
          >
            <span className={styles.colorIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16M8 16L12 4l4 12"/><line x1="9.5" y1="12" x2="14.5" y2="12"/></svg>
              <span className={styles.colorBar} style={{ background: currentColor }} />
            </span>
          </button>

          {showColorPalette && (
            <div className={styles.colorPalette}>
              <div className={styles.colorPaletteGrid}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    className={styles.colorSwatch}
                    style={{ background: c, outline: currentColor === c ? `2px solid #01bf93` : undefined }}
                    onClick={() => {
                      editor.chain().focus().setColor(c).run();
                      setShowColorPalette(false);
                    }}
                  />
                ))}
              </div>
              <div className={styles.colorPaletteFooter}>
                <button
                  type="button"
                  className={styles.colorRemoveBtn}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPalette(false);
                  }}
                >
                  ✕ Xóa màu
                </button>
                <label className={styles.colorCustomLabel} title="Chọn màu tùy chỉnh">
                  🎨 Tùy chỉnh
                  <input
                    type="color"
                    defaultValue={currentColor}
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
                    onChange={e => {
                      editor.chain().focus().setColor(e.target.value).run();
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <Sep />

        {/* Lists */}
        <div className={styles.group}>
          <T title="Danh sách chấm" active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="3" cy="6" r="1.5"/><rect x="7" y="5" width="14" height="2" rx="1"/><circle cx="3" cy="12" r="1.5"/><rect x="7" y="11" width="14" height="2" rx="1"/><circle cx="3" cy="18" r="1.5"/><rect x="7" y="17" width="14" height="2" rx="1"/></svg>
          </T>
          <T title="Danh sách số" active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </T>
        </div>

        <Sep />

        {/* Alignment */}
        <div className={styles.group}>
          <T title="Căn trái" active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="3" y="9" width="12" height="2" rx="1"/><rect x="3" y="14" width="18" height="2" rx="1"/><rect x="3" y="19" width="9" height="2" rx="1"/></svg>
          </T>
          <T title="Căn giữa" active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="6" y="9" width="12" height="2" rx="1"/><rect x="3" y="14" width="18" height="2" rx="1"/><rect x="7.5" y="19" width="9" height="2" rx="1"/></svg>
          </T>
          <T title="Căn phải" active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="9" y="9" width="12" height="2" rx="1"/><rect x="3" y="14" width="18" height="2" rx="1"/><rect x="12" y="19" width="9" height="2" rx="1"/></svg>
          </T>
          <T title="Căn đều" active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="3" y="9" width="18" height="2" rx="1"/><rect x="3" y="14" width="18" height="2" rx="1"/><rect x="3" y="19" width="18" height="2" rx="1"/></svg>
          </T>
        </div>

        <Sep />

        {/* Block */}
        <div className={styles.group}>
          <T title="Trích dẫn" active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </T>
          <T title="Khối code" active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </T>
          <T title="Đường kẻ ngang"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="11" width="20" height="2" rx="1"/></svg>
          </T>
        </div>

        <Sep />

        {/* Link */}
        <div className={styles.group}>
          <T title="Chèn / sửa liên kết" active={editor.isActive("link")} onClick={setLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </T>
        </div>

        <Sep />

        {/* Image upload */}
        <div className={styles.group}>
          <T title="Chèn ảnh từ máy" onClick={() => fileInputRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </T>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={e => {
              Array.from(e.target.files ?? []).forEach(f => uploadAndInsert(f));
              e.target.value = "";
            }}
          />
        </div>

        {/* Image URL input */}
        <div className={styles.urlGroup}>
          <input
            ref={urlInputRef}
            type="url"
            placeholder="Dán URL ảnh rồi nhấn Enter..."
            className={styles.urlInput}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); insertImageFromUrl(); }
            }}
          />
          <button type="button" className={styles.urlBtn} onClick={insertImageFromUrl} title="Chèn ảnh">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

      </div>

      {/* ══ EDITOR CONTENT ══ */}
      <div className={styles.editorArea}>
        <EditorContent editor={editor} />
      </div>

      {/* ══ STATUS BAR ══ */}
      <div className={styles.statusBar}>
        <span>{charCount} ký tự</span>
        <span>{wordCount} từ</span>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            if (confirm("Xóa toàn bộ nội dung?")) {
              editor.commands.clearContent();
              lastEmitted.current = "";
              onChange("");
            }
          }}
        >
          Xóa tất cả
        </button>
      </div>

    </div>
  );
}
