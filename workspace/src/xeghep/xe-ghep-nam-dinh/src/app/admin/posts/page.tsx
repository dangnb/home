"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: { name: string };
  category: { name: string } | null;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts?limit=50");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    const token = localStorage.getItem("admin_token");
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  }

  async function togglePublish(id: string, published: boolean) {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ published: !published }),
    });
    fetchPosts();
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tiêu đề</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Tác giả</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Trạng thái</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden lg:table-cell">Ngày tạo</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{post.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {post.author.name}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {post.published ? "Đã xuất bản" : "Nháp"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title={post.published ? "Ẩn bài" : "Xuất bản"}
                    >
                      {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
}
