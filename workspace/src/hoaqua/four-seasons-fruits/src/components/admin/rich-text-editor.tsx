"use client";

// Rich Text Editor using Tiptap
// Full toolbar with image upload, text alignment, formatting
// Smooth animations on mount

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Highlighter,
  Minus,
  ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Viết mô tả chi tiết về sản phẩm...",
}: RichTextEditorProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Highlight.configure({ multicolor: false }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-600 underline" },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-4",
        },
        allowBase64: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[250px] px-5 py-4 focus:outline-none text-gray-800 leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  // Upload image and insert into editor
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.files?.[0]) {
        editor.chain().focus().setImage({ src: data.files[0].url }).run();
        toast.success("Đã chèn ảnh");
      } else {
        toast.error(data.error || "Upload thất bại");
      }
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const addLink = () => {
    const url = window.prompt("Nhập URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertImageUrl = () => {
    const url = window.prompt("Nhập URL ảnh:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="border-b bg-gray-50/80 px-3 py-2 flex flex-wrap gap-0.5 items-center"
      >
        {/* Text formatting */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Đậm (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Nghiêng (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Gạch chân (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Gạch ngang"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
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
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Căn trái"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Căn giữa"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Căn phải"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists & Block */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Danh sách"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Danh sách số"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Trích dẫn"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Đường kẻ ngang"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Link & Image */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={addLink}
            active={editor.isActive("link")}
            title="Chèn link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>

          {/* Image upload button */}
          <ToolbarButton
            onClick={() => imageInputRef.current?.click()}
            title="Upload ảnh"
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </ToolbarButton>

          {/* Image from URL */}
          <ToolbarButton
            onClick={insertImageUrl}
            title="Chèn ảnh từ URL"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Undo/Redo - pushed to right */}
        <div className="ml-auto flex gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </motion.div>

      {/* Editor Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <EditorContent editor={editor} />
      </motion.div>

      {/* Hidden file input for image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Bottom status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="border-t bg-gray-50/50 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400"
      >
        <span>
          {editor.storage.characterCount?.characters?.() ?? 0} ký tự
        </span>
        <span>Markdown shortcuts supported</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Toolbar sub-components
// ============================================

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-150 ${
        active
          ? "bg-emerald-100 text-emerald-700 shadow-sm"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`}
    >
      {children}
    </button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 mx-1.5" />;
}
