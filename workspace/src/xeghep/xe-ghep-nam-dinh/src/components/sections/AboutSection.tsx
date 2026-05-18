"use client";

import { useEffect, useState } from "react";
import FadeIn from "../animations/FadeIn";

export default function AboutSection() {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        if (data.config?.about_content) {
          setContent(data.config.about_content);
        }
      } catch {
        // fallback to empty
      }
    }
    fetchAbout();
  }, []);

  // If no content from DB, show nothing (admin needs to set it up)
  if (!content) {
    return (
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Giới Thiệu Về{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Xe Ghép Nam Định
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-center text-gray-400">
              Nội dung giới thiệu chưa được cập nhật. Vui lòng vào Admin → Cấu hình để chỉnh sửa.
            </p>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Giới Thiệu Về{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Xe Ghép Nam Định
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-li:text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </FadeIn>
      </div>
    </section>
  );
}
