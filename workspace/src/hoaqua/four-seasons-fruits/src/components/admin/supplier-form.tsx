"use client";

// Supplier Form with Rich Text Editor for description

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupplier, updateSupplier } from "@/actions/supplier-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";
import { Save, ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface SupplierFormProps {
  initialData?: {
    id: string;
    name: string;
    code: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    contactName: string | null;
    taxCode: string | null;
    description: string | null;
    logo: string | null;
    isActive: boolean;
  };
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const [description, setDescription] = useState(initialData?.description || "");
  const [logo, setLogo] = useState(initialData?.logo || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.files?.[0]) {
        setLogo(data.files[0].url);
        toast.success("Đã upload logo");
      } else {
        toast.error(data.error || "Upload thất bại");
      }
    } catch { toast.error("Upload thất bại"); }
    finally { setIsUploadingLogo(false); e.target.value = ""; }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      code: (formData.get("code") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      contactName: (formData.get("contactName") as string) || undefined,
      taxCode: (formData.get("taxCode") as string) || undefined,
      description: description || undefined,
      logo: logo || undefined,
      isActive: formData.get("isActive") === "on",
    };

    let result;
    if (isEditing) {
      result = await updateSupplier(initialData.id, data);
    } else {
      result = await createSupplier(data);
    }

    if (result.success) {
      toast.success(isEditing ? "Đã cập nhật NCC" : "Đã tạo NCC");
      router.push("/admin/suppliers");
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
        <h2 className="font-semibold text-lg">Thông tin cơ bản</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhà cung cấp *</Label>
            <Input id="name" name="name" required defaultValue={initialData?.name} placeholder="VD: Công ty TNHH Trái Cây Miền Tây" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Mã NCC</Label>
            <Input id="code" name="code" defaultValue={initialData?.code || ""} placeholder="VD: NCC001" className="h-11" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Người liên hệ</Label>
            <Input id="contactName" name="contactName" defaultValue={initialData?.contactName || ""} placeholder="Nguyễn Văn A" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxCode">Mã số thuế</Label>
            <Input id="taxCode" name="taxCode" defaultValue={initialData?.taxCode || ""} placeholder="0123456789" className="h-11" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" defaultValue={initialData?.phone || ""} placeholder="0123 456 789" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} placeholder="ncc@example.com" className="h-11" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input id="address" name="address" defaultValue={initialData?.address || ""} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" className="h-11" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm font-medium">Đang hoạt động</span>
        </label>
      </div>

      {/* Logo */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold text-lg">Logo nhà cung cấp</h2>

        {logo ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border bg-gray-50">
            <Image src={logo} alt="Logo" fill className="object-contain p-2" />
            <button type="button" onClick={() => setLogo("")} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={isUploadingLogo}
            className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            {isUploadingLogo ? (
              <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-500">Upload logo</span>
              </>
            )}
          </button>
        )}

        <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
      </div>

      {/* Description - Rich Text Editor */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold text-lg">Mô tả nhà cung cấp</h2>
        <p className="text-sm text-gray-500">Thông tin chi tiết về NCC: lịch sử, sản phẩm cung cấp, chính sách...</p>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder="Viết mô tả chi tiết về nhà cung cấp..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 px-6">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo NCC"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </form>
  );
}
