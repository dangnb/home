'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Award } from 'lucide-react';

export default function AdminTraining() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch('/api/training');
    const data = await res.json();
    if (data.success) {
      setCourses(data.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa đào tạo này?')) {
      const res = await fetch(`/api/training/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Khóa học Đào tạo (Training)</h1>
        <Link href="/admin/training/new" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Thêm khóa học
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Tên khóa học (VI)</th>
              <th className="px-6 py-4 font-medium">Cấp độ</th>
              <th className="px-6 py-4 font-medium">Thời gian & Học phí</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-4">
                    <img src={course.image || '/spa_service.png'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <span className="line-clamp-1 font-semibold">{course.vi?.title || 'Không có tên'}</span>
                      <span className="text-xs text-gray-400">Slug: {course.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    <Award className="w-3.5 h-3.5" /> {course.vi?.level || 'Cơ bản'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-primary">{course.price}</div>
                  <div className="text-gray-500">{course.duration}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/training/${course.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Chưa có khóa đào tạo nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
