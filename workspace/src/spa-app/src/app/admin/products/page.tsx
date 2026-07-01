'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      setPosts(data.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức (Posts)</h1>
        <Link href="/admin/posts/new" className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90">
          <Plus className="w-5 h-5" /> Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Tiêu đề (VI)</th>
              <th className="px-6 py-4 font-medium">Ngày đăng</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-4">
                    <img src={post.image || '/placeholder.png'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="line-clamp-1">{post.vi?.title || 'Không có tiêu đề'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(post.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Chưa có bài viết nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
