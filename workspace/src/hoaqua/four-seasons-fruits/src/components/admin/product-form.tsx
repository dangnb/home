"use client";

// Product Form with Rich Text Editor and Multi-Image support

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUploader } from "./image-uploader";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    content: string | null;
    price: number;
    salePrice: number | null;
    image: string | null;
    images: string | null;
    stock: number;
    unit: string;
    featured: boolean;
    isOnSale: boolean;
    categoryId: string;
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  // Rich text content state
  const [content, setContent] = useState(initialData?.content || "");

  // Multi-image state
  const [images, setImages] = useState<string[]>(() => {
    if (initialData?.images) {
      try {
        return JSON.parse(initialData.images);
      } catch {
        return [];
      }
    }
    // If there's a single image, use it as the first
    if (initialData?.image) {
      return [initialData.image];
    }
    return [];
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      content: content || undefined,
      price: parseFloat(formData.get("price") as string),
      salePrice: formData.get("salePrice")
        ? parseFloat(formData.get("salePrice") as string)
        : null,
      image: images[0] || undefined, // First image as thumbnail
      images: images.length > 0 ? JSON.stringify(images) : undefined,
      stock: parseInt(formData.get("stock") as string),
      unit: formData.get("unit") as string,
      featured: formData.get("featured") === "on",
      isOnSale: formData.get("isOnSale") === "on",
      categoryId: formData.get("categoryId") as string,
    };

    let result;
    if (isEditing) {
      result = await updateProduct(initialData.id, data);
    } else {
      result = await createProduct(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật sản phẩm" : "Đã tạo sản phẩm");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          📝 Thông tin cơ bản
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="VD: Xoài Cát Hòa Lộc"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục *</Label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={initialData?.categoryId}
              className="w-full h-11 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả ngắn</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị ở danh sách)..."
            rows={3}
          />
        </div>
      </div>

      {/* Rich Text Content */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          📄 Nội dung chi tiết
        </h2>
        <p className="text-sm text-gray-500">
          Viết mô tả chi tiết về sản phẩm với định dạng phong phú (in đậm, danh sách, heading...)
        </p>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          🖼️ Hình ảnh sản phẩm
        </h2>
        <p className="text-sm text-gray-500">
          Upload ảnh sản phẩm. Ảnh đầu tiên sẽ là ảnh đại diện (thumbnail).
        </p>
        <ImageUploader images={images} onChange={setImages} maxFiles={8} />
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white p-6 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          💰 Giá & Tồn kho
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Giá gốc (VND) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              defaultValue={initialData?.price}
              placeholder="50000"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Giá khuyến mãi (VND)</Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              min="0"
              defaultValue={initialData?.salePrice || ""}
              placeholder="Để trống nếu không giảm giá"
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Tồn kho *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              required
              min="0"
              defaultValue={initialData?.stock ?? 0}
              placeholder="100"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Đơn vị *</Label>
            <Input
              id="unit"
              name="unit"
              required
              defaultValue={initialData?.unit || "kg"}
              placeholder="kg, hộp, trái..."
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          ⚙️ Tùy chọn hiển thị
        </h2>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initialData?.featured}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-sm font-medium group-hover:text-emerald-600 transition-colors">
                Sản phẩm nổi bật
              </span>
              <p className="text-xs text-gray-500">Hiển thị ở trang chủ</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="isOnSale"
              defaultChecked={initialData?.isOnSale}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-sm font-medium group-hover:text-emerald-600 transition-colors">
                Đang khuyến mãi
              </span>
              <p className="text-xs text-gray-500">Hiển thị badge giảm giá</p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 px-6"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting
            ? "Đang lưu..."
            : isEditing
              ? "Cập nhật sản phẩm"
              : "Tạo sản phẩm"}
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
