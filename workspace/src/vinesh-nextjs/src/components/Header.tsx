"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="company-name">CÔNG TY TNHH VINESH VIỆT NAM</span>
          </div>
          <div className="top-bar-right">
            <Link href="#" className="login-link">
              <i className="ph ph-user"></i> Đăng nhập
            </Link>
            <a href="tel:0984929693" className="hotline-btn">
              <i className="ph ph-phone"></i> 0984 929 693
            </a>
          </div>
        </div>
      </div>

      <header id="main-header" className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <div className="logo">
            <Link href="/">
              <h1>VINESH</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li><Link href="/" className="active">Trang chủ</Link></li>
              <li><Link href="#">Khóa học Facebook</Link></li>
              <li><Link href="#">Khóa học Google Ads</Link></li>
              <li><Link href="#">Liên hệ</Link></li>
              <li><Link href="#">Khách hàng</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <button className="search-btn" aria-label="Tìm kiếm">
              <i className="ph ph-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
