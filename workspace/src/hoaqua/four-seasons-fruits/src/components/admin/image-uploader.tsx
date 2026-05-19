"use client";

// Image Uploader Component
// Drag & drop or click to upload, with preview grid
// Files are uploaded to /api/upload (local storage)
// Easy to swap for cloud (S3, Cloudinary) by changing the API route

import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, Star, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload files to API
  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Check max files
    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Tối đa ${maxFiles} ảnh`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      fileArray.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Upload thất bại");
        return;
      }

      // Add new URLs to images array
      const newUrls = data.files.map((f: { url: string }) => f.url);
      onChange([...images, ...newUrls]);
      toast.success(`Đã upload ${newUrls.length} ảnh`);
    } catch {
      toast.error("Upload thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      // Reset input
      e.target.value = "";
    }
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadFiles(files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  // Remove image
  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // Set as thumbnail (move to first position)
  const setAsThumbnail = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
    toast.success("Đã đặt làm ảnh chính");
  };

  // Move image
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-emerald-400 bg-emerald-50 scale-[1.01]"
            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium text-emerald-600">
              Đang upload...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Kéo thả ảnh vào đây hoặc{" "}
                <span className="text-emerald-600">nhấn để chọn</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP, GIF • Tối đa 5MB/ảnh • Tối đa {maxFiles} ảnh
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={`relative group rounded-xl overflow-hidden border-2 aspect-square ${
                index === 0
                  ? "border-emerald-400 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Image */}
              <Image
                src={url}
                alt={`Ảnh ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Thumbnail badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                  Ảnh chính
                </span>
              )}

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                {/* Set as thumbnail */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setAsThumbnail(index)}
                    className="p-2 bg-white rounded-lg text-emerald-600 hover:bg-emerald-50 shadow-md transition-colors"
                    title="Đặt làm ảnh chính"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}

                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50 shadow-md transition-colors"
                    title="Di chuyển trái"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Remove button - always visible on hover */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                title="Xóa ảnh"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Image number */}
              <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {index + 1}/{images.length}
              </span>
            </div>
          ))}

          {/* Add more placeholder */}
          {images.length < maxFiles && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <ImageIcon className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500">Thêm ảnh</span>
            </button>
          )}
        </div>
      )}

      {/* Info */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Star className="h-3 w-3 text-emerald-500" />
          Ảnh đầu tiên là ảnh chính (thumbnail). Nhấn ★ để thay đổi.
        </p>
      )}
    </div>
  );
}
