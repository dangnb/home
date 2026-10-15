"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "./Header.css";

interface CategoryService {
  id: string;
  title: string;
  translations?: string | null;
  linkUrl?: string | null;
}

interface CategoryItem {
  id: string;
  slug: string;
  translations?: string | null;
  children?: CategoryItem[];
  services?: CategoryService[];
}

interface HeaderProps {
  settings?: Record<string, string>;
  lang: string;
  languages?: { code: string; name: string }[];
  menuCategories?: CategoryItem[];
}

export default function Header({ settings, lang, languages = [], menuCategories = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const langBoxRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langBoxRef.current && !langBoxRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  const phone = settings?.phone || "0984 929 693";
  const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;

  // Luôn đảm bảo tối thiểu có cả 2 ngôn ngữ chuẩn vi và en
  const availableLangs = languages && languages.length > 0 ? languages : [
    { code: "vi", name: "Tiếng Việt" },
    { code: "en", name: "English" }
  ];

  const getLanguageName = (code: string) => {
    if (code === "vi") return "VIETNAMESE";
    if (code === "en") return "ENGLISH";
    const found = availableLangs.find(l => l.code === code);
    return found ? found.name.toUpperCase() : code.toUpperCase();
  };

  const changeLanguage = (nextLang: string) => {
    if (nextLang === lang) {
      setLangOpen(false);
      return;
    }

    let newPath = pathname || `/${nextLang}`;
    const currentPrefix = `/${lang}`;
    if (newPath === currentPrefix || newPath === `${currentPrefix}/`) {
      newPath = `/${nextLang}`;
    } else if (newPath.startsWith(`${currentPrefix}/`)) {
      newPath = `/${nextLang}/${newPath.slice(currentPrefix.length + 1)}`;
    } else if (newPath === "/") {
      newPath = `/${nextLang}`;
    } else {
      newPath = `/${nextLang}${newPath.startsWith('/') ? newPath : '/' + newPath}`;
    }

    setLangOpen(false);
    setMobileMenuOpen(false);
    // Chuyển trang ngôn ngữ sạch sẽ để cập nhật toàn bộ RSC & trạng thái trang
    window.location.href = newPath;
  };

  return (
    <>
      <div className={`site-header-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          {/* Top Navbar Row (Desktop Only) */}
          <div className="top-nav">
            <Link href="/login" className="top-auth-link">
              <i className="ph-fill ph-user" style={{ fontSize: "16px" }}></i> {fallback("Đăng nhập", "Login")}
            </Link>

            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="top-phone-badge">
              <i className="ph-fill ph-phone" style={{ fontSize: "16px" }}></i> {phone}
            </a>

            <div className="top-social-group">
              <a
                href={settings?.facebook || "https://facebook.com/webcare.vn"}
                target="_blank"
                rel="noopener noreferrer"
                className="top-social-icon top-fb"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={settings?.zalo ? (settings.zalo.startsWith("http") ? settings.zalo : `https://zalo.me/${settings.zalo.replace(/\s+/g, '')}`) : `https://zalo.me/${phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="top-social-icon top-zalo"
                title="Zalo"
                aria-label="Zalo"
              >
                <span>Zalo</span>
              </a>
            </div>

            {availableLangs.length > 0 && (
              <div
                ref={langBoxRef}
                className="lang-selector-box"
                onClick={() => setLangOpen(!langOpen)}
                role="button"
                tabIndex={0}
                aria-expanded={langOpen}
                aria-haspopup="true"
              >
                <div className={lang === "vi" ? "flag-icon" : "flag-icon-en"}></div>
                <span>{getLanguageName(lang)}</span>
                <i className={`ph ph-caret-${langOpen ? "up" : "down"}`} style={{ fontSize: "12px", marginLeft: "4px" }}></i>

                {langOpen && (
                  <ul className="lang-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {availableLangs.map((l) => (
                      <li key={l.code}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeLanguage(l.code);
                          }}
                          style={{
                            fontWeight: l.code === lang ? 700 : 500,
                            color: l.code === lang ? "var(--brand-green, #16a34a)" : undefined,
                            background: l.code === lang ? "rgba(22, 163, 74, 0.08)" : undefined
                          }}
                        >
                          <div className={l.code === "vi" ? "flag-icon" : "flag-icon-en"}></div>
                          {l.name.toUpperCase()}
                          {l.code === lang && <i className="ph-bold ph-check" style={{ marginLeft: "auto", fontSize: "13px" }}></i>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="search-container">
              <input type="text" className="search-input" placeholder={fallback("Tìm kiếm...", "Search...")} />
              <button className="search-btn"><i className="ph ph-magnifying-glass"></i></button>
            </div>
          </div>

          {/* Main Navbar Row */}
          <div className="main-nav-bar">
            <Link href={`/${lang}`} className="site-logo">
              <div className="site-logo-icon">
                <span className="site-logo-icon-inner">W</span>
              </div>
              <span className="site-logo-text">Web<span style={{ color: "#22c55e" }}>Care</span></span>
            </Link>

            {/* Desktop Nav */}
            <ul className="main-menu">
              <li>
                <Link href={`/${lang}`} className={pathname === `/${lang}` ? "active" : ""}>
                  {fallback("Trang chủ", "Home")}
                </Link>
              </li>

              {menuCategories.slice(0, 5).map(cat => {
                let displayTitle = cat.slug;
                if (cat.translations) {
                  try {
                    const t = JSON.parse(cat.translations);
                    if (t[lang]?.title) displayTitle = t[lang].title;
                    else if (t['vi']?.title) displayTitle = t['vi'].title;
                  } catch (_e) { }
                }
                const hasChildren = (cat.children && cat.children.length > 0) || (cat.services && cat.services.length > 0);
                const isActive = pathname.startsWith(`/${lang}/category/${cat.slug}`);

                return (
                  <li key={cat.id}>
                    <Link href={`/${lang}/category/${cat.slug}`} className={isActive ? "active" : ""}>
                      {displayTitle} {hasChildren && <i className="ph ph-caret-down"></i>}
                    </Link>
                    {hasChildren && (
                      <ul className="sub-menu">
                        {cat.children && cat.children.map((child: CategoryItem) => {
                          let childTitle = child.slug;
                          if (child.translations) {
                            try {
                              const t2 = JSON.parse(child.translations);
                              if (t2[lang]?.title) childTitle = t2[lang].title;
                              else if (t2['vi']?.title) childTitle = t2['vi'].title;
                            } catch (_e) { }
                          }
                          return (
                            <li key={child.id}>
                              <Link href={`/${lang}/category/${child.slug}`}>{childTitle}</Link>
                            </li>
                          );
                        })}
                        {cat.services && cat.services.map((svc: CategoryService) => {
                          let svcTitle = svc.title;
                          if (svc.translations) {
                            try {
                              const t2 = JSON.parse(svc.translations);
                              if (t2[lang]?.title) svcTitle = t2[lang].title;
                            } catch (_e) { }
                          }
                          const svcLink = (svc.linkUrl && svc.linkUrl !== "#" && svc.linkUrl.trim() !== "")
                            ? svc.linkUrl
                            : `/${lang}/services/${svc.id}`;
                          return (
                            <li key={`svc-${svc.id}`}>
                              <Link href={svcLink}>{svcTitle}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Nếu có hơn 5 danh mục, gom gọn danh mục phụ vào menu dropdown 'Thêm' */}
              {menuCategories.length > 5 && (
                <li>
                  <span className="overflow-menu-trigger">
                    {fallback("Thêm", "More")} <i className="ph ph-caret-down"></i>
                  </span>
                  <ul className="sub-menu sub-menu-right">
                    {menuCategories.slice(5).map(cat => {
                      let displayTitle = cat.slug;
                      if (cat.translations) {
                        try {
                          const t = JSON.parse(cat.translations);
                          if (t[lang]?.title) displayTitle = t[lang].title;
                          else if (t['vi']?.title) displayTitle = t['vi'].title;
                        } catch (_e) { }
                      }
                      return (
                        <li key={cat.id}>
                          <Link href={`/${lang}/category/${cat.slug}`}>{displayTitle}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}

              {/* Dynamic menu ends here */}
              <li>
                <Link href={`/${lang}/lien-he`} className={pathname.includes("/lien-he") ? "active" : ""}>
                  {fallback("Liên hệ", "Contact")}
                </Link>
              </li>
            </ul>

            {/* Mobile Nav Button */}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open Menu">
              <i className="ph ph-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <Link href={`/${lang}`} className="site-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="site-logo-icon">
              <span className="site-logo-icon-inner">W</span>
            </div>
            <span className="site-logo-text">Web<span style={{ color: "#22c55e" }}>Care</span></span>
          </Link>
          <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
            <i className="ph ph-x"></i>
          </button>
        </div>

        <ul className="mobile-menu-list">
          <li><Link href={`/${lang}`} onClick={() => setMobileMenuOpen(false)}>{fallback("Trang chủ", "Home")}</Link></li>
          {menuCategories.map(cat => {
            let displayTitle = cat.slug;
            if (cat.translations) {
              try {
                const t = JSON.parse(cat.translations);
                if (t[lang]?.title) displayTitle = t[lang].title;
                else if (t['vi']?.title) displayTitle = t['vi'].title;
              } catch (_e) { }
            }
            const hasChildren = (cat.children && cat.children.length > 0) || (cat.services && cat.services.length > 0);

            return (
              <li key={cat.id} style={{ paddingBottom: hasChildren ? "10px" : "0" }}>
                <Link href={`/${lang}/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}>
                  {displayTitle} {hasChildren && <i className="ph ph-caret-down"></i>}
                </Link>
                {hasChildren && (
                  <ul style={{ listStyle: "none", paddingLeft: "15px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                    {cat.children && cat.children.map((child: CategoryItem) => {
                      let childTitle = child.slug;
                      if (child.translations) {
                        try {
                          const t2 = JSON.parse(child.translations);
                          if (t2[lang]?.title) childTitle = t2[lang].title;
                          else if (t2['vi']?.title) childTitle = t2['vi'].title;
                        } catch (_e) { }
                      }
                      return (
                        <li key={child.id}>
                          <Link href={`/${lang}/category/${child.slug}`} style={{ color: "#cbd5e1", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }} onClick={() => setMobileMenuOpen(false)}>
                            <span style={{ color: "var(--brand-green)" }}>•</span> {childTitle}
                          </Link>
                        </li>
                      );
                    })}
                    {cat.services && cat.services.map((svc: CategoryService) => {
                      let svcTitle = svc.title;
                      if (svc.translations) {
                        try {
                          const t2 = JSON.parse(svc.translations);
                          if (t2[lang]?.title) svcTitle = t2[lang].title;
                        } catch (_e) { }
                      }
                      const svcLink = (svc.linkUrl && svc.linkUrl !== "#" && svc.linkUrl.trim() !== "")
                        ? svc.linkUrl
                        : `/${lang}/services/${svc.id}`;
                      return (
                        <li key={`svc-${svc.id}`}>
                          <Link href={svcLink} style={{ color: "#cbd5e1", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }} onClick={() => setMobileMenuOpen(false)}>
                            <span style={{ color: "var(--brand-green)" }}>•</span> {svcTitle}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          <li><Link href={`/${lang}/lien-he`} onClick={() => setMobileMenuOpen(false)}>{fallback("Liên hệ", "Contact")}</Link></li>
        </ul>

        <div className="mobile-tools">
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="top-phone-badge">
            <i className="ph-fill ph-phone" style={{ fontSize: "20px" }}></i> {phone}
          </a>

          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
            <Link href="/login" className="top-auth-link" style={{ fontSize: "16px", padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
              <i className="ph-fill ph-user" style={{ fontSize: "20px" }}></i> {fallback("Đăng nhập", "Login")}
            </Link>

            {availableLangs.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {availableLangs.map(l => (
                  <button key={l.code} onClick={() => changeLanguage(l.code)} style={{ padding: '8px 14px', background: lang === l.code ? '#16a34a' : 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
