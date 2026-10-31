'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function CareerEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  const router = useRouter();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    type: 'Full-time',
    location: 'Chi nhánh Quận 10',
    vi: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' }
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/careers/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setFormData({
              id: data.data.id || '',
              slug: data.data.slug || '',
              type: data.data.type || 'Full-time',
              location: data.data.location || 'Chi nhánh Quận 10',
              vi: data.data.vi || { title: '', excerpt: '', content: '' },
              en: data.data.en || { title: '', excerpt: '', content: '' }
            });
          }
          setLoading(false);
        });
    }
  }, [isNew, resolvedParams.id]);

  const handleChange = (lang: 'vi'|'en', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const finalData = { ...formData };
    if (isNew) {
      finalData.slug = finalData.vi.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || Date.now().toString();
      finalData.id = Date.now().toString();
    }

    const url = isNew ? '/api/careers' : `/api/careers/${resolvedParams.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    });

    if (res.ok) {
      router.push('/admin/careers');
      router.refresh();
    } else {
      alert('Đã có lỗi xảy ra khi lưu vị trí tuyển dụng');
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{isNew ? 'Thêm Vị Trí Tuyển Dụng' : 'Sửa Vị Trí Tuyển Dụng'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Thông tin chung</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức làm việc (Type)</label>
              <input type="text" value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} placeholder="Full-time / Part-time" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm làm việc (Location)</label>
              <input type="text" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="Chi nhánh Quận 10" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary outline-none" required />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-blue-600">Nội dung Tiếng Việt</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên vị trí</label>
            <input type="text" value={formData.vi.title} onChange={e => handleChange('vi', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea value={formData.vi.excerpt} onChange={e => handleChange('vi', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiết công việc & Yêu cầu</label>
            <RichTextEditor value={formData.vi.content} onChange={val => handleChange('vi', 'content', val)} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-green-600">Nội dung Tiếng Anh (English)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input type="text" value={formData.en.title} onChange={e => handleChange('en', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea value={formData.en.excerpt} onChange={e => handleChange('en', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Details & Requirements</label>
            <RichTextEditor value={formData.en.content} onChange={val => handleChange('en', 'content', val)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50">Hủy</button>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu vị trí'}
          </button>
        </div>
      </form>
    </div>
  );
}
