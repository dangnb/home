"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Color, TextStyle, FontSize } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Highlighter,
  Type,
  Palette,
  Minus,
  Code,
  Move,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"];
const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#cccccc",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#1e3a5f", "#ffffff",
];

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [draggedImage, setDraggedImage] = useState<HTMLElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
          draggable: "true",
        },
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Sanitize: replace any remaining base64 images with placeholder
      let html = editor.getHTML();
      // Remove base64 data from img src to prevent saving heavy data
      html = html.replace(
        /src="data:image\/[^"]+"/g,
        'src="/uploads/uploading.png"'
      );
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
      handleDrop: (view, event, _slice, moved) => {
        // Handle image file drop
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const token = localStorage.getItem("admin_token");
            const formData = new FormData();
            formData.append("file", file);

            fetch("/api/upload", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.url) {
                  const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  if (pos) {
                    const node = view.state.schema.nodes.image.create({ src: data.url });
                    const tr = view.state.tr.insert(pos.pos, node);
                    view.dispatch(tr);
                  }
                }
              })
              .catch(() => {
                alert("Lỗi upload ảnh");
              });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        // Handle paste image from clipboard - upload instead of base64
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) return false;

            const token = localStorage.getItem("admin_token");
            const formData = new FormData();
            formData.append("file", file);

            fetch("/api/upload", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.url) {
                  const node = view.state.schema.nodes.image.create({ src: data.url });
                  const tr = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(tr);
                }
              })
              .catch(() => {
                alert("Lỗi upload ảnh");
              });
            return true;
          }
        }
        return false;
      },
    },
  });

  // Image drag & drop repositioning
  useEffect(() => {
    if (!editorRef.current) return;

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.classList.contains("editor-image")) {
        setDraggedImage(target);
        e.dataTransfer?.setData("text/plain", "image-move");
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      }
    };

    const handleDragOver = (e: DragEvent) => {
      if (draggedImage) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      }
    };

    const handleDrop = (e: DragEvent) => {
      if (draggedImage && editor) {
        e.preventDefault();
        const src = draggedImage.getAttribute("src");
        if (src) {
          // Delete old image position
          const { state } = editor.view;
          let oldPos = -1;
          state.doc.descendants((node, pos) => {
            if (node.type.name === "image" && node.attrs.src === src && oldPos === -1) {
              oldPos = pos;
            }
          });

          if (oldPos >= 0) {
            // Get new position
            const coords = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
            if (coords) {
              const tr = state.tr;
              tr.delete(oldPos, oldPos + 1);
              const adjustedPos = coords.pos > oldPos ? coords.pos - 1 : coords.pos;
              const imageNode = state.schema.nodes.image.create({ src });
              tr.insert(adjustedPos, imageNode);
              editor.view.dispatch(tr);
            }
          }
        }
        setDraggedImage(null);
      }
    };

    const el = editorRef.current;
    el.addEventListener("dragstart", handleDragStart);
    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragstart", handleDragStart);
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("drop", handleDrop);
    };
  }, [draggedImage, editor]);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Lỗi upload ảnh");
          return null;
        }

        const data = await res.json();
        return data.url;
      } catch {
        alert("Lỗi kết nối server khi upload ảnh");
        return null;
      }
    },
    []
  );

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const url = await uploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }, [editor, uploadImage]);

  const addImageUrl = useCallback(() => {
    const url = prompt("Nhập URL ảnh:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt("Nhập URL link:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const setFontSize = useCallback(
    (size: string) => {
      if (editor) {
        editor.chain().focus().setFontSize(size).run();
        setShowFontSize(false);
      }
    },
    [editor]
  );

  const setColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
        setShowColorPicker(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Hoàn tác"
          >
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Làm lại"
          >
            <Redo size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Font Size */}
        <ToolbarGroup>
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowFontSize(!showFontSize)}
              title="Cỡ chữ"
            >
              <Type size={16} />
            </ToolbarButton>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[80px]">
                {FONT_SIZES.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setFontSize(size)}
                    className="block w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 hover:text-blue-600"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Text formatting */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="In đậm"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="In nghiêng"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Gạch chân"
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Gạch ngang"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Code"
          >
            <Code size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Color */}
        <ToolbarGroup>
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Màu chữ"
            >
              <Palette size={16} />
            </ToolbarButton>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 grid grid-cols-5 gap-1 min-w-[140px]">
                {COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Căn trái"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Căn giữa"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Căn phải"
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Căn đều"
          >
            <AlignJustify size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Danh sách"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Danh sách số"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Trích dẫn"
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Đường kẻ ngang"
          >
            <Minus size={16} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Media */}
        <ToolbarGroup>
          <ToolbarButton onClick={addImage} title="Chèn ảnh từ máy">
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={addImageUrl} title="Chèn ảnh từ URL">
            <Move size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={addLink} title="Chèn link">
            <LinkIcon size={16} />
          </ToolbarButton>
        </ToolbarGroup>
      </div>

      {/* Editor Content */}
      <div ref={editorRef}>
        <EditorContent editor={editor} />
      </div>

      {/* Drag hint */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 flex items-center gap-2">
        <Move size={12} />
        Kéo thả ảnh để di chuyển vị trí trong bài viết. Kéo file ảnh từ máy vào editor để chèn.
      </div>
    </div>
  );
}

// Sub-components
function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
