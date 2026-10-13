import { useId, type CSSProperties } from "react";

type BrandLogoProps = {
    compact?: boolean;
    light?: boolean;
    className?: string;
    style?: CSSProperties;
};

export default function BrandLogo({ compact = false, light = false, className, style }: BrandLogoProps) {
    const textColor = light ? "#FDFBF7" : "#2E2E2E";
    const gradientId = useId();

    return (
        <div className={className} style={{ display: "inline-flex", alignItems: "center", gap: compact ? 0 : 10, ...style }} aria-label="Suli Salon">
            <svg width={compact ? 34 : 42} height={compact ? 34 : 42} viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <defs>
                    <linearGradient id={gradientId} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E4CEA0" />
                        <stop offset="1" stopColor="#A08040" />
                    </linearGradient>
                </defs>
                <path d="M24 10.5c2.6-5.4 9.7-6.3 12.7-1.9 2.7 4-.1 9.5-5.8 11.2 4.4 1.1 7.7 5.2 6.2 9.7-1.7 5.1-8.5 5.9-12.1 1.4-1.1 5.5-6.9 8.8-11.4 6.1-4.1-2.5-3.4-8.8 1.2-11.9-5.4-1.1-8.1-6.8-5.4-11.2 2.8-4.5 8.7-3.4 11.1 1.2.1-1.8 1.1-3.6 3.5-4.7Z" fill={`url(#${gradientId})`} opacity=".95" />
                <path d="M24 11.5c1.9 4.8 1.7 9.7-.7 14.5-1.5 3-1.3 6.4.7 10.4 2-4 2.2-7.4.7-10.4-2.4-4.8-2.6-9.7-.7-14.5Z" fill="#FDFBF7" />
                <path d="M24 15.5v18.2" stroke="#2E2E2E" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
                <circle cx="24" cy="24" r="3.2" fill="#2E2E2E" />
            </svg>
            {!compact && (
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, fontStyle: "italic", color: textColor, letterSpacing: "-0.025em" }}>Suli Salon</span>
                    <span style={{ marginTop: 5, fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#C2A979", textTransform: "uppercase" }}>Nghệ thuật móng tinh tế</span>
                </span>
            )}
        </div>
    );
}
