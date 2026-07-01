"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "./Header.css";

interface HeaderProps {
  settings?: Record<string, string>;
  lang: string;
  languages?: { code: string; name: string }[];
  menuCategories?: any[];
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

  const phone = settings?.phone || "0984 929 693";
  const fallback = (viText: string, enText: string) => lang === "vi" ? viText : enText;

  const getLanguageName = (code: string) => {
    if (code === "vi") return "VIETNAMESE";
    if (code === "en") return "ENGLISH";
    const found = languages.find(l => l.code === code);
    return found ? found.name.toUpperCase() : code.toUpperCase();
  };

  const changeLanguage = (nextLang: string) => {
    let newPath = pathname;
    if (pathname.startsWith(`/${lang}`)) {
      newPath = pathname.replace(`/${lang}`, `/${nextLang}`);
    } else {
      newPath = `/${nextLang}${pathname}`;
    }
    setLangOpen(false);
    setMobileMenuOpen(false); // close mobile menu on switch
    router.push(newPath);
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

            {languages.length > 0 && (
              <div className="lang-selector-box" onClick={() => setLangOpen(!langOpen)}>
                <div className={lang === "vi" ? "flag-icon" : "flag-icon-en"}></div>
                {getLanguageName(lang)}
                <i className="ph ph-caret-down" style={{ fontSize: "12px", marginLeft: "4px" }}></i>

                {langOpen && (
                  <ul className="lang-dropdown-menu">
                    {languages.map((l) => (
                      <li key={l.code}>
                        <button onClick={(e) => { e.stopPropagation(); changeLanguage(l.code); }}>
                          <div className={l.code === "vi" ? "flag-icon" : "flag-icon-en"}></div> {l.name.toUpperCase()}
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="site-logo-icon">
                  <span className="site-logo-icon-inner"><span style={{ color: "#8cc63f" }}>V</span></span>
                </div>
                <span className="site-logo-text">VINESH</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="main-menu">
              <li><Link href={`/${lang}`} className="active">{fallback("Trang chủ", "Home")}</Link></li>

              {menuCategories.map(cat => {
                let displayTitle = cat.slug;
                if (cat.translations) {
                  try {
                    const t = JSON.parse(cat.translations);
                    if (t[lang]?.title) displayTitle = t[lang].title;
                    else if (t['vi']?.title) displayTitle = t['vi'].title;
                  } catch (e) { }
                }
                const hasChildren = (cat.children && cat.children.length > 0) || (cat.services && cat.services.length > 0);

                return (
                  <li key={cat.id}>
                    <Link href={`/${lang}/category/${cat.slug}`}>
                      {displayTitle} {hasChildren && <i className="ph ph-caret-down"></i>}
                    </Link>
                    {hasChildren && (
                      <ul className="sub-menu" style={{ position: "absolute", top: "100%", left: 0, backgroundColor: "#fff", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", listStyle: "none", padding: "10px", margin: 0, minWidth: "200px" }}>
                        {cat.children && cat.children.map((child: any) => {
                          let childTitle = child.slug;
                          if (child.translations) {
                            try {
                              const t2 = JSON.parse(child.translations);
                              if (t2[lang]?.title) childTitle = t2[lang].title;
                              else if (t2['vi']?.title) childTitle = t2['vi'].title;
                            } catch (e) { }
                          }
                          return (
                            <li key={child.id} style={{ padding: "8px 12px" }}>
                              <Link href={`/${lang}/category/${child.slug}`} style={{ color: "#333", textDecoration: "none", display: "block" }}>{childTitle}</Link>
                            </li>
                          )
                        })}
                        {cat.services && cat.services.map((svc: any) => {
                          let svcTitle = svc.title;
                          if (svc.translations) {
                            try {
                              const t2 = JSON.parse(svc.translations);
                              if (t2[lang]?.title) svcTitle = t2[lang].title;
                            } catch (e) { }
                          }
                          return (
                            <li key={`svc-${svc.id}`} style={{ padding: "8px 12px" }}>
                              <Link href={svc.linkUrl || "#"} style={{ color: "#333", textDecoration: "none", display: "block" }}>{svcTitle}</Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Dynamic menu ends here */}
            </ul>

            {/* Mobile Nav Button */}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <i className="ph ph-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
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
              } catch (e) { }
            }
            const hasChildren = (cat.children && cat.children.length > 0) || (cat.services && cat.services.length > 0);

            return (
              <li key={cat.id} style={{ paddingBottom: hasChildren ? "10px" : "0" }}>
                <Link href={`/${lang}/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}>
                  {displayTitle} {hasChildren && <i className="ph ph-caret-down"></i>}
                </Link>
                {hasChildren && (
                  <ul style={{ listStyle: "none", paddingLeft: "15px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                    {cat.children && cat.children.map((child: any) => {
                      let childTitle = child.slug;
                      if (child.translations) {
                        try {
                          const t2 = JSON.parse(child.translations);
                          if (t2[lang]?.title) childTitle = t2[lang].title;
                          else if (t2['vi']?.title) childTitle = t2['vi'].title;
                        } catch (e) { }
                      }
                      return (
                        <li key={child.id}>
                          <Link href={`/${lang}/category/${child.slug}`} style={{ color: "#eee", fontSize: "15px" }} onClick={() => setMobileMenuOpen(false)}>- {childTitle}</Link>
                        </li>
                      )
                    })}
                    {cat.services && cat.services.map((svc: any) => {
                      let svcTitle = svc.title;
                      if (svc.translations) {
                        try {
                          const t2 = JSON.parse(svc.translations);
                          if (t2[lang]?.title) svcTitle = t2[lang].title;
                        } catch (e) { }
                      }
                      return (
                        <li key={`svc-${svc.id}`}>
                          <Link href={svc.linkUrl || "#"} style={{ color: "#eee", fontSize: "15px" }} onClick={() => setMobileMenuOpen(false)}>- {svcTitle}</Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mobile-tools">
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="top-phone-badge">
            <i className="ph-fill ph-phone" style={{ fontSize: "20px" }}></i> {phone}
          </a>

          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
            <Link href="/login" className="top-auth-link" style={{ fontSize: "16px", padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>
              <i className="ph-fill ph-user" style={{ fontSize: "20px" }}></i> {fallback("Đăng nhập", "Login")}
            </Link>

            {languages.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {languages.map(l => (
                  <button key={l.code} onClick={() => changeLanguage(l.code)} style={{ padding: '8px 12px', background: lang === l.code ? '#8cc63f' : '#fff', color: lang === l.code ? '#fff' : '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
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
