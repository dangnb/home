"use client";

// Settings Form - Edit store contact information

import { useState } from "react";
import { updateSettings } from "@/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Store, Phone, Globe, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  settings: Record<string, string>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    const result = await updateSettings(data);

    if (result.success) {
      toast.success("Đã lưu cài đặt");
      router.refresh();
    } else {
      toast.error(result.error || "Lưu thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Store Info */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-gray-800">
          <Store className="h-4 w-4 text-emerald-600" />
          Thông tin cửa hàng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Tên cửa hàng</Label>
            <Input
              id="store_name"
              name="store_name"
              defaultValue={settings.store_name}
              placeholder="Four Seasons Fruits"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store_slogan">Slogan</Label>
            <Input
              id="store_slogan"
              name="store_slogan"
              defaultValue={settings.store_slogan}
              placeholder="Hoa quả tươi ngon bốn mùa"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-gray-800">
          <Phone className="h-4 w-4 text-emerald-600" />
          Liên hệ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại chính</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={settings.phone}
              placeholder="0123 456 789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_2">Số điện thoại phụ</Label>
            <Input
              id="phone_2"
              name="phone_2"
              defaultValue={settings.phone_2}
              placeholder="0987 654 321"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={settings.email}
            placeholder="info@fourseasons.vn"
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-gray-800">
          <MapPin className="h-4 w-4 text-emerald-600" />
          Địa chỉ
        </h2>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ cửa hàng</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={settings.address}
            placeholder="123 Đường Trái Cây, Quận 1, TP.HCM"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="google_map">Link Google Maps</Label>
          <Input
            id="google_map"
            name="google_map"
            defaultValue={settings.google_map}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="google_map_embed">Google Maps Embed URL</Label>
          <Input
            id="google_map_embed"
            name="google_map_embed"
            defaultValue={settings.google_map_embed}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-gray-500">
            Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → Copy src URL
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-gray-800">
          <Clock className="h-4 w-4 text-emerald-600" />
          Giờ mở cửa
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="working_hours_weekday">Thứ 2 - Thứ 6</Label>
            <Input
              id="working_hours_weekday"
              name="working_hours_weekday"
              defaultValue={settings.working_hours_weekday}
              placeholder="7:00 - 21:00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="working_hours_saturday">Thứ 7</Label>
            <Input
              id="working_hours_saturday"
              name="working_hours_saturday"
              defaultValue={settings.working_hours_saturday}
              placeholder="7:00 - 22:00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="working_hours_sunday">Chủ nhật</Label>
            <Input
              id="working_hours_sunday"
              name="working_hours_sunday"
              defaultValue={settings.working_hours_sunday}
              placeholder="8:00 - 20:00"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-gray-800">
          <Globe className="h-4 w-4 text-emerald-600" />
          Mạng xã hội
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              defaultValue={settings.facebook}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              defaultValue={settings.instagram}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zalo">Zalo</Label>
            <Input
              id="zalo"
              name="zalo"
              defaultValue={settings.zalo}
              placeholder="https://zalo.me/..."
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 bg-white p-4 rounded-xl border shadow-lg">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 px-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>
    </form>
  );
}
