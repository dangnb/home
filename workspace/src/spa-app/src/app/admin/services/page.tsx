'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Star } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    if (data.success) {
      setServices(data.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ (Services)</h1>
        <Link href="/admin/services/new" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Thêm dịch vụ
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Tên dịch vụ (VI)</th>
              <th className="px-6 py-4 font-medium">Thời gian & Mức giá</th>
              <th className="px-6 py-4 font-medium">Nổi bật</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-4">
                    <img src={service.image || '/spa_service.png'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <span className="line-clamp-1 font-semibold">{service.vi?.title || 'Không có tên'}</span>
                      <span className="text-xs text-gray-400">Slug: {service.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-primary">{service.price}</div>
                  <div className="text-gray-500">{service.duration}</div>
                </td>
                <td className="px-6 py-4">
                  {service.featured ? (
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Trang chủ
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Thường</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/services/${service.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Chưa có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
