"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  createdAt: Date;
  author: { name: string };
  category: { name: string } | null;
}

export default function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group"
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
              {/* Thumbnail */}
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3">
                  {post.category && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="mt-2 text-gray-500 text-sm line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                )}

                {/* Read more */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-400">{post.author.name}</span>
                  <span className="text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Đọc thêm →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
