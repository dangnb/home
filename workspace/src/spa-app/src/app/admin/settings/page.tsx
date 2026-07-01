'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    phone: '',
    email: '',
    address: '',
    videoUrl: '',
    facebook: '',
    zalo: '',
    mapUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });

    if (res.ok) {
      alert('Đã lưu cấu hình thành công!');
    } else {
      alert('Đã có lỗi xảy ra');
    }
    setSaving(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Cấu hình Hệ thống (Settings)</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Thông tin chung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên trang web</label>
              <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="text" name="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Mạng xã hội & Khác</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video trang chủ (YouTube Embed URL)</label>
              <input type="text" name="videoUrl" value={settings.videoUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Link</label>
              <input type="text" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zalo Link</label>
              <input type="text" name="zalo" value={settings.zalo} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bản đồ Google Maps (Embed URL)</label>
              <input type="text" name="mapUrl" value={settings.mapUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </form>
    </div>
  );
}
