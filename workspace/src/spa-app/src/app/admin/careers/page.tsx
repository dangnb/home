'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Briefcase, MapPin } from 'lucide-react';

export default function AdminCareers() {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    const res = await fetch('/api/careers');
    const data = await res.json();
    if (data.success) {
      setCareers(data.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa vị trí tuyển dụng này?')) {
      const res = await fetch(`/api/careers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCareers(careers.filter(p => p.id !== id));
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Tuyển dụng (Careers)</h1>
        <Link href="/admin/careers/new" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Thêm vị trí tuyển dụng
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Vị trí (VI)</th>
              <th className="px-6 py-4 font-medium">Hình thức & Địa điểm</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((job) => (
              <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <span className="line-clamp-1">{job.vi?.title || 'Không có tiêu đề'}</span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> {job.type || 'Full-time'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {job.location || 'TP.HCM'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/careers/${job.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {careers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Chưa có vị trí tuyển dụng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
