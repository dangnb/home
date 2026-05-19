"use client";

// Voucher Form - Create/Edit vouchers

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVoucher, updateVoucher } from "@/actions/voucher-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, ArrowLeft, Ticket } from "lucide-react";

interface VoucherFormProps {
  initialData?: {
    id: string;
    code: string;
    description: string | null;
    discountType: string;
    discountValue: number;
    minOrder: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    perUserLimit: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

export function VoucherForm({ initialData }: VoucherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState(initialData?.discountType || "percent");
  const isEditing = !!initialData;

  const formatDateForInput = (date: Date) => new Date(date).toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || undefined,
      discountType,
      discountValue: parseFloat(formData.get("discountValue") as string),
      minOrder: formData.get("minOrder") ? parseFloat(formData.get("minOrder") as string) : null,
      maxDiscount: formData.get("maxDiscount") ? parseFloat(formData.get("maxDiscount") as string) : null,
      usageLimit: formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : null,
      perUserLimit: parseInt(formData.get("perUserLimit") as string) || 1,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      isActive: formData.get("isActive") === "on",
    };

    let result;
    if (isEditing) {
      result = await updateVoucher(initialData.id, data);
    } else {
      result = await createVoucher(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật voucher" : "Đã tạo voucher");
      router.push("/admin/vouchers");
      router.refresh();
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Code & Description */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Ticket className="h-4 w-4 text-purple-600" />
          Thông tin voucher
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã voucher *</Label>
            <Input
              id="code"
              name="code"
              required
              defaultValue={initialData?.code}
              placeholder="VD: GIAM50K"
              className="h-11 uppercase font-mono"
            />
            <p className="text-xs text-gray-500">Tự động chuyển thành chữ in hoa</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="perUserLimit">Giới hạn/người</Label>
            <Input
              id="perUserLimit"
              name="perUserLimit"
              type="number"
              min="1"
              defaultValue={initialData?.perUserLimit ?? 1}
              className="h-11"
            />
            <p className="text-xs text-gray-500">Số lần mỗi email được dùng</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="VD: Giảm 50.000đ cho đơn từ 200.000đ"
            rows={2}
          />
        </div>
      </div>

      {/* Discount Config */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">💰 Cấu hình giảm giá</h2>

        {/* Discount Type Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDiscountType("percent")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              discountType === "percent"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Giảm theo %
          </button>
          <button
            type="button"
            onClick={() => setDiscountType("fixed")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              discountType === "fixed"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Giảm cố định (VND)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discountValue">
              {discountType === "percent" ? "Phần trăm giảm (%)" : "Số tiền giảm (VND)"} *
            </Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              required
              min="1"
              max={discountType === "percent" ? "100" : undefined}
              defaultValue={initialData?.discountValue}
              placeholder={discountType === "percent" ? "10" : "50000"}
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
              placeholder="200000"
              className="h-11"
            />
          </div>
          {discountType === "percent" && (
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Giảm tối đa (VND)</Label>
              <Input
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                min="0"
                defaultValue={initialData?.maxDiscount || ""}
                placeholder="100000"
                className="h-11"
              />
            </div>
          )}
        </div>
      </div>

      {/* Usage & Time */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold">📅 Thời gian & Giới hạn</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Bắt đầu *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
              defaultValue={initialData ? formatDateForInput(initialData.startDate) : ""}
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
              defaultValue={initialData ? formatDateForInput(initialData.endDate) : ""}
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="usageLimit">Tổng lượt sử dụng tối đa</Label>
            <Input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              defaultValue={initialData?.usageLimit || ""}
              placeholder="Để trống = không giới hạn"
              className="h-11"
            />
          </div>
          <div className="flex items-end pb-1">
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 px-6">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo voucher"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </form>
  );
}
