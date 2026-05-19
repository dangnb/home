"use client";

// Promotion Form - Create/Edit promotions
// Supports: by product, by category, or all products

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPromotion, updatePromotion } from "@/actions/promotion-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, ArrowLeft, Percent, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

interface PromotionFormProps {
  categories: Category[];
  products: Product[];
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    discount: number;
    type: string;
    productIds: string | null;
    categoryIds: string | null;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    minOrder: number | null;
    maxDiscount: number | null;
    code: string | null;
  };
}

export function PromotionForm({ categories, products, initialData }: PromotionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const [type, setType] = useState(initialData?.type || "product");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    if (initialData?.productIds) {
      try { return JSON.parse(initialData.productIds); } catch { return []; }
    }
    return [];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialData?.categoryIds) {
      try { return JSON.parse(initialData.categoryIds); } catch { return []; }
    }
    return [];
  });

  const formatDateForInput = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      discount: parseFloat(formData.get("discount") as string),
      type,
      productIds: type === "product" ? selectedProducts : undefined,
      categoryIds: type === "category" ? selectedCategories : undefined,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      isActive: formData.get("isActive") === "on",
      minOrder: formData.get("minOrder") ? parseFloat(formData.get("minOrder") as string) : null,
      maxDiscount: formData.get("maxDiscount") ? parseFloat(formData.get("maxDiscount") as string) : null,
      code: (formData.get("code") as string) || undefined,
    };

    let result;
    if (isEditing) {
      result = await updatePromotion(initialData.id, data);
    } else {
      result = await createPromotion(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật" : "Đã tạo khuyến mại");
      router.push("/admin/promotions");
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Percent className="h-4 w-4 text-orange-600" />
          Thông tin khuyến mại
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên chương trình *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="VD: Giảm giá mùa hè"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Mã khuyến mại (tùy chọn)</Label>
            <Input
              id="code"
              name="code"
              defaultValue={initialData?.code || ""}
              placeholder="VD: SUMMER2024"
              className="h-11 uppercase"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="Mô tả ngắn về chương trình..."
            rows={2}
          />
        </div>
      </div>

      {/* Discount Config */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">💰 Cấu hình chiết khấu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount">Phần trăm giảm (%) *</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              required
              min="1"
              max="100"
              defaultValue={initialData?.discount}
              placeholder="10"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minOrder">Đơn tối thiểu (VND)</Label>
            <Input
              id="minOrder"
              name="minOrder"
              type="number"
              min="0"
              defaultValue={initialData?.minOrder || ""}
              placeholder="100000"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
            <Input
              id="maxDiscount"
              name="maxDiscount"
              type="number"
              min="0"
              defaultValue={initialData?.maxDiscount || ""}
              placeholder="50000"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Apply To */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">🎯 Áp dụng cho</h2>

        {/* Type selector */}
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tất cả sản phẩm" },
            { value: "category", label: "Theo danh mục" },
            { value: "product", label: "Theo sản phẩm" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                type === opt.value
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category selector */}
        {type === "category" && (
          <div className="space-y-3">
            <Label>Chọn danh mục áp dụng</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategories(
                        isSelected
                          ? selectedCategories.filter((id) => id !== cat.id)
                          : [...selectedCategories, cat.id]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200"
                    }`}
                  >
                    {cat.name}
                    {isSelected && <span className="ml-1">✓</span>}
                  </button>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <p className="text-xs text-emerald-600">
                Đã chọn {selectedCategories.length} danh mục
              </p>
            )}
          </div>
        )}

        {/* Product selector */}
        {type === "product" && (
          <div className="space-y-3">
            <Label>Chọn sản phẩm áp dụng</Label>
            <div className="max-h-60 overflow-y-auto border rounded-xl p-3 space-y-1">
              {products.map((prod) => {
                const isSelected = selectedProducts.includes(prod.id);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedProducts(
                          isSelected
                            ? selectedProducts.filter((id) => id !== prod.id)
                            : [...selectedProducts, prod.id]
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{prod.name}</span>
                  </label>
                );
              })}
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-emerald-600">
                  Đã chọn {selectedProducts.length} sản phẩm
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProducts([])}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5"
                >
                  <X className="h-3 w-3" /> Bỏ chọn tất cả
                </button>
              </div>
            )}
          </div>
        )}

        {type === "all" && (
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            Khuyến mại sẽ áp dụng cho tất cả sản phẩm trong cửa hàng.
          </p>
        )}
      </div>

      {/* Time Period */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">📅 Thời gian áp dụng</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Bắt đầu *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
              defaultValue={
                initialData ? formatDateForInput(initialData.startDate) : ""
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Kết thúc *</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              required
              defaultValue={
                initialData ? formatDateForInput(initialData.endDate) : ""
              }
              className="h-11"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialData?.isActive ?? true}
            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm font-medium">Kích hoạt ngay</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 px-6"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo khuyến mại"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </form>
  );
}
