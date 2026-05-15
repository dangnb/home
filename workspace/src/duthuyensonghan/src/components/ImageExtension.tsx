"use client";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";
import styles from "./ImageExtension.module.css";

// Extend TipTap commands type
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        align?: ImageAlign;
        effect?: ImageEffect;
        width?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

// ── Types ──────────────────────────────────────────────────────────────────
export type ImageAlign = "left" | "center" | "right" | "full";
export type ImageEffect = "none" | "rounded" | "circle" | "shadow" | "border" | "grayscale" | "sepia";

// ── NodeView Component ─────────────────────────────────────────────────────
function ImageNodeView({ node, updateAttributes, selected }: {
  node: { attrs: { src: string; alt: string; align: ImageAlign; effect: ImageEffect; width: string; caption: string } };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  selected: boolean;
}) {
  const { src, alt, align, effect, width, caption } = node.attrs;
  const [showToolbar, setShowToolbar] = useState(false);
  const [editCaption, setEditCaption] = useState(false);
  const [captionVal, setCaptionVal] = useState(caption || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Show toolbar when node is selected
  useEffect(() => {
    setShowToolbar(selected);
  }, [selected]);

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
        setEditCaption(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const alignOptions: { value: ImageAlign; icon: string; label: string }[] = [
    { value: "left",   icon: "◧", label: "Trái" },
    { value: "center", icon: "◫", label: "Giữa" },
    { value: "right",  icon: "◨", label: "Phải" },
    { value: "full",   icon: "⬛", label: "Full" },
  ];

  const effectOptions: { value: ImageEffect; label: string }[] = [
    { value: "none",      label: "Mặc định" },
    { value: "rounded",   label: "Bo góc" },
    { value: "circle",    label: "Tròn" },
    { value: "shadow",    label: "Đổ bóng" },
    { value: "border",    label: "Viền" },
    { value: "grayscale", label: "Xám" },
    { value: "sepia",     label: "Sepia" },
  ];

  const widthOptions = ["25%", "33%", "50%", "66%", "75%", "100%"];

  // Build CSS classes for the image
  const imgClasses = [
    styles.img,
    effect !== "none" ? styles[`effect_${effect}`] : "",
    selected ? styles.imgSelected : "",
  ].filter(Boolean).join(" ");

  // Wrapper alignment style
  const wrapStyle: React.CSSProperties = {
    width: align === "full" ? "100%" : width || "100%",
    float: align === "left" ? "left" : align === "right" ? "right" : "none",
    margin: align === "left" ? "0.5rem 1.25rem 0.5rem 0"
          : align === "right" ? "0.5rem 0 0.5rem 1.25rem"
          : "0.75rem auto",
    display: "block",
    position: "relative",
  };

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      style={wrapStyle}
      className={styles.nodeWrapper}
      onClick={() => setShowToolbar(true)}
    >
      {/* ── Floating toolbar ── */}
      {showToolbar && (
        <div className={styles.toolbar} contentEditable={false}>

          {/* Alignment */}
          <div className={styles.toolGroup}>
            {alignOptions.map(o => (
              <button
                key={o.value}
                type="button"
                title={o.label}
                className={`${styles.toolBtn} ${align === o.value ? styles.toolBtnActive : ""}`}
                onClick={e => { e.stopPropagation(); updateAttributes({ align: o.value }); }}
              >
                {o.icon}
              </button>
            ))}
          </div>

          <div className={styles.toolSep} />

          {/* Width (only when not full) */}
          {align !== "full" && (
            <>
              <div className={styles.toolGroup}>
                <select
                  className={styles.toolSelect}
                  value={width || "100%"}
                  onChange={e => { e.stopPropagation(); updateAttributes({ width: e.target.value }); }}
                  onClick={e => e.stopPropagation()}
                >
                  {widthOptions.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className={styles.toolSep} />
            </>
          )}

          {/* Effects */}
          <div className={styles.toolGroup}>
            <select
              className={styles.toolSelect}
              value={effect}
              onChange={e => { e.stopPropagation(); updateAttributes({ effect: e.target.value }); }}
              onClick={e => e.stopPropagation()}
            >
              {effectOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.toolSep} />

          {/* Caption toggle */}
          <button
            type="button"
            title="Thêm chú thích"
            className={`${styles.toolBtn} ${caption ? styles.toolBtnActive : ""}`}
            onClick={e => { e.stopPropagation(); setEditCaption(v => !v); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            title="Xóa ảnh"
            className={`${styles.toolBtn} ${styles.toolBtnDanger}`}
            onClick={e => { e.stopPropagation(); updateAttributes({ src: "" }); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      )}

      {/* ── Image ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className={imgClasses}
        style={{ width: "100%", display: "block" }}
        draggable={false}
      />

      {/* ── Caption input ── */}
      {(editCaption || caption) && (
        <div className={styles.captionWrap} contentEditable={false}>
          {editCaption ? (
            <input
              className={styles.captionInput}
              value={captionVal}
              placeholder="Nhập chú thích ảnh..."
              onChange={e => setCaptionVal(e.target.value)}
              onBlur={() => {
                updateAttributes({ caption: captionVal });
                setEditCaption(false);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  updateAttributes({ caption: captionVal });
                  setEditCaption(false);
                }
                if (e.key === "Escape") setEditCaption(false);
              }}
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <p
              className={styles.caption}
              onClick={e => { e.stopPropagation(); setEditCaption(true); }}
            >
              {caption}
            </p>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}

// ── TipTap Extension ───────────────────────────────────────────────────────
export const ImageWithEffects = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:     { default: null },
      alt:     { default: "" },
      align:   { default: "center" as ImageAlign },
      effect:  { default: "none" as ImageEffect },
      width:   { default: "100%" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { align, effect, width, caption, ...rest } = HTMLAttributes;
    const style = [
      align === "full" ? "width:100%" : `width:${width || "100%"}`,
      align === "left"  ? "float:left;margin:0.5rem 1.25rem 0.5rem 0" : "",
      align === "right" ? "float:right;margin:0.5rem 0 0.5rem 1.25rem" : "",
      align === "center" || align === "full" ? "display:block;margin:0.75rem auto" : "",
      effect === "rounded"   ? "border-radius:12px" : "",
      effect === "circle"    ? "border-radius:50%;aspect-ratio:1;object-fit:cover" : "",
      effect === "shadow"    ? "box-shadow:0 8px 32px rgba(0,0,0,0.18)" : "",
      effect === "border"    ? "border:3px solid #e2e8f0;border-radius:8px" : "",
      effect === "grayscale" ? "filter:grayscale(100%)" : "",
      effect === "sepia"     ? "filter:sepia(80%)" : "",
    ].filter(Boolean).join(";");

    const imgEl: [string, Record<string, string>] = ["img", mergeAttributes(rest, { style, "data-align": align, "data-effect": effect })];

    if (caption) {
      return ["figure", { style: align === "left" ? "float:left;margin:0.5rem 1.25rem 0.5rem 0" : align === "right" ? "float:right;margin:0.5rem 0 0.5rem 1.25rem" : "display:block;margin:0.75rem auto", width: align === "full" ? "100%" : (width || "100%") },
        imgEl,
        ["figcaption", { style: "text-align:center;font-size:0.82rem;color:#64748b;margin-top:0.4rem;font-style:italic" }, caption],
      ];
    }

    return imgEl;
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      setImage:
        (attrs: { src: string; alt?: string; align?: ImageAlign; effect?: ImageEffect; width?: string; caption?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});
