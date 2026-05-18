"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));

export default function AdminAbout() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        if (data.config?.about_content) {
          setContent(data.config.about_content);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    }
    fetchContent();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          configs: [
            { key: "about_content", value: content, description: "Nội dung trang giới thiệu" },
          ],
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Lỗi lưu nội dung");
      }
    } catch {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý trang Giới thiệu</h1>
            <p className="text-sm text-gray-500 mt-1">Nội dung hiển thị ở section &quot;Giới thiệu&quot; trên trang chủ</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Đang lưu..." : "Lưu nội dung"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ Đã lưu nội dung giới thiệu thành công!
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Suspense
          fallback={
            <div className="h-[500px] border border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              Đang tải editor...
            </div>
          }
        >
          <RichTextEditor content={content} onChange={setContent} />
        </Suspense>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>Hướng dẫn:</strong> Viết nội dung giới thiệu về dịch vụ xe ghép. Có thể chèn ảnh, format chữ, 
        tạo danh sách... Nội dung này sẽ hiển thị trên trang chủ ở phần &quot;Giới Thiệu Về Xe Ghép Nam Định&quot;.
      </div>
    </div>
  );
}
