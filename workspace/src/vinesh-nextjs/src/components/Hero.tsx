"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./Hero.css";

interface HeroProps {
  settings?: Record<string, string>;
  lang: string;
}

export default function Hero({ settings, lang }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Settings for main slide
  const title = settings?.[`heroTitle_${lang}`] || settings?.heroTitle || "AN TOÀN - SỨC KHỎE - MÔI TRƯỜNG";
  const subtitle = settings?.[`heroSubtitle_${lang}`] || settings?.heroSubtitle || "Giải pháp tổng thể";
  const desc = settings?.[`heroDesc_${lang}`] || settings?.heroDesc || "Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.";
  const bgImage1 = settings?.heroImage || "/assets/hero.png";

  const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;
  const exploreText = fallback("Khám phá dịch vụ", "Explore Services");
  const contactText = fallback("Liên hệ tư vấn", "Contact Us");

  // Defined slider content
  const slides = [
    {
      bgImage: bgImage1,
      subtitle: subtitle,
      title: title,
      desc: desc
    },
    {
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
      subtitle: fallback("Chất lượng hàng đầu", "Top Quality Solutions"),
      title: fallback("KIỂM ĐỊNH MÁY MÓC TỰ ĐỘNG", "STANDARD MACHINE INSPECTION"),
      desc: fallback("Hệ thống máy móc hiện đại, đảm bảo kết quả an toàn chính xác và tin cậy tuyệt đối.", "Modern machinery system, ensuring the most accurate and reliable results.")
    },
    {
      bgImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop",
      subtitle: fallback("Kinh nghiệm & Uy tín", "Experience & Prestige"),
      title: fallback("ĐỘI NGŨ CHUYÊN GIA TẬN TÂM", "DEDICATED EXPERT TEAM"),
      desc: fallback("Hàng ngàn giờ nỗ lực mang lại sự an tâm tuyệt đối cho khách hàng và đối tác.", "Thousands of effort hours bringing absolute peace of mind to customers.")
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000); // Wait 6 seconds before changing slide
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-slider-section">
      {slides.map((slide, index) => (
        <div key={index} className={`hero-slide ${index === currentSlide ? "active" : ""}`}>
          <div className="hero-slider-overlay"></div>
          <div className="hero-bg-div" style={{ backgroundImage: `url('${slide.bgImage}')` }}></div>
          <div className="container hero-slider-content">
            <h2 className="hero-slider-subtitle">{slide.subtitle}</h2>
            <h1 className="hero-slider-title">{slide.title}</h1>
            <p className="hero-slider-desc">{slide.desc}</p>
            <div className="hero-slider-buttons">
              <Link href={`/${lang}#services`} className="btn btn-primary">{exploreText}</Link>
              <Link href="#" className="btn btn-outline">{contactText}</Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="slider-controls">
        <button className="slider-arrow" onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}>
          <i className="ph ph-caret-left"></i>
        </button>
        <button className="slider-arrow" onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}>
          <i className="ph ph-caret-right"></i>
        </button>
      </div>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <span key={i} className={`slider-dot ${i === currentSlide ? "active" : ""}`} onClick={() => setCurrentSlide(i)}></span>
        ))}
      </div>
    </section>
  );
}
