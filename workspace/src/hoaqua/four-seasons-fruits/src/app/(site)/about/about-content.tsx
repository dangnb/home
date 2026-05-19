"use client";

// About page content with scroll-triggered animations

import Image from "next/image";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
}

export function AboutContent({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-20">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-xl"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-5"
          >
            {post.title}
          </motion.h2>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-emerald-400 pl-5 italic bg-emerald-50/50 py-3 pr-4 rounded-r-xl"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="product-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent origin-left"
          />
        </motion.article>
      ))}
    </div>
  );
}
