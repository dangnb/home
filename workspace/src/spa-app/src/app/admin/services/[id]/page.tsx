'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { value: 'body-care', label: 'Tẩy Da Chết Và Dưỡng Thể Body' },
  { value: 'facial-care', label: 'Chăm Sóc Da Mặt' },
  { value: 'herbal-hair-wash', label: 'Gội Đầu Bằng Thảo Dược' },
  { value: 'eye-care', label: 'Chăm Sóc Mắt' },
  { value: 'rf-weight-loss', label: 'Giảm Béo Bằng Công Nghệ RF' },
  { value: 'traditional-medicine-skin-care', label: 'Chăm Sóc Da Đông Y' },
  { value: 'acne-treatment', label: 'Điều Trị Mụn' },
  { value: 'melasma-treatment', label: 'Điều Trị Nám' },
  { value: 'safe-skin-whitening', label: 'Tắm Trắng An Toàn' },
  { value: 'full-body-massage', label: 'Chăm Sóc Da Toàn Thân & Massage Body' },
  { value: 'permanent-hair-removal', label: 'Triệt Lông Vĩnh Viễn' },
  { value: 'cosmetic-tattooing', label: 'Phun Xăm Thẩm Mỹ' },
  { value: 'acne-treatment-process', label: 'Quy Trình Điều Trị Mụn' },
  { value: 'waxing', label: 'Waxing Tẩy Lông' },
];

export default function ServiceEdit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    image: '/spa_service.png',
    duration: '60 Phút',
    price: '500.000 VNĐ',
    featured: false,
    category: 'facial-care',
    vi: {
      title: '',
      excerpt: '',
      content: '',
      benefits: [''],
      steps: [{ title: 'Bước 1', desc: '' }]
    },
    en: {
      title: '',
      excerpt: '',
      content: '',
      benefits: [''],
      steps: [{ title: 'Step 1', desc: '' }]
    }
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/services/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const d = data.data;
            setFormData({
              id: d.id || '',
              slug: d.slug || '',
              image: d.image || '/spa_service.png',
              duration: d.duration || '60 Phút',
              price: d.price || '',
              featured: Boolean(d.featured),
              category: d.category || 'facial-care',
              vi: {
                title: d.vi?.title || '',
                excerpt: d.vi?.excerpt || '',
                content: d.vi?.content || '',
                benefits: Array.isArray(d.vi?.benefits) && d.vi.benefits.length ? d.vi.benefits : [''],
                steps: Array.isArray(d.vi?.steps) && d.vi.steps.length ? d.vi.steps : [{ title: 'Bước 1', desc: '' }]
              },
              en: {
                title: d.en?.title || '',
                excerpt: d.en?.excerpt || '',
                content: d.en?.content || '',
                benefits: Array.isArray(d.en?.benefits) && d.en.benefits.length ? d.en.benefits : [''],
                steps: Array.isArray(d.en?.steps) && d.en.steps.length ? d.en.steps : [{ title: 'Step 1', desc: '' }]
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

  const handleStepChange = (lang: 'vi' | 'en', idx: number, field: 'title' | 'desc', value: string) => {
    const updated = [...formData[lang].steps];
    updated[idx] = { ...updated[idx], [field]: value };
    handleLangChange(lang, 'steps', updated);
  };

  const addStep = (lang: 'vi' | 'en') => {
    const nextIdx = formData[lang].steps.length + 1;
    const prefix = lang === 'vi' ? `Bước ${nextIdx}` : `Step ${nextIdx}`;
    handleLangChange(lang, 'steps', [...formData[lang].steps, { title: prefix, desc: '' }]);
  };

  const removeStep = (lang: 'vi' | 'en', idx: number) => {
    handleLangChange(lang, 'steps', formData[lang].steps.filter((_, i) => i !== idx));
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

    const url = isNew ? '/api/services' : `/api/services/${resolvedParams.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    });

    if (res.ok) {
      router.push('/admin/services');
      router.refresh();
    } else {
      alert('Đã có lỗi xảy ra khi lưu dịch vụ');
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{isNew ? 'Thêm Dịch Vụ Mới' : 'Sửa Dịch Vụ'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">Thông tin chung</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện dịch vụ</label>
            <div className="flex items-center gap-4">
              {formData.image && <img src={formData.image} alt="" className="w-32 h-32 object-cover rounded-xl" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng (VD: 60 Phút)</label>
              <input type="text" value={formData.duration} onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mức giá (VD: Từ 500.000 VNĐ)</label>
              <input type="text" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục dịch vụ</label>
              <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none bg-white">
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="w-5 h-5 accent-primary rounded" />
            <span className="text-sm font-medium text-gray-700">Hiển thị tại mục &ldquo;Dịch Vụ Nổi Bật&rdquo; trên Trang chủ</span>
          </label>
        </div>

        {/* Vietnamese Content */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-blue-600">Nội dung Tiếng Việt</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ</label>
            <input type="text" value={formData.vi.title} onChange={e => handleLangChange('vi', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea value={formData.vi.excerpt} onChange={e => handleLangChange('vi', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lợi ích mang lại (mỗi dòng 1 lợi ích)</label>
            <textarea
              value={formData.vi.benefits.join('\n')}
              onChange={e => handleLangChange('vi', 'benefits', e.target.value.split('\n'))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-28"
              placeholder="Làm sạch sâu lỗ chân lông&#10;Cấp ẩm và nuôi dưỡng làn da"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Quy trình thực hiện (Các bước)</label>
              <button type="button" onClick={() => addStep('vi')} className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Thêm bước
              </button>
            </div>
            {formData.vi.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => handleStepChange('vi', idx, 'title', e.target.value)}
                    placeholder="Tiêu đề bước (VD: Bước 1: Làm sạch)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold outline-none bg-white"
                  />
                  <textarea
                    value={step.desc}
                    onChange={e => handleStepChange('vi', idx, 'desc', e.target.value)}
                    placeholder="Mô tả chi tiết bước này..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none bg-white h-16"
                  />
                </div>
                {formData.vi.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep('vi', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
            <input type="text" value={formData.en.title} onChange={e => handleLangChange('en', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea value={formData.en.excerpt} onChange={e => handleLangChange('en', 'excerpt', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-24" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Benefits (1 per line)</label>
            <textarea
              value={formData.en.benefits.join('\n')}
              onChange={e => handleLangChange('en', 'benefits', e.target.value.split('\n'))}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none h-28"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Procedure Steps</label>
              <button type="button" onClick={() => addStep('en')} className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Add Step
              </button>
            </div>
            {formData.en.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={e => handleStepChange('en', idx, 'title', e.target.value)}
                    placeholder="Step title (e.g., Step 1: Cleansing)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold outline-none bg-white"
                  />
                  <textarea
                    value={step.desc}
                    onChange={e => handleStepChange('en', idx, 'desc', e.target.value)}
                    placeholder="Step description..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none bg-white h-16"
                  />
                </div>
                {formData.en.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep('en', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
            {saving ? 'Đang lưu...' : 'Lưu dịch vụ'}
          </button>
        </div>
      </form>
    </div>
  );
}
