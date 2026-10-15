import sharp from "sharp";

export type ImageOverlayOptions = {
  hookText: string;
  badgeText?: string;
  themeColor?: string; // hex color e.g. "#06b6d4" or "#10b981"
  aspectRatio?: "square" | "portrait"; // square: 1080x1080, portrait: 1080x1350
  brandName?: string;
};

export type RenderedImageResult = {
  dataUrl: string;
  width: number;
  height: number;
  format: "png";
};

// Escape XML/SVG special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Split hook text into 1-3 lines if longer than 20 chars
function wrapText(text: string, maxLineLength = 22): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLineLength) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3);
}

export async function generateProgrammaticImage(options: ImageOverlayOptions): Promise<RenderedImageResult> {
  const width = 1080;
  const height = options.aspectRatio === "portrait" ? 1350 : 1080;
  const theme = options.themeColor || "#06b6d4";
  const brand = options.brandName || "MARKETING AI · OFFICIAL";
  const badge = options.badgeText || "VIRAL HOOK";
  const lines = wrapText(options.hookText || "BÍ QUYẾT BỨT PHÁ TĂNG TRƯỞNG");

  const lineHeight = 68;
  const textBlockHeight = lines.length * lineHeight;
  const cardWidth = 920;
  const cardHeight = textBlockHeight + 110;
  const cardX = (width - cardWidth) / 2;
  const cardY = height - cardHeight - 80;

  const tspanLines = lines
    .map(
      (line, idx) =>
        `<tspan x="${width / 2}" dy="${idx === 0 ? 0 : lineHeight}" font-size="52" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">${escapeXml(line.toUpperCase())}</tspan>`,
    )
    .join("");

  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a101d"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${theme}"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${theme}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background Glow & Grid Concept -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <circle cx="${width / 2}" cy="420" r="460" fill="url(#glow)"/>

      <!-- Subtle Geometric Lines for Concept Feel -->
      <line x1="80" y1="140" x2="${width - 80}" y2="140" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="80" y1="${height - 180}" x2="${width - 80}" y2="${height - 180}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

      <!-- Brand Logo / Verified Badge at Top -->
      <g transform="translate(80, 70)">
        <rect width="36" height="36" rx="8" fill="url(#accentGrad)"/>
        <path d="M12 18 L16 22 L24 14" fill="none" stroke="#020617" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="48" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#94a3b8">
          ${escapeXml(brand)}
        </text>
      </g>

      <!-- Top Right Category Badge -->
      <g transform="translate(${width - 240}, 66)">
        <rect width="160" height="36" rx="18" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1"/>
        <text x="80" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1" fill="${theme}">
          ${escapeXml(badge)}
        </text>
      </g>

      <!-- Center Dynamic Graphic Icon / Concept Focus -->
      <g transform="translate(${width / 2}, 420)">
        <circle cx="0" cy="0" r="160" fill="rgba(15, 23, 42, 0.8)" stroke="${theme}" stroke-width="2" stroke-opacity="0.4" filter="url(#shadow)"/>
        <circle cx="0" cy="0" r="120" fill="rgba(6, 182, 212, 0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="6 6"/>
        <text x="0" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" text-anchor="middle" fill="#ffffff" opacity="0.9">
          ⚡
        </text>
      </g>

      <!-- Bottom Card for Vietnamese Hook Text (Sharp & 100% Correct Unicode) -->
      <g filter="url(#shadow)">
        <!-- Card Backdrop -->
        <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="24" fill="#090d16" fill-opacity="0.94" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5"/>

        <!-- Accent Top Bar -->
        <rect x="${cardX + 40}" y="${cardY}" width="${cardWidth - 80}" height="4" rx="2" fill="url(#accentGrad)"/>

        <!-- Typographic Vietnamese Hook Text -->
        <text x="${width / 2}" y="${cardY + 84}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
          ${tspanLines}
        </text>
      </g>
    </svg>
  `;

  // Render via Sharp to buffer and output base64 dataUrl
  const imageBuffer = await sharp(Buffer.from(svgOverlay))
    .png({ quality: 90, compressionLevel: 8 })
    .toBuffer();

  const dataUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  return {
    dataUrl,
    width,
    height,
    format: "png",
  };
}
