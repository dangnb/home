"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./reels.module.css";
import BrandLogo from "@/components/BrandLogo";
import {
  REEL_FEATURE_STEPS,
  TOTAL_REEL_MS,
} from "@/components/ReelAutoPilot";
import defaultTours from "../../../data/tours.json";
import defaultMedia from "../../../data/media.json";
import defaultJournal from "../../../data/journal.json";
import defaultSettings from "../../../data/settings.json";
import type {
  JournalArticle,
  SiteMedia,
  SiteSettings,
  Tour,
} from "@/types";
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDownload,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiVideo,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

const CANVAS_W = 1080;
const CANVAS_H = 1920;

function easeInOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function smoothLerp(a: number, b: number, t: number): number {
  return a + (b - a) * easeInOutCubic(t);
}

function loadImg(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  scale = 1
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (!img || !img.width || !img.height) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#243528");
    grad.addColorStop(1, "#141b15");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    return;
  }

  const targetRatio = w / h;
  const imgRatio = img.width / img.height;
  let drawW = w;
  let drawH = h;
  if (imgRatio > targetRatio) {
    drawH = h;
    drawW = h * imgRatio;
  } else {
    drawW = w;
    drawH = w / imgRatio;
  }
  drawW *= scale;
  drawH *= scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
): number {
  const safeText = String(text || "");
  if (!safeText) return y;
  const words = safeText.split(/\s+/);
  let line = "";
  let lineCount = 0;
  let curY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = words[i];
      curY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        const rest = words.slice(i).join(" ");
        let clipped = rest;
        while (
          ctx.measureText(clipped + "…").width > maxWidth &&
          clipped.length > 0
        ) {
          clipped = clipped.slice(0, -1);
        }
        ctx.fillText(
          clipped.length < rest.length ? `${clipped}…` : clipped,
          x,
          curY
        );
        return curY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, curY);
    curY += lineHeight;
  }
  return curY;
}

