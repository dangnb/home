"use client";

import { useState, useEffect, lazy, Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    thumbnail: "",
    published: false,
    metaTitle: "",
    metaDesc: "",
    ogImage: "",
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.post) {
          setForm({
            title: data.post.title || "",
            content: data.post.content || "",
            excerpt: data.post.excerpt || "",
            thumbnail: data.post.thumbnail || "",
            published: data.post.published || false,
            metaTitle: data.post.metaTitle || "",
            metaDesc: data.post.metaDesc || "",
            ogImage: data.post.ogImage || "",
          });
        }
      } catch (error) {
        console.error("Fetch post error:", error);
      } finally {
        setFetching(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        alert(data.error || "Lỗi cập nhật bài viết");
      }
    } catch {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Đang tải bài viết...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                placeholder="Nhập tiêu đề bài viết..."
                required
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="Mô tả ngắn gọn về bài viết..."
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết *
              </label>
              <Suspense
                fallback={
                  <div className="h-[400px] border border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                    Đang tải editor...
                  </div>
                }
              >
                <RichTextEditor
                  content={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Xuất bản</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Xuất bản ngay</span>
              </label>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Ảnh đại diện</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="URL ảnh đại diện..."
                />
                <button
                  type="button"
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const token = localStorage.getItem("admin_token");
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.url) setForm((prev) => ({ ...prev, thumbnail: data.url }));
                          else alert(data.error || "Lỗi upload");
                        } catch { alert("Lỗi upload ảnh"); }
                      }
                    };
                    input.click();
                  }}
                  className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  📷 Upload ảnh từ máy
                </button>
              </div>
              {form.thumbnail && (
                <div className="mt-3 rounded-lg overflow-hidden border">
                  <img src={form.thumbnail} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-xs font-medium text-gray-500 mb-1">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Meta title cho SEO..."
                  />
                </div>
                <div>
                  <label htmlFor="metaDesc" className="block text-xs font-medium text-gray-500 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDesc"
                    value={form.metaDesc}
                    onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Meta description cho SEO..."
                  />
                </div>
                <div>
                  <label htmlFor="ogImage" className="block text-xs font-medium text-gray-500 mb-1">
                    OG Image URL
                  </label>
                  <input
                    id="ogImage"
                    type="text"
                    value={form.ogImage}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="URL ảnh OG cho Facebook/TikTok..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/posts"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Đang lưu..." : "Cập nhật bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
}
