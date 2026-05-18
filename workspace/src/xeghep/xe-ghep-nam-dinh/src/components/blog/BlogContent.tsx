"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Add animation to all images in the blog content
    const images = containerRef.current.querySelectorAll("img");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLElement;
            img.style.opacity = "1";
            img.style.transform = "translateY(0) scale(1)";
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.2 }
    );

    images.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "translateY(20px) scale(0.95)";
      img.style.transition = "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease";
      observer.observe(img);
    });

    // Add animation to headings
    const headings = containerRef.current.querySelectorAll("h1, h2, h3, h4");
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateX(0)";
            headingObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    headings.forEach((heading) => {
      const el = heading as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateX(-20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      headingObserver.observe(el);
    });

    return () => {
      observer.disconnect();
      headingObserver.disconnect();
    };
  }, [content]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
