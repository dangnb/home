'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function PostEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  const router = useRouter();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    image: '',
    date: new Date().toISOString().slice(0, 10),
    vi: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' }
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/careers/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFormData({
              ...data.data,
              date: data.data.date ? data.data.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
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
    
    // Auto generate slug and ID if new
    const finalData = { ...formData };
    if (isNew) {
      finalData.slug = finalData.vi.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      finalData.id = Date.now().toString();
    }
    
    // Ensure date is ISO
    finalData.date = new Date(finalData.date).toISOString();

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
      alert('Đã có lỗi xảy ra');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      setFormData(prev => ({ ...prev, image: data.url }));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{isNew ? 'Thêm Bài Viết Mới' : 'Sửa Bài Viết'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Thông tin chung</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện (Cover Image)</label>
            <div className="flex items-center gap-4">
              {formData.image && <img src={formData.image} alt="" className="w-32 h-32 object-cover rounded-xl" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đăng</label>
            <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary outline-none" required />
          </div>
        </div>

        {/* Tab-like approach or just stacked languages. Let's stack them. */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-blue-600">Nội dung Tiếng Việt</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
            <input type="text" value={formData.vi.title} onChange={e => handleChange('vi', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn (Excerpt)</label>
            <textarea value={formData.vi.excerpt} onChange={e => handleChange('vi', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung bài viết</label>
            <RichTextEditor value={formData.vi.content} onChange={val => handleChange('vi', 'content', val)} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-green-600">Nội dung Tiếng Anh (English)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.en.title} onChange={e => handleChange('en', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea value={formData.en.excerpt} onChange={e => handleChange('en', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <RichTextEditor value={formData.en.content} onChange={val => handleChange('en', 'content', val)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50">Hủy</button>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
