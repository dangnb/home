// About Page - Displays published "about" type posts with animations

import { db } from "@/lib/db";
import { Leaf } from "lucide-react";
import Image from "next/image";
import { AboutContent } from "./about-content";

export default async function AboutPage() {
  const posts = await db.post.findMany({
    where: { published: true, type: "about" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100 shadow-sm mb-6">
            <Leaf className="h-4 w-4" />
            Về chúng tôi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Giới thiệu{" "}
            <span className="text-emerald-600">Four Seasons Fruits</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Câu chuyện về hành trình mang trái cây tươi ngon đến mọi gia đình Việt Nam
          </p>
        </div>
      </section>

      {/* Posts Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <Leaf className="h-16 w-16 mx-auto text-emerald-200 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">
                Nội dung đang được cập nhật
              </h2>
              <p className="text-gray-500 mt-2">
                Chúng tôi sẽ sớm chia sẻ câu chuyện của mình tại đây.
              </p>
            </div>
          ) : (
            <AboutContent posts={posts.map(p => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt,
              content: p.content,
              coverImage: p.coverImage,
            }))} />
          )}
        </div>
      </section>
    </div>
  );
}
