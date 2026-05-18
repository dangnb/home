"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface ConfigItem {
  key: string;
  label: string;
  value: string;
  description: string;
  type: "text" | "textarea";
}

const defaultConfigs: ConfigItem[] = [
  { key: "site_name", label: "Tên website", value: "Xe Ghép Nam Định", description: "Tên hiển thị trên website", type: "text" },
  { key: "hotline", label: "Hotline", value: "0379803990", description: "Số điện thoại hotline", type: "text" },
  { key: "hotline_2", label: "Hotline 2", value: "0345076789", description: "Số điện thoại phụ", type: "text" },
  { key: "zalo_link", label: "Link Zalo", value: "https://zalo.me/0379803990", description: "Link chat Zalo", type: "text" },
  { key: "address_1", label: "Địa chỉ 1", value: "Ngã tư bưu điện, TT Giao Thủy, Nam Định", description: "Trụ sở chính", type: "text" },
  { key: "address_2", label: "Địa chỉ 2", value: "Số 2A Văn Cao, P. Thụy Khê, Q. Tây Hồ, Hà Nội", description: "Văn phòng Hà Nội", type: "text" },
  { key: "facebook_pixel", label: "Facebook Pixel ID", value: "", description: "ID pixel Facebook Ads", type: "text" },
  { key: "google_analytics", label: "Google Analytics ID", value: "", description: "ID Google Analytics (G-XXXXXXX)", type: "text" },
  { key: "google_ads_id", label: "Google Ads ID", value: "", description: "ID Google Ads conversion", type: "text" },
  { key: "tiktok_pixel", label: "TikTok Pixel ID", value: "", description: "ID pixel TikTok Ads", type: "text" },
  { key: "meta_title", label: "Meta Title mặc định", value: "Xe Ghép Nam Định – Đặt xe nhanh 24/7", description: "Title SEO mặc định", type: "text" },
  { key: "meta_description", label: "Meta Description", value: "Dịch vụ xe ghép Nam Định đi Hà Nội, đón trả tận nơi, giá rõ ràng. Hotline: 0379.803.990", description: "Description SEO mặc định", type: "textarea" },
];

export default function AdminConfig() {
  const [configs, setConfigs] = useState<ConfigItem[]>(defaultConfigs);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        if (data.config) {
          setConfigs((prev) =>
            prev.map((item) => ({
              ...item,
              value: data.config[item.key] || item.value,
            }))
          );
        }
      } catch (error) {
        console.error("Fetch config error:", error);
      }
    }
    fetchConfigs();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          configs: configs.map((c) => ({
            key: c.key,
            value: c.value,
            description: c.description,
          })),
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Save config error:", error);
      alert("Lỗi lưu cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (key: string, value: string) => {
    setConfigs((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cấu hình website</h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin liên hệ, pixel tracking và SEO</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Đã lưu cấu hình thành công!
        </div>
      )}

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configs.filter((c) => ["site_name", "hotline", "hotline_2", "zalo_link", "address_1", "address_2"].includes(c.key)).map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.label}
                </label>
                <input
                  type="text"
                  value={config.value}
                  onChange={(e) => updateValue(config.key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder={config.description}
                />
                <p className="text-xs text-gray-400 mt-1">{config.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pixel & Tracking (Sale Google, Facebook, TikTok)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configs.filter((c) => ["facebook_pixel", "google_analytics", "google_ads_id", "tiktok_pixel"].includes(c.key)).map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.label}
                </label>
                <input
                  type="text"
                  value={config.value}
                  onChange={(e) => updateValue(config.key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder={config.description}
                />
                <p className="text-xs text-gray-400 mt-1">{config.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO mặc định</h2>
          <div className="space-y-4">
            {configs.filter((c) => ["meta_title", "meta_description"].includes(c.key)).map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.label}
                </label>
                {config.type === "textarea" ? (
                  <textarea
                    value={config.value}
                    onChange={(e) => updateValue(config.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    rows={3}
                    placeholder={config.description}
                  />
                ) : (
                  <input
                    type="text"
                    value={config.value}
                    onChange={(e) => updateValue(config.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder={config.description}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
