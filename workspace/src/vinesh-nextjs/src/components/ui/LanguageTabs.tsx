"use client";

import React from "react";

interface LanguageTabsProps {
    languages: string[];
    activeLang: string;
    onTabChange: (lang: string) => void;
}

export default function LanguageTabs({ languages, activeLang, onTabChange }: LanguageTabsProps) {
    return (
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "20px", marginTop: "30px" }}>
            {languages.map(lang => (
                <button
                    type="button"
                    key={lang}
                    onClick={() => onTabChange(lang)}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        backgroundColor: "transparent",
                        borderBottom: activeLang === lang ? "2px solid #3b82f6" : "2px solid transparent",
                        color: activeLang === lang ? "#3b82f6" : "#64748b",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: "-2px"
                    }}
                >
                    <i className="ph ph-translate"></i> {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
