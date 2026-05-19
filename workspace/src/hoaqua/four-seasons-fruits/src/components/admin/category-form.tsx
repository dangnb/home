"use client";

// Category Form with image upload

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X, Loader2, Save, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(initialData?.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

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
        setImage(data.files[0].url);
        toast.success("Đã upload ảnh danh mục");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      image: image || undefined,
    };

    let result;
    if (isEditing) {
      result = await updateCategory(initialData.id, data);
    } else {
      result = await createCategory(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật danh mục" : "Đã tạo danh mục");
      router.push("/admin/categories");
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="bg-white p-6 rounded-xl border space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Tên danh mục *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="VD: Trái cây nhập khẩu"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="Mô tả ngắn về danh mục..."
            rows={3}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <Label>Ảnh danh mục</Label>

          {image ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-gray-50">
              <Image
                src={image}
                alt="Category image"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                isUploading
                  ? "border-emerald-300 bg-emerald-50 pointer-events-none"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                  <p className="text-sm text-emerald-600 font-medium">Đang upload...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Nhấn để chọn ảnh
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      PNG, JPG, WebP • Tối đa 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật danh mục"
              : "Tạo danh mục"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </form>
  );
}
