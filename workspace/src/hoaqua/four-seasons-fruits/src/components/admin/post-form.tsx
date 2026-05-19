"use client";

// Post Editor Form - Full-featured article editor
// Clean, distraction-free writing experience

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/actions/post-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";
import {
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    type: string;
  };
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [coverPreview, setCoverPreview] = useState(initialData?.coverImage || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      excerpt: (formData.get("excerpt") as string) || undefined,
      content,
      coverImage: (formData.get("coverImage") as string) || undefined,
      published,
      type: formData.get("type") as string,
    };

    if (!data.content || data.content === "<p></p>") {
      toast.error("Vui lòng nhập nội dung bài viết");
      setIsSubmitting(false);
      return;
    }

    let result;
    if (isEditing) {
      result = await updatePost(initialData.id, data);
    } else {
      result = await createPost(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật bài viết" : "Đã tạo bài viết");
      router.push("/admin/posts");
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-white border-b px-6 py-3 -mx-6 -mt-6 mb-6 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex items-center gap-3">
          {/* Publish toggle */}
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              published
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {published ? (
              <>
                <Eye className="h-4 w-4" />
                Xuất bản
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Bản nháp
              </>
            )}
          </button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input
              name="title"
              required
              defaultValue={initialData?.title}
              placeholder="Tiêu đề bài viết..."
              className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-0 focus:outline-none focus:ring-0 p-0"
            />
          </div>

          {/* Excerpt */}
          <div>
            <Textarea
              name="excerpt"
              defaultValue={initialData?.excerpt || ""}
              placeholder="Mô tả ngắn (hiển thị ở danh sách bài viết)..."
              rows={2}
              className="border-0 border-b rounded-none px-0 focus-visible:ring-0 resize-none text-gray-600"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Bắt đầu viết nội dung bài viết tại đây... Sử dụng toolbar phía trên để định dạng văn bản."
            />
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="lg:col-span-1 space-y-5">
          {/* Post Type */}
          <div className="bg-white p-5 rounded-xl border space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Loại bài viết
            </h3>
            <select
              name="type"
              defaultValue={initialData?.type || "about"}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="about">Giới thiệu cửa hàng</option>
              <option value="article">Bài viết / Tin tức</option>
              <option value="page">Trang tĩnh</option>
            </select>
            <p className="text-xs text-gray-500">
              Bài &quot;Giới thiệu&quot; sẽ hiển thị ở trang Giới thiệu cửa hàng.
            </p>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-5 rounded-xl border space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Ảnh bìa
            </h3>

            {coverPreview && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverPreview("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <CoverImageUpload
              value={coverPreview}
              onChange={(url) => setCoverPreview(url)}
            />
            {/* Hidden input to submit the value */}
            <input type="hidden" name="coverImage" value={coverPreview} />
            <p className="text-xs text-gray-500">
              Ảnh bìa hiển thị ở đầu bài viết. Nên dùng ảnh ngang (16:9).
            </p>
          </div>

          {/* Status Info */}
          <div className="bg-white p-5 rounded-xl border space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Trạng thái
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Hiển thị:</span>
                <span className={published ? "text-emerald-600 font-medium" : "text-gray-600"}>
                  {published ? "Công khai" : "Ẩn (bản nháp)"}
                </span>
              </div>
              {initialData && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật:</span>
                  <span className="text-gray-600">
                    {new Date(initialData.id ? Date.now() : Date.now()).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Writing Tips */}
          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 space-y-2">
            <h3 className="font-semibold text-sm text-emerald-800">💡 Gợi ý viết bài</h3>
            <ul className="text-xs text-emerald-700 space-y-1.5">
              <li>• Giới thiệu câu chuyện thương hiệu</li>
              <li>• Chia sẻ quy trình chọn lọc sản phẩm</li>
              <li>• Cam kết chất lượng & dịch vụ</li>
              <li>• Thông tin đội ngũ & cửa hàng</li>
              <li>• Sử dụng heading để chia đoạn rõ ràng</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}

// Sub-component: Single image upload for cover
function CoverImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.files?.[0]) {
        onChange(data.files[0].url);
        toast.success("Đã upload ảnh bìa");
      } else {
        toast.error(data.error || "Upload thất bại");
      }
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {!value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors"
        >
          {isUploading ? "Đang upload..." : "📷 Chọn ảnh bìa"}
        </button>
      )}
    </>
  );
}
