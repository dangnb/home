"use client";
import { useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import styles from "./RichEditor.module.css";

// Load ReactQuill dynamically to avoid SSR issues
const ReactQuill: any = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung...",
  minHeight = 400,
}: RichEditorProps) {
  const reactQuillRef = useRef<any>(null);

  // Custom image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.url) {
            const quill = reactQuillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              quill.insertEmbed(range ? range.index : 0, "image", data.url);
            }
          }
        } catch (error) {
          console.error("Upload failed", error);
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), [imageHandler]);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "align",
    "list", "bullet",
    "blockquote", "code-block",
    "link", "image", "video"
  ];

  return (
    <div className={styles.wrapper} style={{ minHeight: `${minHeight}px` }}>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={styles.editorArea}
      />
    </div>
  );
}
