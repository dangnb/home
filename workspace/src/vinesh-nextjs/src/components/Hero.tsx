"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Hero.css";

interface SlideTranslation {
  title?: string;
  subtitle?: string;
  desc?: string;
}

interface DbSlide {
  id?: string;
  imageUrl: string;
  translations?: string | null;
  linkUrl?: string | null;
}

interface HeroProps {
  settings?: Record<string, string>;
  slides?: DbSlide[];
  lang: string;
}

export default function Hero({ settings, slides: dbSlides, lang }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const isVi = lang === "vi";
  const fallback = (viText: string, enText: string) => isVi ? viText : enText;
  const exploreText = fallback("Khám phá dịch vụ", "Explore Services");
  const contactText = fallback("Liên hệ tư vấn", "Contact Us");

  // Settings for main slide
  const title = isVi
    ? (settings?.heroTitle || "An Toàn - Sức Khỏe - Môi Trường")
    : (settings?.[`heroTitle_${lang}`] || "Safety - Health - Environment");

  const subtitle = isVi
    ? (settings?.heroSubtitle || "Giải pháp tổng thể & toàn diện")
    : (settings?.[`heroSubtitle_${lang}`] || "Comprehensive Enterprise Solutions");

  const desc = isVi
    ? (settings?.heroDesc || "Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.")
    : (settings?.[`heroDesc_${lang}`] || "Partnering with enterprises for sustainable growth through leading inspection, certification, and safety training services.");

  const bgImage1 = settings?.heroImage1 || settings?.heroImage || "/assets/hero.png";

  // Read Slides smoothly with proper locale fallback
  const t = (key: string, viDefault: string, enDefault: string) => {
    if (isVi) {
      return settings?.[key] || viDefault;
    }
    return settings?.[`${key}_${lang}`] || enDefault;
  };

  // Default fallback slides with rich content
  const defaultSlides = [
    {
      bgImage: bgImage1,
      subtitle: subtitle,
      title: title,
      desc: desc,
      linkUrl: `/${lang}#services`
    },
    {
      bgImage: settings?.heroImage2 || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
      subtitle: t("heroSubtitle2", "Tiêu chuẩn kiểm định cao cấp", "Certified Top Standards"),
      title: t("heroTitle2", "Kiểm Định Máy Móc & Thiết Bị Tự Động", "Automated Machinery Inspection"),
      desc: t("heroDesc2", "Hệ thống trang thiết bị hiện đại, đảm bảo quy trình kiểm định chính xác, khách quan và tin cậy tuyệt đối.", "Modern machinery and equipment, ensuring the most accurate, objective, and reliable results."),
      linkUrl: `/${lang}#services`
    },
    {
      bgImage: settings?.heroImage3 || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop",
      subtitle: t("heroSubtitle3", "Kinh nghiệm & Uy tín 10+ năm", "10+ Years of Excellence"),
      title: t("heroTitle3", "Đội Ngũ Chuyên Gia Tận Tâm & Giàu Kinh Nghiệm", "Dedicated & Experienced Experts"),
      desc: t("heroDesc3", "Đồng hành mang lại sự an tâm, an toàn và giải pháp tối ưu cho hàng trăm đối tác doanh nghiệp.", "Bringing absolute peace of mind, high safety standards, and optimal solutions to hundreds of corporate partners."),
      linkUrl: `/${lang}#services`
    }
  ];

  // Transform dynamic DB Slides or fallback to settings-based slides
  const parsedDbSlides = dbSlides && dbSlides.length > 0 ? dbSlides.map(slide => {
    let trans: Record<string, SlideTranslation> = {};
    try { trans = JSON.parse(slide.translations || "{}"); } catch (_e) { }

    const sTitle = trans[lang]?.title || (isVi ? trans['vi']?.title : (trans['en']?.title || trans['vi']?.title)) || title;
    const sSubtitle = trans[lang]?.subtitle || (isVi ? trans['vi']?.subtitle : (trans['en']?.subtitle || trans['vi']?.subtitle)) || subtitle;
    const sDesc = trans[lang]?.desc || (isVi ? trans['vi']?.desc : (trans['en']?.desc || trans['vi']?.desc)) || desc;
    const sImage = (slide.imageUrl && slide.imageUrl.trim() !== '') ? slide.imageUrl : bgImage1;

    return {
      bgImage: sImage,
      title: sTitle,
      subtitle: sSubtitle,
      desc: sDesc,
      linkUrl: slide.linkUrl && slide.linkUrl !== "#" ? slide.linkUrl : `/${lang}#services`
    };
  }) : [];

  const slides = parsedDbSlides.length > 0 ? parsedDbSlides : defaultSlides;

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
          <div className="hero-bg-div">
            <Image
              src={slide.bgImage}
              alt="Hero background"
              fill
              priority={index === 0}
              style={{ objectFit: "cover" }}
              sizes="100vw"
            />
          </div>
          <div className="container hero-slider-content">
            {slide.subtitle && (
              <div className="hero-slider-badge">
                <i className="ph-fill ph-sparkle"></i>
                <span>{slide.subtitle}</span>
              </div>
            )}
            <h1 className="hero-slider-title">{slide.title}</h1>
            <p className="hero-slider-desc">{slide.desc}</p>
            <div className="hero-slider-buttons">
              <Link href={slide.linkUrl || `/${lang}#services`} className="btn btn-primary">
                {exploreText} <i className="ph ph-arrow-right"></i>
              </Link>
              <Link href={`/${lang}/lien-he`} className="btn btn-outline">
                <i className="ph ph-chat-teardrop-dots"></i> {contactText}
              </Link>
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
