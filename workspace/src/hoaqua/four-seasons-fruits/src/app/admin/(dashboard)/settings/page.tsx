// Admin Settings Page - Configure store contact info

import { getStoreSettings } from "@/actions/settings-actions";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt cửa hàng</h1>
        <p className="text-gray-600 text-sm mt-1">
          Cấu hình thông tin liên hệ, địa chỉ, mạng xã hội
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
