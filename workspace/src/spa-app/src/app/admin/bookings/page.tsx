'use client';

import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, Phone, User } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    if (data.success) {
      setBookings(data.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(bookings.filter(b => b.id !== id));
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn Khách hàng (Bookings)</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Khách hàng</th>
              <th className="px-6 py-4 font-medium">Dịch vụ đăng ký</th>
              <th className="px-6 py-4 font-medium">Thời gian gửi</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> {item.name}
                  </div>
                  <div className="text-sm text-primary font-medium flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5" /> {item.phone}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.service}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : ''}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={item.status || 'pending'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold outline-none border ${
                      item.status === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : item.status === 'confirmed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Chưa có lịch hẹn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
