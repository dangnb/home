'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

export default function TrainingEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    image: '/spa_service.png',
    duration: '1 Tháng',
    price: '5.000.000 VNĐ',
    vi: {
      title: '',
      level: 'Cơ bản',
      excerpt: '',
      content: '',
      benefits: [''],
      curriculum: [{ title: 'Phần 1', desc: '' }]
    },
    en: {
      title: '',
      level: 'Beginner',
      excerpt: '',
      content: '',
      benefits: [''],
      curriculum: [{ title: 'Part 1', desc: '' }]
    }
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/training/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const d = data.data;
            setFormData({
              id: d.id || '',
              slug: d.slug || '',
              image: d.image || '/spa_service.png',
              duration: d.duration || '1 Tháng',
              price: d.price || '',
              vi: {
                title: d.vi?.title || '',
                level: d.vi?.level || 'Cơ bản',
                excerpt: d.vi?.excerpt || '',
                content: d.vi?.content || '',
                benefits: Array.isArray(d.vi?.benefits) && d.vi.benefits.length ? d.vi.benefits : [''],
                curriculum: Array.isArray(d.vi?.curriculum) && d.vi.curriculum.length ? d.vi.curriculum : [{ title: 'Phần 1', desc: '' }]
              },
              en: {
                title: d.en?.title || '',
                level: d.en?.level || 'Beginner',
                excerpt: d.en?.excerpt || '',
                content: d.en?.content || '',
                benefits: Array.isArray(d.en?.benefits) && d.en.benefits.length ? d.en.benefits : [''],
                curriculum: Array.isArray(d.en?.curriculum) && d.en.curriculum.length ? d.en.curriculum : [{ title: 'Part 1', desc: '' }]
              }
            });
          }
          setLoading(false);
        });
    }
  }, [isNew, resolvedParams.id]);

  const handleLangChange = (lang: 'vi' | 'en', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const handleCurriculumChange = (lang: 'vi' | 'en', idx: number, field: 'title' | 'desc', value: string) => {
    const updated = [...formData[lang].curriculum];
    updated[idx] = { ...updated[idx], [field]: value };
    handleLangChange(lang, 'curriculum', updated);
  };

  const addCurriculumItem = (lang: 'vi' | 'en') => {
    const nextIdx = formData[lang].curriculum.length + 1;
    const prefix = lang === 'vi' ? `Phần ${nextIdx}` : `Part ${nextIdx}`;
    handleLangChange(lang, 'curriculum', [...formData[lang].curriculum, { title: prefix, desc: '' }]);
  };

  const removeCurriculumItem = (lang: 'vi' | 'en', idx: number) => {
    handleLangChange(lang, 'curriculum', formData[lang].curriculum.filter((_, i) => i !== idx));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const finalData = {
      ...formData,
      vi: {
        ...formData.vi,
        benefits: formData.vi.benefits.map(b => b.trim()).filter(Boolean)
      },
      en: {
        ...formData.en,
        benefits: formData.en.benefits.map(b => b.trim()).filter(Boolean)
      }
    };

    if (isNew) {
      const generatedSlug = finalData.vi.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || Date.now().toString();
      finalData.slug = generatedSlug;
      finalData.id = generatedSlug;
    }

    const url = isNew ? '/api/training' : `/api/training/${resolvedParams.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    });

    if (res.ok) {
      router.push('/admin/training');
      router.refresh();
    } else {
      alert('Đã có lỗi xảy ra khi lưu khóa đào tạo');
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{isNew ? 'Thêm Khóa Học Mới' : 'Sửa Khóa Học Đào Tạo'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Thông tin chung</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh khóa học</label>
            <div className="flex items-center gap-4">
              {formData.image && <img src={formData.image} alt="" className="w-32 h-32 object-cover rounded-xl" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian khóa học (VD: 1 Tháng)</label>
              <input type="text" value={formData.duration} onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Học phí (VD: 5.000.000 VNĐ)</label>
              <input type="text" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
          </div>
        </div>

        {/* Vietnamese Content */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-blue-600">Nội dung Tiếng Việt</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên khóa học</label>
              <input type="text" value={formData.vi.title} onChange={e => handleLangChange('vi', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ (VD: Cơ bản / Nâng cao)</label>
              <input type="text" value={formData.vi.level} onChange={e => handleLangChange('vi', 'level', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea value={formData.vi.excerpt} onChange={e => handleLangChange('vi', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quyền lợi học viên (mỗi dòng 1 mục)</label>
            <textarea
              value={formData.vi.benefits.join('\n')}
              onChange={e => handleLangChange('vi', 'benefits', e.target.value.split('\n'))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-28"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Chương trình học (Curriculum)</label>
              <button type="button" onClick={() => addCurriculumItem('vi')} className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Thêm học phần
              </button>
            </div>
            {formData.vi.curriculum.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => handleCurriculumChange('vi', idx, 'title', e.target.value)}
                    placeholder="Tiêu đề học phần (VD: Tuần 1: Lý thuyết cơ bản)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold outline-none bg-white"
                  />
                  <textarea
                    value={item.desc}
                    onChange={e => handleCurriculumChange('vi', idx, 'desc', e.target.value)}
                    placeholder="Nội dung chi tiết..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none bg-white h-16"
                  />
                </div>
                {formData.vi.curriculum.length > 1 && (
                  <button type="button" onClick={() => removeCurriculumItem('vi', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* English Content */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-green-600">Nội dung Tiếng Anh (English)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
              <input type="text" value={formData.en.title} onChange={e => handleLangChange('en', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level (e.g., Beginner / Advanced)</label>
              <input type="text" value={formData.en.level} onChange={e => handleLangChange('en', 'level', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea value={formData.en.excerpt} onChange={e => handleLangChange('en', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (1 per line)</label>
            <textarea
              value={formData.en.benefits.join('\n')}
              onChange={e => handleLangChange('en', 'benefits', e.target.value.split('\n'))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-28"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Curriculum</label>
              <button type="button" onClick={() => addCurriculumItem('en')} className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>
            {formData.en.curriculum.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => handleCurriculumChange('en', idx, 'title', e.target.value)}
                    placeholder="Module title"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold outline-none bg-white"
                  />
                  <textarea
                    value={item.desc}
                    onChange={e => handleCurriculumChange('en', idx, 'desc', e.target.value)}
                    placeholder="Module description..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none bg-white h-16"
                  />
                </div>
                {formData.en.curriculum.length > 1 && (
                  <button type="button" onClick={() => removeCurriculumItem('en', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50">Hủy</button>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu khóa học'}
          </button>
        </div>
      </form>
    </div>
  );
}
