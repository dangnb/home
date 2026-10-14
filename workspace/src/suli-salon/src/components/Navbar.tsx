"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { useLocale } from "@/components/LocaleProvider";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { getLocalizedPath, getEquivalentPath } from "@/lib/i18n/routes";

function LanguageSwitcher({ className = "", onSelect }: { className?: string; onSelect?: () => void }) {
    const { locale } = useLocale();
    const pathname = usePathname();

    return (
        <div className={`public-navbar__lang-switch ${className}`.trim()} role="group" aria-label="Ngôn ngữ / Language">
            {SUPPORTED_LOCALES.map((loc) => {
                const active = loc === locale;
                const targetHref = getEquivalentPath(loc, pathname);
                const title = loc === "vi" ? "Tiếng Việt (Vietnamese)" : "English (Tiếng Anh)";
                const label = loc === "vi" ? "VN" : "EN";

                return (
                    <Link
                        key={loc}
                        href={targetHref}
                        className="public-navbar__lang-btn"
                        data-active={active}
                        aria-current={active ? "true" : undefined}
                        hrefLang={loc}
                        title={title}
                        onClick={onSelect}
                    >
                        {active && <span className="public-navbar__lang-sparkle" aria-hidden="true">✦</span>}
                        <span className="public-navbar__lang-text">{label}</span>
                    </Link>
                );
            })}
        </div>
    );
}

export default function Navbar() {
    const { locale, dictionary } = useLocale();
    const isEn = locale === "en";
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setMenuOpen(false);
    }

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { label: dictionary.nav.services, href: getLocalizedPath(locale, "services") },
        { label: dictionary.nav.about, href: getLocalizedPath(locale, "about") },
        { label: dictionary.nav.gallery, href: getLocalizedPath(locale, "gallery") },
        { label: dictionary.nav.posts, href: getLocalizedPath(locale, "posts") },
        { label: dictionary.nav.contact, href: getLocalizedPath(locale, "contact") },
    ];
    const homeHref = getLocalizedPath(locale, "home");
    const bookingHref = getLocalizedPath(locale, "booking");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const desktopMedia = window.matchMedia("(min-width: 1024px)");
        const closeMenuOnDesktop = () => {
            if (desktopMedia.matches) setMenuOpen(false);
        };

        desktopMedia.addEventListener("change", closeMenuOnDesktop);
        return () => desktopMedia.removeEventListener("change", closeMenuOnDesktop);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusableSelector = 'a[href], button:not([disabled])';
        const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
        focusables?.[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
                return;
            }

            if (event.key !== "Tab" || !focusables?.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const closeMenu = () => {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
    };

    return (
        <header
            className="public-navbar"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 100,
                transition: "all .5s ease",
                background: scrolled ? "rgba(253,251,247,.95)" : "rgba(253,251,247,.65)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: scrolled ? "1px solid rgba(194,169,121,.25)" : "1px solid rgba(194,169,121,.12)",
                boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.06)" : "none",
                padding: scrolled ? "10px 0" : "18px 0",
            }}
        >
            <nav className="public-navbar__inner" aria-label={dictionary.nav.desktop}>
                <Link href={homeHref} className="public-navbar__brand" aria-label={dictionary.nav.home}>
                    <BrandLogo />
                </Link>

                <ul className="public-navbar__links">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="public-navbar__link"
                                    data-active={active}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="public-navbar__actions">
                    <LanguageSwitcher />
                    <Link href={bookingHref} className="public-navbar__booking">
                        {dictionary.nav.booking}
                    </Link>
                    <button
                        ref={menuButtonRef}
                        type="button"
                        className="public-navbar__menu-button"
                        aria-label={menuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
                        aria-expanded={menuOpen}
                        aria-controls="public-mobile-menu"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="public-navbar__mobile-layer">
                    <button
                        type="button"
                        className="public-navbar__backdrop"
                        aria-label={dictionary.nav.closeMenu}
                        onClick={closeMenu}
                    />
                    <div ref={drawerRef} id="public-mobile-menu" className="public-navbar__drawer" role="dialog" aria-modal="true" aria-label={dictionary.nav.mobile}>
                        <button
                            type="button"
                            className="public-navbar__drawer-close"
                            aria-label={dictionary.nav.closeMenu}
                            onClick={closeMenu}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                        <nav aria-label={dictionary.nav.mobile}>
                            <div className="public-navbar__drawer-lang-wrap">
                                <div className="public-navbar__drawer-lang-title">✦ {isEn ? "Select Language" : "Chọn ngôn ngữ"}</div>
                                <LanguageSwitcher onSelect={closeMenu} />
                            </div>
                            <ul>
                                {navItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <li key={item.href}>
                                            <Link href={item.href} className="public-navbar__mobile-link" aria-current={active ? "page" : undefined} onClick={closeMenu}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <Link href={bookingHref} className="public-navbar__mobile-booking" onClick={closeMenu}>
                                {dictionary.nav.booking}
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