function drawTouchCursor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  clicking: boolean,
  label?: string
) {
  ctx.save();
  if (clicking) {
    ctx.beginPath();
    ctx.arc(x, y, 58, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(229, 185, 111, 0.65)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, clicking ? 28 : 34, 0, Math.PI * 2);
  ctx.fillStyle = clicking
    ? "rgba(229, 185, 111, 0.88)"
    : "rgba(229, 185, 111, 0.45)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#e5b96f";
  ctx.stroke();

  if (label) {
    ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
    const tw = ctx.measureText(label).width;
    roundRectPath(ctx, x - tw / 2 - 18, y + 46, tw + 36, 42, 8);
    ctx.fillStyle = "rgba(20, 27, 21, 0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(229, 185, 111, 0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#e5b96f";
    ctx.fillText(label, x - tw / 2, y + 74);
  }
  ctx.restore();
}

export default function ReelsStudioPage() {
  const [tours, setTours] = useState<Tour[]>(defaultTours as Tour[]);
  const [media, setMedia] = useState<SiteMedia>(defaultMedia as SiteMedia);
  const [journal, setJournal] = useState<JournalArticle[]>(
    defaultJournal as JournalArticle[]
  );
  const [settings, setSettings] = useState<SiteSettings>(
    defaultSettings as SiteSettings
  );

  const [stageMode, setStageMode] = useState<"live-dom" | "canvas-render">(
    "live-dom"
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // 0.78 = Rất chậm rãi (~66s), 1 = Chậm rãi mặc định (52s), 1.3 = Vừa phải (40s)
  const [speedScale, setSpeedScale] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordStatusText, setRecordStatusText] = useState("");
  const [copiedCaption, setCopiedCaption] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const phoneViewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Record<string, HTMLImageElement | null>>({});

  const effectiveTotalMs = Math.round(TOTAL_REEL_MS / speedScale);

  // Sync live CMS data from /api/admin
  useEffect(() => {
    fetch("/api/admin", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data.tours) && data.tours.length > 0)
          setTours(data.tours);
        if (data.media && Array.isArray(data.media.heroSlides))
          setMedia(data.media);
        if (Array.isArray(data.journal) && data.journal.length > 0)
          setJournal(data.journal);
        if (data.settings?.brandName) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  // Preload real website images for the 1080x1920 feature canvas exporter
  useEffect(() => {
    const urls = new Set<string>();
    media.heroSlides.forEach((s) => urls.add(s.image));
    media.destinations.forEach((d) => urls.add(d.image));
    tours.forEach((t) => {
      urls.add(t.image);
      (t.gallery || []).forEach((g) => urls.add(g));
    });
    journal.forEach((j) => urls.add(j.image));

    urls.forEach((u) => {
      if (u && !(u in imageCacheRef.current)) {
        imageCacheRef.current[u] = null;
        loadImg(u).then((img) => {
          imageCacheRef.current[u] = img;
        });
      }
    });
  }, [tours, media, journal]);

  // Listen for step updates from the live website iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "NEP_REEL_STEP") {
        setActiveStepIndex(Number(e.data.stepIndex) || 0);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Draw a specific baseElapsedMs (0..TOTAL_REEL_MS) of the 7 real website features onto the 1080x1920 canvas
  const renderWebsiteFeatureFrame = (
    ctx: CanvasRenderingContext2D,
    baseElapsedMs: number
  ) => {
    const clampedMs = Math.max(0, baseElapsedMs % TOTAL_REEL_MS);
    let acc = 0;
    let stepIdx = 0;
    let localMs = 0;
    for (let i = 0; i < REEL_FEATURE_STEPS.length; i++) {
      const d = REEL_FEATURE_STEPS[i].durationMs;
      if (clampedMs < acc + d) {
        stepIdx = i;
        localMs = clampedMs - acc;
        break;
      }
      acc += d;
    }
    const stepSpec = REEL_FEATURE_STEPS[stepIdx] || REEL_FEATURE_STEPS[0];
    const p = Math.min(1, Math.max(0, localMs / stepSpec.durationMs));

    // Base warm paper / forest background
    ctx.fillStyle = "#f4f2ee";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Sticky Website Navbar at top of mobile viewport
    const drawMobileNavbar = (transparent: boolean) => {
      ctx.save();
      ctx.fillStyle = transparent
        ? "rgba(20, 27, 21, 0.55)"
        : "rgba(244, 242, 238, 0.96)";
      ctx.fillRect(0, 148, CANVAS_W, 96);
      ctx.strokeStyle = transparent
        ? "rgba(255,255,255,0.14)"
        : "rgba(30,40,32,0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 244);
      ctx.lineTo(CANVAS_W, 244);
      ctx.stroke();

      ctx.fillStyle = transparent ? "#ffffff" : "#1f4d36";
      ctx.font = '700 32px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(settings.brandName || "Nếp Journeys", 48, 206);

      roundRectPath(ctx, CANVAS_W - 320, 168, 92, 54, 6);
      ctx.fillStyle = transparent
        ? "rgba(255,255,255,0.14)"
        : "rgba(31,77,54,0.08)";
      ctx.fill();
      ctx.fillStyle = transparent ? "#ffffff" : "#1f4d36";
      ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("VI / EN", CANVAS_W - 300, 202);

      roundRectPath(ctx, CANVAS_W - 210, 168, 162, 54, 6);
      ctx.fillStyle = "#1f4d36";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("Đặt giữ chỗ", CANVAS_W - 188, 202);
      ctx.restore();
    };

    // =========================================================================
    // FEATURE 01: HERO SLIDER 100VH & SCENE SWITCHING
    // =========================================================================
    if (stepIdx === 0) {
      const slideIdx = p < 0.36 ? 0 : p < 0.72 ? 1 : 2;
      const slide = media.heroSlides[slideIdx] || media.heroSlides[0];
      const img = imageCacheRef.current[slide?.image || ""] || null;
      drawCoverImage(ctx, img, 0, 148, CANVAS_W, CANVAS_H - 148, 1 + p * 0.05);

      const grad = ctx.createLinearGradient(0, 148, 0, CANVAS_H);
      grad.addColorStop(0, "rgba(15, 22, 17, 0.45)");
      grad.addColorStop(0.55, "rgba(15, 22, 17, 0.35)");
      grad.addColorStop(1, "rgba(15, 22, 17, 0.92)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 148, CANVAS_W, CANVAS_H - 148);

      drawMobileNavbar(true);

      roundRectPath(ctx, 56, 360, 520, 56, 6);
      ctx.fillStyle = "rgba(20, 27, 21, 0.72)";
      ctx.fill();
      ctx.strokeStyle = "rgba(229, 185, 111, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#e5b96f";
      ctx.font = '600 23px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${slide?.placeVi || "Hà Giang"} · ${(slide?.captionVi || "").split("·")[0].trim()}`,
        80,
        396
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = '600 66px "Cormorant Garamond", Georgia, serif';
      const nextY = wrapCanvasText(
        ctx,
        "Đi chậm giữa những mùa sương và di sản Việt Nam",
        56,
        520,
        CANVAS_W - 112,
        76,
        3
      );

      ctx.fillStyle = "rgba(244, 242, 238, 0.86)";
      ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
      wrapCanvasText(
        ctx,
        slide?.captionVi ||
          "Hành trình nhóm nhỏ 6–10 khách khảo sát thực địa Bắc · Trung · Nam.",
        56,
        nextY + 24,
        CANVAS_W - 112,
        42,
        3
      );

      // Interactive Scene Switcher Bar at bottom of Hero 100vh
      roundRectPath(ctx, 56, 1340, CANVAS_W - 112, 220, 8);
      ctx.fillStyle = "rgba(20, 27, 21, 0.86)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.stroke();

      ctx.fillStyle = "#e5b96f";
      ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`0${slideIdx + 1} / 0${media.heroSlides.length}`, 92, 1402);

      roundRectPath(ctx, CANVAS_W - 240, 1368, 68, 56, 6);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText("←", CANVAS_W - 218, 1404);

      roundRectPath(ctx, CANVAS_W - 156, 1368, 68, 56, 6);
      ctx.fillStyle = "#e5b96f";
      ctx.fill();
      ctx.fillStyle = "#141b15";
      ctx.fillText("→", CANVAS_W - 134, 1404);

      media.heroSlides.slice(0, 3).forEach((s, idx) => {
        const bx = 92 + idx * 295;
        roundRectPath(ctx, bx, 1445, 275, 84, 6);
        ctx.fillStyle =
          idx === slideIdx
            ? "rgba(229, 185, 111, 0.22)"
            : "rgba(255, 255, 255, 0.06)";
        ctx.fill();
        ctx.strokeStyle =
          idx === slideIdx ? "#e5b96f" : "rgba(255, 255, 255, 0.14)";
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `0${idx + 1} · ${s?.placeVi || "Điểm đến"}`,
          bx + 20,
          1495
        );
      });

      // Smoothly glide cursor from Slide Tab 2 -> Next Arrow
      const glideT = (p - 0.42) / 0.22;
      const cursorX = smoothLerp(520, CANVAS_W - 122, glideT);
      const cursorY = smoothLerp(1485, 1396, glideT);
      const clicking =
        (p > 0.3 && p < 0.4) || (p > 0.66 && p < 0.76);
      drawTouchCursor(ctx, cursorX, cursorY, clicking, "Chuyển cảnh Slider");
    }

    // =========================================================================
    // FEATURE 02: TOUR FILTER BY 3 REGIONS (BẮC · TRUNG · NAM)
    // =========================================================================
    else if (stepIdx === 1) {
      drawMobileNavbar(false);

      const activeFilterIdx = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
      const filterLabels = [
        `Tất cả (${tours.length})`,
        `Miền Bắc (${tours.filter((t) => t.categoryId === "mien-bac").length})`,
        `Miền Trung (${tours.filter((t) => t.categoryId === "mien-trung").length})`,
        `Miền Nam (${tours.filter((t) => t.categoryId === "mien-nam").length})`,
      ];

      ctx.fillStyle = "#984a27";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("TUYẾN HÀNH TRÌNH CHỌN LỌC", 56, 310);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 54px "Cormorant Garamond", Georgia, serif';
      ctx.fillText("Lọc hành trình theo 3 miền", 56, 375);

      filterLabels.forEach((lbl, idx) => {
        const bx = 56 + idx * 244;
        const active = idx === activeFilterIdx;
        roundRectPath(ctx, bx, 415, 230, 66, 6);
        ctx.fillStyle = active ? "#1f4d36" : "#eae6df";
        ctx.fill();
        ctx.strokeStyle = active ? "#1f4d36" : "rgba(30,40,32,0.16)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = active ? "#ffffff" : "#263228";
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(lbl, bx + 22, 456);
      });

      const filteredTours =
        activeFilterIdx === 1
          ? tours.filter((t) => t.categoryId === "mien-bac")
          : activeFilterIdx === 2
          ? tours.filter((t) => t.categoryId === "mien-trung")
          : tours;

      filteredTours.slice(0, 2).forEach((tour, idx) => {
        const cardY = 520 + idx * 540;
        roundRectPath(ctx, 56, cardY, CANVAS_W - 112, 505, 8);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "rgba(30,40,32,0.12)";
        ctx.lineWidth = 2;
        ctx.stroke();

        const img = imageCacheRef.current[tour.image] || null;
        drawCoverImage(ctx, img, 56, cardY, CANVAS_W - 112, 275, 1.02);

        roundRectPath(ctx, 84, cardY + 24, 340, 48, 4);
        ctx.fillStyle = "rgba(20, 27, 21, 0.84)";
        ctx.fill();
        ctx.fillStyle = "#e5b96f";
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${tour.location} · ${tour.duration}`, 102, cardY + 55);

        ctx.fillStyle = "#1c261e";
        ctx.font = '600 38px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(tour.name, 84, cardY + 338);

        ctx.fillStyle = "#525d54";
        ctx.font = '400 23px "Plus Jakarta Sans", sans-serif';
        wrapCanvasText(
          ctx,
          tour.description,
          84,
          cardY + 382,
          CANVAS_W - 168,
          32,
          2
        );

        ctx.fillStyle = "#1f4d36";
        ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `${tour.price.toLocaleString("vi-VN")} ₫ / khách`,
          84,
          cardY + 474
        );

        roundRectPath(ctx, CANVAS_W - 330, cardY + 432, 240, 56, 6);
        ctx.fillStyle = "#1f4d36";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("Xem chi tiết →", CANVAS_W - 292, cardY + 468);
      });

      // Smoothly glide cursor across the 3 region filter buttons
      let cursorX = 56 + 115;
      if (p < 0.34) {
        cursorX = smoothLerp(56 + 115, 56 + 244 + 115, (p - 0.14) / 0.16);
      } else {
        cursorX = smoothLerp(
          56 + 244 + 115,
          56 + 488 + 115,
          (p - 0.46) / 0.18
        );
      }
      const clicking =
        (p > 0.28 && p < 0.38) || (p > 0.62 && p < 0.72);
      drawTouchCursor(ctx, cursorX, 448, clicking, "Lọc theo vùng miền");
    }

    // =========================================================================
    // FEATURE 03: TOUR BOOKING MODAL & LIVE GUEST PRICE CALCULATOR
    // =========================================================================
    else if (stepIdx === 2) {
      drawMobileNavbar(false);
      const tour = tours[0];
      const guests = p < 0.45 ? 2 : p < 0.74 ? 3 : 4;
      const totalVnd = (tour?.price || 6890000) * guests;

      ctx.fillStyle = "rgba(15, 22, 17, 0.72)";
      ctx.fillRect(0, 148, CANVAS_W, CANVAS_H - 148);

      roundRectPath(ctx, 44, 210, CANVAS_W - 88, 1460, 12);
      ctx.fillStyle = "#f9f7f3";
      ctx.fill();
      ctx.strokeStyle = "rgba(229, 185, 111, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const gallery = tour?.gallery || [tour?.image || ""];
      const photoIdx = p < 0.26 ? 0 : 1;
      const img =
        imageCacheRef.current[gallery[photoIdx] || tour?.image || ""] || null;
      drawCoverImage(ctx, img, 44, 210, CANVAS_W - 88, 410, 1.03);

      roundRectPath(ctx, 80, 540, 180, 48, 6);
      ctx.fillStyle = "rgba(20, 27, 21, 0.85)";
      ctx.fill();
      ctx.fillStyle = "#e5b96f";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Ảnh ${photoIdx + 1} / ${gallery.length}`, 104, 572);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 46px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(tour?.name || "Hà Giang — Mùa Đá Nở Hoa", 80, 690);

      (tour?.schedule || []).slice(0, 2).forEach((dayItem, idx) => {
        const sy = 730 + idx * 96;
        roundRectPath(ctx, 80, sy, CANVAS_W - 160, 82, 6);
        ctx.fillStyle = "#efeae0";
        ctx.fill();
        ctx.fillStyle = "#1f4d36";
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(dayItem.day, 104, sy + 34);
        ctx.fillStyle = "#2b362d";
        ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(dayItem.title, 230, sy + 34);
        ctx.fillStyle = "#5c675e";
        ctx.font = '400 19px "Plus Jakarta Sans", sans-serif';
        ctx.fillText((dayItem.activities || "").slice(0, 62) + "…", 104, sy + 64);
      });

      // Interactive Price & Guest Calculator Box
      roundRectPath(ctx, 80, 950, CANVAS_W - 160, 670, 10);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#1f4d36";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#984a27";
      ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("TÍNH GIÁ TỰ ĐỘNG THEO SỐ LƯỢNG KHÁCH", 116, 1005);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("Đơn giá niêm yết:", 116, 1065);
      ctx.fillText(
        `${(tour?.price || 6890000).toLocaleString("vi-VN")} ₫ / khách`,
        CANVAS_W - 440,
        1065
      );

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("Số lượng khách tham gia:", 116, 1165);

      // Minus button
      roundRectPath(ctx, CANVAS_W - 430, 1120, 74, 70, 6);
      ctx.fillStyle = "#eae6df";
      ctx.fill();
      ctx.fillStyle = "#1c261e";
      ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("−", CANVAS_W - 404, 1166);

      // Count display
      roundRectPath(ctx, CANVAS_W - 340, 1120, 130, 70, 6);
      ctx.fillStyle = "#f4f2ee";
      ctx.fill();
      ctx.fillStyle = "#1f4d36";
      ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${guests} khách`, CANVAS_W - 322, 1165);

      // Plus button (+)
      roundRectPath(ctx, CANVAS_W - 194, 1120, 74, 70, 6);
      ctx.fillStyle = "#1f4d36";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("+", CANVAS_W - 168, 1166);

      // Live Calculated Total Bar
      roundRectPath(ctx, 116, 1235, CANVAS_W - 232, 135, 8);
      ctx.fillStyle = "rgba(31, 77, 54, 0.09)";
      ctx.fill();
      ctx.strokeStyle = "#1f4d36";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#2b362d";
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `Tạm tính (${guests} khách × ${(tour?.price || 6890000).toLocaleString(
          "vi-VN"
        )} ₫):`,
        148,
        1288
      );

      ctx.fillStyle = "#1f4d36";
      ctx.font = '700 46px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${totalVnd.toLocaleString("vi-VN")} ₫`, 148, 1348);

      roundRectPath(ctx, 116, 1410, CANVAS_W - 232, 86, 8);
      ctx.fillStyle = "#1f4d36";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 27px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        "Gửi yêu cầu giữ chỗ — Điều phối viên gọi lại trong 2h",
        195,
        1463
      );

      // Smooth cursor glide from photo gallery down to (+) Guest button
      const glideDown = (p - 0.24) / 0.16;
      const curX = smoothLerp(CANVAS_W - 140, CANVAS_W - 157, glideDown);
      const curY = smoothLerp(420, 1155, glideDown);
      const clickingPlus =
        (p > 0.41 && p < 0.5) || (p > 0.7 && p < 0.79);
      drawTouchCursor(
        ctx,
        curX,
        curY,
        clickingPlus,
        `Tăng lên ${guests} khách`
      );
    }

    // =========================================================================
    // FEATURE 04: SEASONAL COMPASS 12 MONTHS (THU · ĐÔNG · XUÂN · HẠ)
    // =========================================================================
    else if (stepIdx === 3) {
      drawMobileNavbar(false);
      const seasonIdx = p < 0.35 ? 0 : p < 0.7 ? 1 : 2;
      const seasons = [
        {
          tab: "Mùa Thu · T9–T11",
          region: "Đông – Tây Bắc & Hà Nội",
          weather: "16°C – 24°C · Nắng hanh vàng, lúa chín bậc thang",
          headline: "Mùa vàng trên các triền núi đá Hà Giang & Pù Luông",
          note: "Thời điểm đẹp nhất trong năm để đi bộ xuyên bản vùng cao và săn mây sớm.",
          tour: tours[0] || tours[1],
        },
        {
          tab: "Mùa Đông · T12–T2",
          region: "Cao nguyên đá & Miền Trung",
          weather: "10°C – 20°C · Sương mù đặc, hoa đào rừng nở sớm",
          headline: "Sương giăng phố cổ & bếp lửa người Mông vùng biên",
          note: "Thích hợp cho hành trình nghỉ dưỡng di sản cố đô Huế – Hội An hoặc săn mây.",
          tour: tours[2] || tours[0],
        },
        {
          tab: "Mùa Xuân · T3–T5",
          region: "Ninh Bình · Huế · Tây Nguyên",
          weather: "20°C – 27°C · Tiết trời ấm áp, cây cối đâm chồi",
          headline: "Mùa lễ hội bản địa và đầm Vân Long trong vắt",
          note: "Nước suối và đầm ngập nước trong xanh nhất, thuận lợi chèo đò nan ngắm thạch nhũ.",
          tour: tours[1] || tours[0],
        },
      ];
      const activeSeason = seasons[seasonIdx];

      ctx.fillStyle = "#984a27";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("LA BÀN MÙA ĐẸP 12 THÁNG", 56, 310);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 54px "Cormorant Garamond", Georgia, serif';
      ctx.fillText("Tháng này đi đâu đẹp nhất?", 56, 375);

      seasons.forEach((s, idx) => {
        const bx = 56 + idx * 326;
        const isAct = idx === seasonIdx;
        roundRectPath(ctx, bx, 420, 310, 74, 6);
        ctx.fillStyle = isAct ? "#1f4d36" : "#e8e3da";
        ctx.fill();
        ctx.fillStyle = isAct ? "#ffffff" : "#263228";
        ctx.font = '600 23px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(s.tab, bx + 28, 466);
      });

      roundRectPath(ctx, 56, 535, CANVAS_W - 112, 1080, 10);
      ctx.fillStyle = "#1c261e";
      ctx.fill();

      const sImg = imageCacheRef.current[activeSeason.tour?.image || ""] || null;
      drawCoverImage(ctx, sImg, 56, 535, CANVAS_W - 112, 480, 1.04);

      roundRectPath(ctx, 92, 935, 680, 56, 6);
      ctx.fillStyle = "rgba(20, 27, 21, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "#e5b96f";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#e5b96f";
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(activeSeason.weather, 118, 971);

      ctx.fillStyle = "#e5b96f";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`VÙNG GỢI Ý: ${activeSeason.region.toUpperCase()}`, 92, 1080);

      ctx.fillStyle = "#ffffff";
      ctx.font = '600 48px "Cormorant Garamond", Georgia, serif';
      const ny = wrapCanvasText(
        ctx,
        activeSeason.headline,
        92,
        1145,
        CANVAS_W - 184,
        58,
        2
      );

      ctx.fillStyle = "rgba(244, 242, 238, 0.82)";
      ctx.font = '400 25px "Plus Jakarta Sans", sans-serif';
      wrapCanvasText(
        ctx,
        activeSeason.note,
        92,
        ny + 18,
        CANVAS_W - 184,
        38,
        3
      );

      roundRectPath(ctx, 92, 1380, CANVAS_W - 184, 190, 8);
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fill();
      ctx.strokeStyle = "rgba(229, 185, 111, 0.45)";
      ctx.stroke();

      ctx.fillStyle = "#e5b96f";
      ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("TUYẾN KHỚP MÙA NÀY:", 124, 1430);
      ctx.fillStyle = "#ffffff";
      ctx.font = '600 32px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(activeSeason.tour?.name || "", 124, 1480);
      ctx.fillStyle = "#e5b96f";
      ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${(activeSeason.tour?.price || 6890000).toLocaleString("vi-VN")} ₫ · ${
          activeSeason.tour?.duration || ""
        }`,
        124,
        1532
      );

      let tabX = 56 + 155;
      if (p < 0.35) {
        tabX = smoothLerp(56 + 155, 56 + 326 + 155, (p - 0.16) / 0.16);
      } else {
        tabX = smoothLerp(56 + 326 + 155, 56 + 652 + 155, (p - 0.5) / 0.16);
      }
      const clicking =
        (p > 0.3 && p < 0.4) || (p > 0.65 && p < 0.75);
      drawTouchCursor(ctx, tabX, 457, clicking, "Đổi mùa du khảo");
    }

    // =========================================================================
    // FEATURE 05: DESTINATION GALLERY & FULLSCREEN LIGHTBOX
    // =========================================================================
    else if (stepIdx === 4) {
      drawMobileNavbar(false);
      const destList = media.destinations;

      ctx.fillStyle = "#984a27";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("THƯ VIỆN ẢNH DI SẢN VIỆT NAM", 56, 310);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 52px "Cormorant Garamond", Georgia, serif';
      ctx.fillText("Bấm vào ảnh để mở Lightbox phóng to", 56, 375);

      destList.slice(0, 4).forEach((d, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const gx = 56 + col * 494;
        const gy = 425 + row * 480;
        const img = imageCacheRef.current[d.image] || null;
        drawCoverImage(ctx, img, gx, gy, 474, 450, 1.02);

        const gGrad = ctx.createLinearGradient(0, gy + 240, 0, gy + 450);
        gGrad.addColorStop(0, "rgba(0,0,0,0)");
        gGrad.addColorStop(1, "rgba(15,22,17,0.9)");
        ctx.fillStyle = gGrad;
        ctx.fillRect(gx, gy, 474, 450);

        ctx.fillStyle = "#e5b96f";
        ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(d.provinceVi || "", gx + 24, gy + 375);
        ctx.fillStyle = "#ffffff";
        ctx.font = '600 30px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(d.nameVi || "", gx + 24, gy + 418);
      });

      if (p > 0.28) {
        const lbIdx = p < 0.65 ? 0 : 1;
        const activePhoto = destList[lbIdx] || destList[0];

        ctx.fillStyle = "rgba(12, 17, 13, 0.92)";
        ctx.fillRect(0, 148, CANVAS_W, CANVAS_H - 148);

        roundRectPath(ctx, 48, 310, CANVAS_W - 96, 1180, 10);
        ctx.fillStyle = "#18221a";
        ctx.fill();
        ctx.strokeStyle = "rgba(229, 185, 111, 0.45)";
        ctx.stroke();

        const lbImg = imageCacheRef.current[activePhoto?.image || ""] || null;
        drawCoverImage(ctx, lbImg, 48, 310, CANVAS_W - 96, 760, 1.04);

        ctx.fillStyle = "#e5b96f";
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `LIGHTBOX ${lbIdx + 1} / ${destList.length} · ${
            activePhoto?.provinceVi || ""
          } · ${activePhoto?.timeOfDayVi || "05:45"}`,
          88,
          1140
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = '600 50px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(activePhoto?.nameVi || "", 88, 1210);

        ctx.fillStyle = "rgba(244, 242, 238, 0.84)";
        ctx.font = '400 25px "Plus Jakarta Sans", sans-serif';
        wrapCanvasText(
          ctx,
          activePhoto?.storyVi || "",
          88,
          1270,
          CANVAS_W - 176,
          38,
          3
        );

        roundRectPath(ctx, CANVAS_W - 180, 650, 96, 96, 48);
        ctx.fillStyle = "rgba(20, 27, 21, 0.85)";
        ctx.fill();
        ctx.strokeStyle = "#e5b96f";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#e5b96f";
        ctx.font = '700 40px "Plus Jakarta Sans", sans-serif';
        ctx.fillText("→", CANVAS_W - 150, 712);

        const curX = smoothLerp(290, CANVAS_W - 132, (p - 0.34) / 0.22);
        const curY = smoothLerp(640, 698, (p - 0.34) / 0.22);
        drawTouchCursor(
          ctx,
          curX,
          curY,
          p > 0.6 && p < 0.7,
          "Xem ảnh kế tiếp"
        );
      } else {
        drawTouchCursor(ctx, 290, 640, p > 0.2, "Chạm mở Lightbox");
      }
    }

    // =========================================================================
    // FEATURE 06: JOURNAL SECTION & ARTICLE READER MODAL
    // =========================================================================
    else if (stepIdx === 5) {
      drawMobileNavbar(false);
      const article = journal[0];

      ctx.fillStyle = "rgba(15, 22, 17, 0.76)";
      ctx.fillRect(0, 148, CANVAS_W, CANVAS_H - 148);

      roundRectPath(ctx, 48, 220, CANVAS_W - 96, 1440, 10);
      ctx.fillStyle = "#f9f7f3";
      ctx.fill();

      const aImg = imageCacheRef.current[article?.image || ""] || null;
      drawCoverImage(ctx, aImg, 48, 220, CANVAS_W - 96, 480, 1.03);

      roundRectPath(ctx, 88, 620, 320, 50, 6);
      ctx.fillStyle = "#1f4d36";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${article?.category || "Ký sự"} · ${article?.readTime || "6 phút đọc"}`,
        112,
        653
      );

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 50px "Cormorant Garamond", Georgia, serif';
      const titleEnd = wrapCanvasText(
        ctx,
        article?.title || "Ghi chép thực địa văn hóa bản địa",
        88,
        755,
        CANVAS_W - 176,
        60,
        2
      );

      ctx.fillStyle = "#984a27";
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `Tác giả: ${article?.author || "Ban biên tập Nếp"} · ${
          article?.date || ""
        }`,
        88,
        titleEnd + 16
      );

      ctx.fillStyle = "#2b362d";
      ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
      let py = titleEnd + 80;
      (article?.body || [article?.excerpt || ""]).slice(0, 2).forEach((para) => {
        py =
          wrapCanvasText(ctx, para, 88, py, CANVAS_W - 176, 40, 4) + 28;
      });

      const scrollY = smoothLerp(1300, 1080, (p - 0.25) / 0.45);
      drawTouchCursor(
        ctx,
        540,
        scrollY,
        p > 0.45 && p < 0.58,
        "Cuộn đọc ký sự văn hóa"
      );
    }

    // =========================================================================
    // FEATURE 07: SLIDE-OUT QUICK BOOKING DRAWER & FLOATING CONTACT DOCK
    // =========================================================================
    else {
      drawMobileNavbar(false);

      ctx.fillStyle = "#141b15";
      ctx.fillRect(0, 244, CANVAS_W, CANVAS_H - 244);

      const slideOffset =
        (1 - easeInOutCubic(Math.min(1, p * 2.2))) * 700;
      const drawerX = 160 + slideOffset;

      roundRectPath(ctx, drawerX, 244, CANVAS_W - drawerX, 1420, 0);
      ctx.fillStyle = "#f9f7f3";
      ctx.fill();
      ctx.strokeStyle = "#e5b96f";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#984a27";
      ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("NGĂN KÉO GIỮ CHỖ NHANH", drawerX + 54, 325);

      ctx.fillStyle = "#1c261e";
      ctx.font = '600 48px "Cormorant Garamond", Georgia, serif';
      ctx.fillText("Tư vấn & Đặt lịch khởi hành", drawerX + 54, 390);

      const fields = [
        {
          label: "Hành trình quan tâm",
          val: tours[0]?.name || "Hà Giang — Mùa Đá Nở Hoa",
        },
        { label: "Họ và tên khách hàng", val: "Nguyễn Minh Khôi" },
        { label: "Số điện thoại Zalo", val: "0988 345 678" },
        { label: "Ngày khởi hành dự kiến", val: "15 / 11 / 2026 · 4 khách" },
      ];

      fields.forEach((f, idx) => {
        const fy = 450 + idx * 175;
        ctx.fillStyle = "#4a554c";
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(f.label, drawerX + 54, fy);

        roundRectPath(
          ctx,
          drawerX + 54,
          fy + 20,
          CANVAS_W - drawerX - 108,
          84,
          6
        );
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#1f4d36";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#1c261e";
        ctx.font = '600 25px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(f.val, drawerX + 82, fy + 72);
      });

      roundRectPath(
        ctx,
        drawerX + 54,
        1170,
        CANVAS_W - drawerX - 108,
        92,
        6
      );
      ctx.fillStyle = "#1f4d36";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 27px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("Xác nhận giữ chỗ trực tuyến →", drawerX + 190, 1226);

      const dockButtons = [
        { label: "Gọi Hotline", bg: "#1f4d36", tag: settings.hotlineDisplay },
        { label: "Chat Zalo", bg: "#0068ff", tag: "Tư vấn 24/7" },
        { label: "Messenger", bg: "#0084ff", tag: "Phản hồi ngay" },
      ];
      dockButtons.forEach((btn, idx) => {
        const by = 1320 + idx * 96;
        roundRectPath(ctx, drawerX + 54, by, 390, 76, 38);
        ctx.fillStyle = btn.bg;
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${btn.label} · ${btn.tag}`, drawerX + 92, by + 47);
      });

      drawTouchCursor(
        ctx,
        drawerX + 360,
        1216,
        p > 0.58 && p < 0.72,
        "Gửi giữ chỗ & Đồng bộ về Admin"
      );
    }

    // =========================================================================
    // TOP REELS STORY PROGRESS BAR + FEATURE CALLOUT BANNER
    // =========================================================================
    ctx.fillStyle = "#141b15";
    ctx.fillRect(0, 0, CANVAS_W, 148);

    const barGap = 12;
    const totalBars = REEL_FEATURE_STEPS.length;
    const barW =
      (CANVAS_W - 80 - barGap * (totalBars - 1)) / totalBars;

    for (let i = 0; i < totalBars; i++) {
      const bx = 40 + i * (barW + barGap);
      roundRectPath(ctx, bx, 22, barW, 8, 4);
      ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
      ctx.fill();

      let fillRatio = 0;
      if (i < stepIdx) fillRatio = 1;
      else if (i === stepIdx) fillRatio = p;

      if (fillRatio > 0) {
        roundRectPath(ctx, bx, 22, barW * fillRatio, 8, 4);
        ctx.fillStyle = "#e5b96f";
        ctx.fill();
      }
    }

    ctx.fillStyle = "#e5b96f";
    ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(stepSpec.badge, 40, 72);

    ctx.fillStyle = "#ffffff";
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(stepSpec.title, 40, 114);

    // =========================================================================
    // BOTTOM WEBSITE FOOTER BAR IN REEL
    // =========================================================================
    ctx.fillStyle = "#141b15";
    ctx.fillRect(0, CANVAS_H - 135, CANVAS_W, 135);
    ctx.strokeStyle = "rgba(229, 185, 111, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_H - 135);
    ctx.lineTo(CANVAS_W, CANVAS_H - 135);
    ctx.stroke();

    ctx.fillStyle = "#e5b96f";
    ctx.font = '700 26px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(
      `${settings.brandName} · Trải nghiệm trực tiếp trên Website`,
      48,
      CANVAS_H - 80
    );

    ctx.fillStyle = "rgba(244, 242, 238, 0.85)";
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Hotline: ${settings.hotlineDisplay} · ${settings.email}`,
      48,
      CANVAS_H - 36
    );
  };

  // Run preview animation loop when stageMode === "canvas-render"
  useEffect(() => {
    if (stageMode !== "canvas-render" || isRecording) return;
    let rafId: number;
    const baseStartOffset = REEL_FEATURE_STEPS.slice(0, activeStepIndex).reduce(
      (a, b) => a + b.durationMs,
      0
    );
    const startPerf = performance.now() - baseStartOffset / speedScale;

    const loop = (now: number) => {
      const baseElapsed = isPlaying
        ? ((now - startPerf) * speedScale) % TOTAL_REEL_MS
        : baseStartOffset;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          renderWebsiteFeatureFrame(ctx, baseElapsed);
        }
      }
      if (isPlaying) {
        let acc = 0;
        for (let i = 0; i < REEL_FEATURE_STEPS.length; i++) {
          if (baseElapsed < acc + REEL_FEATURE_STEPS[i].durationMs) {
            if (i !== activeStepIndex) setActiveStepIndex(i);
            break;
          }
          acc += REEL_FEATURE_STEPS[i].durationMs;
        }
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stageMode,
    isPlaying,
    activeStepIndex,
    isRecording,
    speedScale,
    tours,
    media,
    journal,
  ]);

  // Create Web Audio ambient soundtrack stream for video export
  const createAmbientSoundtrack = (ctx: AudioContext) => {
    const dest = ctx.createMediaStreamDestination();
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(dest);
    if (soundEnabled) {
      master.connect(ctx.destination);
    }

    const chordNotes = [220, 261.63, 329.63, 392.0, 440, 523.25];
    chordNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.value = 0.045 / (i + 1);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
    });

    return dest.stream;
  };

  const handleSelectFeatureStep = (idx: number) => {
    setActiveStepIndex(idx);
    setIsPlaying(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "NEP_REEL_JUMP", stepIndex: idx },
        "*"
      );
    }
  };

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "NEP_REEL_TOGGLE_PLAY", playing: next },
        "*"
      );
    }
  };

  const handleRestartReel = () => {
    setActiveStepIndex(0);
    setIsPlaying(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "NEP_REEL_RESTART" },
        "*"
      );
    }
  };

  const handleChangeSpeed = (nextSpeed: number) => {
    setSpeedScale(nextSpeed);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "NEP_REEL_SPEED", speed: nextSpeed },
        "*"
      );
    }
  };

  // ===========================================================================
  // EXPORT MODE 1: 1-CLICK 1080x1920 VIDEO EXPORT OF ALL 7 WEBSITE FEATURES
  // ===========================================================================
  const handleExportFeatureReelVideo = async () => {
    if (isRecording) return;
    setStageMode("canvas-render");
    setIsRecording(true);
    setRecordProgress(0);
    setRecordStatusText("Đang khởi tạo trình ghi hình 1080×1920 (60fps)...");

    await new Promise((r) => setTimeout(r, 120));
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsRecording(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsRecording(false);
      return;
    }

    let audioCtx: AudioContext | null = null;
    const combinedTracks: MediaStreamTrack[] = [];
    const canvasStream = canvas.captureStream(60);
    canvasStream.getVideoTracks().forEach((t) => combinedTracks.push(t));

    try {
      audioCtx = new AudioContext();
      const audioStream = createAmbientSoundtrack(audioCtx);
      audioStream.getAudioTracks().forEach((t) => combinedTracks.push(t));
    } catch {}

    const mixedStream = new MediaStream(combinedTracks);
    const mimeCandidates = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    const mimeType =
      mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

    const recorder = new MediaRecorder(
      mixedStream,
      mimeType
        ? { mimeType, videoBitsPerSecond: 10_000_000 }
        : { videoBitsPerSecond: 10_000_000 }
    );

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };

    recorder.onstop = () => {
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nep-journeys-7-tinh-nang-web-reels.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setIsRecording(false);
      setRecordProgress(100);
      setRecordStatusText(
        `Đã tải xuống nep-journeys-7-tinh-nang-web-reels.${ext} thành công!`
      );
    };

    recorder.start(200);
    const startRec = performance.now();

    const recordTick = (now: number) => {
      const realElapsed = now - startRec;
      const baseElapsed = realElapsed * speedScale;
      const pct = Math.min(100, Math.round((baseElapsed / TOTAL_REEL_MS) * 100));
      setRecordProgress(pct);

      let acc = 0;
      for (let i = 0; i < REEL_FEATURE_STEPS.length; i++) {
        if (baseElapsed < acc + REEL_FEATURE_STEPS[i].durationMs) {
          setActiveStepIndex(i);
          setRecordStatusText(
            `Đang quay ${REEL_FEATURE_STEPS[i].badge}: ${REEL_FEATURE_STEPS[i].title} (${pct}%)`
          );
          break;
        }
        acc += REEL_FEATURE_STEPS[i].durationMs;
      }

      renderWebsiteFeatureFrame(ctx, Math.min(baseElapsed, TOTAL_REEL_MS - 1));

      if (baseElapsed < TOTAL_REEL_MS) {
        requestAnimationFrame(recordTick);
      } else {
        recorder.stop();
      }
    };

    requestAnimationFrame(recordTick);
  };

  // ===========================================================================
  // EXPORT MODE 2: LIVE TAB DOM CAPTURE (RECORDS THE REAL IFRAME IN 9:16)
  // ===========================================================================
  const handleRecordLiveDomViewport = async () => {
    if (isRecording) return;
    setStageMode("live-dom");
    await new Promise((r) => setTimeout(r, 150));

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 60,
        },
        audio: false,
        // @ts-expect-error preferCurrentTab is supported in Chromium browsers
        preferCurrentTab: true,
      });

      const videoEl = document.createElement("video");
      videoEl.srcObject = displayStream;
      videoEl.muted = true;
      await videoEl.play();

      const offCanvas = document.createElement("canvas");
      offCanvas.width = CANVAS_W;
      offCanvas.height = CANVAS_H;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) {
        displayStream.getTracks().forEach((t) => t.stop());
        return;
      }

      setIsRecording(true);
      setRecordProgress(0);
      handleRestartReel();

      let audioCtx: AudioContext | null = null;
      const tracks: MediaStreamTrack[] = [];
      offCanvas
        .captureStream(60)
        .getVideoTracks()
        .forEach((t) => tracks.push(t));

      try {
        audioCtx = new AudioContext();
        createAmbientSoundtrack(audioCtx)
          .getAudioTracks()
          .forEach((t) => tracks.push(t));
      } catch {}

      const mimeCandidates = [
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm",
      ];
      const mimeType =
        mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const recorder = new MediaRecorder(
        new MediaStream(tracks),
        mimeType
          ? { mimeType, videoBitsPerSecond: 10_000_000 }
          : { videoBitsPerSecond: 10_000_000 }
      );
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        displayStream.getTracks().forEach((t) => t.stop());
        if (audioCtx) audioCtx.close().catch(() => {});
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunks, { type: mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nep-journeys-live-web-reels.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        setIsRecording(false);
        setRecordProgress(100);
        setRecordStatusText(
          `Đã quay và tải xuống nep-journeys-live-web-reels.${ext}!`
        );
      };

      recorder.start(200);
      const startTime = performance.now();

      const drawLiveCrop = (now: number) => {
        const elapsed = now - startTime;
        const pct = Math.min(
          100,
          Math.round((elapsed / effectiveTotalMs) * 100)
        );
        setRecordProgress(pct);
        setRecordStatusText(
          `Đang quay trực tiếp màn hình Web thật 9:16 (${pct}%)...`
        );

        const vpEl = phoneViewportRef.current;
        if (vpEl && videoEl.videoWidth > 0) {
          const rect = vpEl.getBoundingClientRect();
          const scaleX = videoEl.videoWidth / window.innerWidth;
          const scaleY = videoEl.videoHeight / window.innerHeight;
          const sx = Math.max(0, rect.left * scaleX);
          const sy = Math.max(0, rect.top * scaleY);
          const sw = Math.min(videoEl.videoWidth - sx, rect.width * scaleX);
          const sh = Math.min(videoEl.videoHeight - sy, rect.height * scaleY);

          offCtx.drawImage(
            videoEl,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            CANVAS_W,
            CANVAS_H
          );
        }

        if (elapsed < effectiveTotalMs) {
          requestAnimationFrame(drawLiveCrop);
        } else {
          recorder.stop();
        }
      };

      requestAnimationFrame(drawLiveCrop);
    } catch {
      setRecordStatusText(
        "Đã hủy cấp quyền quay màn hình — bạn có thể bấm nút 'Tải Ngay Video Reels 1080×1920' kế bên mà không cần cấp quyền."
      );
    }
  };

  const fbCaption = `🌿 TRẢI NGHIỆM TRỰC TIẾP CÁC TÍNH NĂNG TRÊN WEBSITE ${settings.brandName.toUpperCase()}

Khám phá và đặt giữ chỗ hành trình văn hóa Bắc · Trung · Nam chỉ trong vài chạm ngay trên nền tảng web của Nếp Journeys:

✨ 01. Hero Slider toàn màn hình 100vh: Chiêm ngưỡng sắc màu Hà Giang, Ninh Bình, Hội An, Phú Quốc.
🧭 02. Bộ lọc Hành trình 3 Miền: Tra cứu nhanh các tuyến Miền Bắc · Miền Trung · Miền Nam.
🧮 03. Popup Chi Tiết & Tính Giá Tự Động: Xem lịch trình từng ngày, bấm tăng/giảm số khách để tự động nhân tổng chi phí minh bạch.
🍂 04. La Bàn Mùa Đẹp 12 Tháng: Gợi ý vùng đất, nhiệt độ và thời tiết lý tưởng nhất theo từng mùa Xuân · Hạ · Thu · Đông.
📸 05. Thư Viện Ảnh Di Sản & Lightbox: Xem ảnh thực địa kèm khung giờ vắng khách nhất.
📖 06. Nhật Ký Du Khảo: Đọc ký sự văn hóa, kiến trúc và ẩm thực bản địa.
⚡ 07. Ngăn Kéo Giữ Chỗ Nhanh & Kết Nối Zalo/Messenger: Đồng bộ dữ liệu trực tiếp với hệ thống Quản trị viên.

📞 Hotline / Zalo: ${settings.hotlineDisplay}
📍 Văn phòng: ${settings.address}

#NepJourneys #DuLichVanHoa #DuLichVietNam #HaGiang #NinhBinh #HoiAn #PhuQuoc #SlowTravelVietnam #FacebookReels`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fbCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2200);
  };

  return (
    <div className={styles.reelsShell}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <BrandLogo variant="light" size="md" />
          <span className={styles.studioBadge}>
            Facebook Reels · Trình diễn 7 tính năng Web thật (9:16)
          </span>
        </div>

        <div className={styles.topBarActions}>
          <Link href="/" className={styles.backLink}>
            <FiArrowLeft size={15} />
            <span>Về Trang Chủ</span>
          </Link>
          <Link href="/admin" className={styles.backLink}>
            <span>Trang Quản Trị (Admin)</span>
          </Link>
        </div>
      </header>

      <div className={styles.workspaceGrid}>
        {/* Left Column: 9:16 Vertical Phone Stage */}
        <div className={styles.stageColumn}>
          <div className={styles.stageModeSwitch}>
            <button
              type="button"
              className={`${styles.stageModeBtn} ${
                stageMode === "live-dom" ? styles.stageModeBtnActive : ""
              }`}
              onClick={() => setStageMode("live-dom")}
              disabled={isRecording}
            >
              Web Thật Chạy Tự Động (DOM)
            </button>
            <button
              type="button"
              className={`${styles.stageModeBtn} ${
                stageMode === "canvas-render" ? styles.stageModeBtnActive : ""
              }`}
              onClick={() => setStageMode("canvas-render")}
              disabled={isRecording}
            >
              Bản Xuất Video 1080×1920
            </button>
          </div>

          <div className={styles.phoneFrame}>
            {isRecording && (
              <div className={styles.recordingPill}>
                <span className={styles.recDot} />
                <span>REC {recordProgress}%</span>
              </div>
            )}

            <div ref={phoneViewportRef} className={styles.canvasViewport}>
              <iframe
                ref={iframeRef}
                src="/?reel_demo=1"
                title="Nếp Journeys Live Website Reels Demo"
                className={styles.liveIframe}
                style={{
                  display: stageMode === "live-dom" ? "block" : "none",
                }}
              />
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className={styles.reelCanvas}
                style={{
                  display: stageMode === "canvas-render" ? "block" : "none",
                }}
              />
            </div>
          </div>

          <div className={styles.playerControls}>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={handleTogglePlay}
              disabled={isRecording}
            >
              <span style={{ display: "inline-flex" }}>
                {isPlaying ? <FiPause size={14} /> : <FiPlay size={14} />}
              </span>
              <span>{isPlaying ? "Tạm dừng" : "Phát tiếp"}</span>
            </button>

            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={handleRestartReel}
              disabled={isRecording}
            >
              <span style={{ display: "inline-flex" }}>
                <FiRefreshCw size={14} />
              </span>
              <span>Chạy lại</span>
            </button>

            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={() =>
                handleChangeSpeed(
                  speedScale === 1 ? 0.78 : speedScale === 0.78 ? 1.25 : 1
                )
              }
              disabled={isRecording}
              title="Đổi tốc độ thao tác tự động"
            >
              <span>
                {speedScale === 0.78
                  ? "Nhịp: Rất chậm"
                  : speedScale === 1
                  ? "Nhịp: Chậm rãi"
                  : "Nhịp: Vừa"}
              </span>
            </button>

            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={() => setSoundEnabled((prev) => !prev)}
            >
              <span style={{ display: "inline-flex" }}>
                {soundEnabled ? (
                  <FiVolume2 size={14} />
                ) : (
                  <FiVolumeX size={14} />
                )}
              </span>
            </button>

            <span className={styles.timeReadout}>
              {`0${activeStepIndex + 1}/0${REEL_FEATURE_STEPS.length} · ${Math.round(
                effectiveTotalMs / 1000
              )}s`}
            </span>
          </div>
        </div>

        {/* Right Column: Export Video + 7 Real Website Features Interactive Script */}
        <div className={styles.configColumn}>
          <section className={styles.panel}>
            <h1 className={styles.panelHeading}>
              Xuất Video Facebook Reels Dựa Trực Tiếp Trên Các Tính Năng Website
            </h1>
            <p className={styles.panelDesc}>
              Khung điện thoại bên trái đang chạy trực tiếp giao diện thật của
              website <strong>Nếp Journeys</strong> với nhịp thao tác chậm rãi,
              mượt mà qua đủ <strong>7 tính năng tương tác thực tế</strong>{" "}
              (chuyển slide 100vh, bấm lọc vùng miền, mở popup tour và bấm nút{" "}
              <code>+</code> tăng số khách để tự động nhân tổng giá tiền, đổi
              mùa trên La Bàn Mùa Đẹp, mở Lightbox ảnh, đọc Nhật ký và trượt
              ngăn kéo giữ chỗ). Bạn cũng có thể bấm nút{" "}
              <strong>Nhịp: Chậm rãi / Rất chậm</strong> dưới khung điện thoại để
              tùy chỉnh tốc độ.
            </p>

            <div className={styles.exportRow}>
              <button
                type="button"
                className={styles.exportPrimaryBtn}
                onClick={handleExportFeatureReelVideo}
                disabled={isRecording}
              >
                <FiDownload size={17} />
                <span>
                  {isRecording
                    ? `Đang xuất Video (${recordProgress}%)...`
                    : "Tải Ngay Video Reels 1080×1920 (Đủ 7 Tính Năng Web)"}
                </span>
              </button>

              <button
                type="button"
                className={styles.exportSecondaryBtn}
                onClick={handleRecordLiveDomViewport}
                disabled={isRecording}
              >
                <FiVideo size={17} />
                <span>Quay Trực Tiếp Khung Web Thật (Live Tab 9:16)</span>
              </button>

              {(isRecording || recordStatusText) && (
                <div className={styles.progressWrap}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${recordProgress}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>{recordStatusText}</span>
                </div>
              )}
            </div>

            <div className={styles.specBadges}>
              <span className={styles.specBadge}>
                Chuẩn Facebook & Instagram Reels 9:16 (1080×1920)
              </span>
              <span className={styles.specBadge}>
                Nhịp thao tác chậm rãi ({Math.round(effectiveTotalMs / 1000)} giây)
              </span>
              <span className={styles.specBadge}>
                Đồng bộ dữ liệu thật từ Admin CMS
              </span>
              <span className={styles.specBadge}>
                60fps + Nhạc nền Ambient
              </span>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelHeading}>
              Kịch Bản 7 Tính Năng Website Trong Video (Bấm Để Xem Trực Tiếp)
            </h2>
            <p className={styles.panelDesc}>
              Bấm vào bất kỳ tính năng nào bên dưới để khung điện thoại 9:16 tự
              động cuộn tới và thao tác trực tiếp tính năng đó ngay trên web:
            </p>

            <div className={styles.sceneList}>
              {REEL_FEATURE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.sceneBtn} ${
                    activeStepIndex === idx ? styles.sceneBtnActive : ""
                  }`}
                  onClick={() => handleSelectFeatureStep(idx)}
                  disabled={isRecording}
                >
                  <div className={styles.sceneInfo}>
                    <div className={styles.sceneTitleLine}>
                      <span className={styles.sceneNum}>{step.badge}</span>
                      {step.title}
                    </div>
                    <div className={styles.sceneDescText}>{step.desc}</div>
                  </div>
                  <span className={styles.sceneDurationTag}>
                    {(step.durationMs / speedScale / 1000).toFixed(1)}s
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.captionHeader}>
              <div>
                <h2 className={styles.panelHeading} style={{ marginBottom: 2 }}>
                  Caption Đăng Facebook Reels Giới Thiệu Tính Năng Web
                </h2>
                <p className={styles.panelDesc} style={{ marginBottom: 0 }}>
                  Nội dung bài đăng liệt kê trọn bộ 7 tính năng tương tác kèm
                  Hotline và địa chỉ thật từ cài đặt Admin.
                </p>
              </div>

              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyCaption}
              >
                <span style={{ display: "inline-flex" }}>
                  {copiedCaption ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </span>
                <span>
                  {copiedCaption ? "Đã sao chép!" : "Sao chép Caption"}
                </span>
              </button>
            </div>

            <textarea
              readOnly
              className={styles.captionBox}
              value={fbCaption}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
