"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
}

export default function BlogSidebar({ posts }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Tìm kiếm</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tìm kiếm..."
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Recent Posts</h3>
        <ul className="space-y-3">
          {posts.slice(0, 6).map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors leading-snug block"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-6 text-center">
        <h3 className="font-bold text-white text-lg mb-2">Đặt xe ngay</h3>
        <p className="text-blue-200 text-sm mb-4">Xe ghép Nam Định - Hà Nội</p>
        <a
          href="tel:0379803990"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-sm hover:shadow-lg transition-shadow"
        >
          📞 0379.803.990
        </a>
      </div>
    </div>
  );
}
