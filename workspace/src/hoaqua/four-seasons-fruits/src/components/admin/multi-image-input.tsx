"use client";

// Multi-image input component
// Allows adding multiple image URLs with preview, reorder, and delete

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical, ImageIcon } from "lucide-react";
import Image from "next/image";

interface MultiImageInputProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function MultiImageInput({ images, onChange }: MultiImageInputProps) {
  const [newUrl, setNewUrl] = useState("");

  const addImage = () => {
    if (newUrl.trim()) {
      onChange([...images, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onChange(newImages);
  };

  const setAsThumbnail = (index: number) => {
    // Move selected image to first position (thumbnail)
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={`relative group rounded-xl overflow-hidden border-2 aspect-square ${
                index === 0
                  ? "border-emerald-400 ring-2 ring-emerald-100"
                  : "border-gray-200"
              }`}
            >
              {/* Image Preview */}
              <Image
                src={url}
                alt={`Ảnh ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Fallback for broken images */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 -z-10">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>

              {/* Thumbnail badge */}
              {index === 0 && (
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Ảnh chính
                </span>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {/* Move buttons */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:bg-gray-100 text-xs"
                    title="Di chuyển lên"
                  >
                    ←
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setAsThumbnail(index)}
                    className="p-1.5 bg-emerald-600 rounded-lg text-white hover:bg-emerald-700 text-xs"
                    title="Đặt làm ảnh chính"
                  >
                    ★
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:bg-gray-100 text-xs"
                    title="Di chuyển xuống"
                  >
                    →
                  </button>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Drag handle indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image URL Input */}
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Nhập URL hình ảnh (https://...)"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImage();
            }
          }}
        />
        <Button
          type="button"
          onClick={addImage}
          disabled={!newUrl.trim()}
          variant="outline"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Thêm ảnh
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Ảnh đầu tiên sẽ là ảnh chính (thumbnail). Nhấn ★ để đặt ảnh khác làm ảnh chính.
        Hỗ trợ URL từ bất kỳ nguồn nào.
      </p>
    </div>
  );
}
