"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ReelFeatureStep {
  id: string;
  index: number;
  badge: string;
  title: string;
  desc: string;
  durationMs: number;
}

export const REEL_FEATURE_STEPS: ReelFeatureStep[] = [
  {
    id: "hero-slider",
    index: 0,
    badge: "TÍNH NĂNG 01 / 07",
    title: "Hero Slider 100vh & Đổi Cảnh Trực Tiếp",
    desc: "Slider chiếm trọn màn hình với bộ đếm 01/04, chuyển cảnh mượt mà và thanh điều hướng đổi màu khi cuộn.",
    durationMs: 6800,
  },
  {
    id: "tour-filter",
    index: 1,
    badge: "TÍNH NĂNG 02 / 07",
    title: "Bộ Lọc Hành Trình 3 Miền Bắc · Trung · Nam",
    desc: "Lọc tức thì các tuyến hành trình theo vùng miền kèm số lượng tuyến và thẻ Hành trình Tâm điểm.",
    durationMs: 7500,
  },
  {
    id: "booking-modal",
    index: 2,
    badge: "TÍNH NĂNG 03 / 07",
    title: "Popup Chi Tiết & Tự Động Tính Giá Theo Số Khách",
    desc: "Xem thư viện ảnh tour, lịch trình từng ngày và bấm tăng/giảm số khách để tự động nhân tổng chi phí.",
    durationMs: 9500,
  },
  {
    id: "seasonal-compass",
    index: 3,
    badge: "TÍNH NĂNG 04 / 07",
    title: "La Bàn Mùa Đẹp 12 Tháng Trong Năm",
    desc: "Chọn mùa Xuân · Hạ · Thu · Đông để tra cứu nhiệt độ, thời tiết và tuyến hành trình gợi ý phù hợp nhất.",
    durationMs: 7200,
  },
  {
    id: "destination-gallery",
    index: 4,
    badge: "TÍNH NĂNG 05 / 07",
    title: "Thư Viện Ảnh Di Sản & Lightbox Phóng To",
    desc: "Lọc ảnh thực địa 3 miền và chạm vào ảnh bất kỳ để mở chế độ xem phóng to kèm khung giờ vắng khách.",
    durationMs: 7500,
  },
  {
    id: "journal-reader",
    index: 5,
    badge: "TÍNH NĂNG 06 / 07",
    title: "Nhật Ký Du Khảo & Đọc Ký Sự Ngay Trên Web",
    desc: "Mở bài viết chuyên sâu về văn hóa, kiến trúc và làng nghề với giao diện đọc báo chí sang trọng.",
    durationMs: 6800,
  },
  {
    id: "quick-drawer",
    index: 6,
    badge: "TÍNH NĂNG 07 / 07",
    title: "Ngăn Kéo Đặt Lịch Nhanh & Cụm Nút Nổi Liên Hệ",
    desc: "Trượt ngăn kéo giữ chỗ nhanh từ cạnh phải kết hợp cụm nút nổi Hotline, Zalo, Messenger và Facebook.",
    durationMs: 6700,
  },
];

export const TOTAL_REEL_MS = REEL_FEATURE_STEPS.reduce(
  (acc, s) => acc + s.durationMs,
  0
); // 52,000 ms (52s)

export default function ReelAutoPilot() {
  const [enabled, setEnabled] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedScale, setSpeedScale] = useState(1); // 1 = Chậm rãi mặc định, 0.75 = Rất chậm, 1.35 = Nhanh vừa
  const [cursorPos, setCursorPos] = useState<{
    x: number;
    y: number;
    clicking: boolean;
    visible: boolean;
  }>({
    x: 200,
    y: 360,
    clicking: false,
    visible: false,
  });

  const timeoutsRef = useRef<number[]>([]);
  const stepStartRef = useRef<number>(0);

  const clearScheduled = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  // Scale delay according to speedScale (smaller speedScale = slower)
  const schedule = (fn: () => void, delayMs: number) => {
    const scaledDelay = Math.round(delayMs / speedScale);
    const id = window.setTimeout(fn, scaledDelay);
    timeoutsRef.current.push(id);
  };

  // Gentle, slow scroll to target Y over 950ms
  const slowScrollWindowTo = (targetY: number, duration = 950) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 8) return;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // easeInOutCubic
      const eased =
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const slowScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetY = Math.max(0, window.scrollY + rect.top - 16);
    slowScrollWindowTo(targetY, 1000);
  };

  // Move visual touch cursor slowly to an element, pause so viewer sees it, then click
  const tapElement = (el: HTMLElement | null) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetX = Math.max(
      28,
      Math.min(window.innerWidth - 28, rect.left + rect.width / 2)
    );
    const targetY = Math.max(
      28,
      Math.min(window.innerHeight - 28, rect.top + rect.height / 2)
    );

    setCursorPos({
      x: targetX,
      y: targetY,
      clicking: false,
      visible: true,
    });

    // Wait 680ms for cursor glide to finish before pressing
    schedule(() => {
      setCursorPos((prev) => ({ ...prev, clicking: true }));
      el.click();
    }, 680);

    // Release tap ripple smoothly after 1180ms
    schedule(() => {
      setCursorPos((prev) => ({ ...prev, clicking: false }));
    }, 1180);
  };

  const closeAnyOpenModals = () => {
    const modalClose = document.getElementById(
      "modal-close-button"
    ) as HTMLElement | null;
    if (modalClose) modalClose.click();

    const journalClose = document.getElementById(
      "journal-modal-close"
    ) as HTMLElement | null;
    if (journalClose) journalClose.click();

    const lightboxClose = document.querySelector(
      '#thu-vien-anh [role="dialog"] button[aria-label*="Đóng"], #thu-vien-anh [role="dialog"] button[aria-label*="Close"]'
    ) as HTMLElement | null;
    if (lightboxClose) lightboxClose.click();

    const drawerClose = document.querySelector(
      'aside[role="dialog"] button[aria-label*="Đóng"], aside[role="dialog"] button[aria-label*="Close"]'
    ) as HTMLElement | null;
    if (drawerClose) drawerClose.click();
  };

  // Execute the live DOM choreography for a specific feature step at a calm pace
  const runFeatureChoreography = (idx: number) => {
    clearScheduled();
    closeAnyOpenModals();
    setActiveStepIdx(idx);
    setStepProgress(0);
    stepStartRef.current = performance.now();

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { type: "NEP_REEL_STEP", stepIndex: idx },
        "*"
      );
    }

    if (idx === 0) {
      // STEP 1: HERO SLIDER 100VH (6.8s)
      slowScrollWindowTo(0, 800);
      schedule(() => {
        const sceneTabs = document.querySelectorAll(
          '#top [role="tablist"] [role="tab"]'
        );
        if (sceneTabs[1]) tapElement(sceneTabs[1] as HTMLElement);
      }, 1700);

      schedule(() => {
        const nextBtn = document.querySelector(
          '#top button[aria-label*="tiếp"], #top button[aria-label*="Next"]'
        ) as HTMLElement | null;
        if (nextBtn) tapElement(nextBtn);
      }, 4200);
    } else if (idx === 1) {
      // STEP 2: TOUR FILTER BY REGION (7.5s)
      slowScrollToSection("hanh-trinh");

      schedule(() => {
        const filterBtns = document.querySelectorAll(
          '#hanh-trinh [role="group"] button'
        );
        if (filterBtns[1]) tapElement(filterBtns[1] as HTMLElement); // Miền Bắc
      }, 1700);

      schedule(() => {
        const filterBtns = document.querySelectorAll(
          '#hanh-trinh [role="group"] button'
        );
        if (filterBtns[2]) tapElement(filterBtns[2] as HTMLElement); // Miền Trung
      }, 3900);

      schedule(() => {
        const filterBtns = document.querySelectorAll(
          '#hanh-trinh [role="group"] button'
        );
        if (filterBtns[0]) tapElement(filterBtns[0] as HTMLElement); // Tất cả
      }, 5800);
    } else if (idx === 2) {
      // STEP 3: TOUR BOOKING MODAL & LIVE GUEST PRICE CALCULATOR (9.5s)
      slowScrollToSection("hanh-trinh");

      schedule(() => {
        const firstCardBtn = document.querySelector(
          "#hanh-trinh article button"
        ) as HTMLElement | null;
        if (firstCardBtn) tapElement(firstCardBtn);
      }, 1100);

      // Inside Modal: click next photo in gallery
      schedule(() => {
        const nextPhotoBtn = document.querySelector(
          '[role="dialog"] button[aria-label*="tiếp"], [role="dialog"] button[aria-label*="Next"]'
        ) as HTMLElement | null;
        if (nextPhotoBtn) tapElement(nextPhotoBtn);
      }, 2900);

      // Slowly scroll modal down to the price & guest counter form
      schedule(() => {
        const formEl = document.querySelector(
          '[role="dialog"] form'
        ) as HTMLElement | null;
        if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 4500);

      // Tap "+" guest counter slowly twice so viewer clearly sees VND price multiply
      schedule(() => {
        const plusBtn = document.querySelector(
          '[role="dialog"] button[aria-label*="Tăng"], [role="dialog"] button[aria-label*="Increase"]'
        ) as HTMLElement | null;
        if (plusBtn) tapElement(plusBtn);
      }, 5800);

      schedule(() => {
        const plusBtn = document.querySelector(
          '[role="dialog"] button[aria-label*="Tăng"], [role="dialog"] button[aria-label*="Increase"]'
        ) as HTMLElement | null;
        if (plusBtn) tapElement(plusBtn);
      }, 7500);

      schedule(() => {
        closeAnyOpenModals();
      }, 9000);
    } else if (idx === 3) {
      // STEP 4: SEASONAL COMPASS 12 MONTHS (7.2s)
      slowScrollToSection("la-ban-mua");

      schedule(() => {
        const tabs = document.querySelectorAll(
          '#la-ban-mua [role="tablist"] [role="tab"]'
        );
        if (tabs[1]) tapElement(tabs[1] as HTMLElement); // Mùa Đông
      }, 1900);

      schedule(() => {
        const tabs = document.querySelectorAll(
          '#la-ban-mua [role="tablist"] [role="tab"]'
        );
        if (tabs[2]) tapElement(tabs[2] as HTMLElement); // Mùa Xuân
      }, 4400);
    } else if (idx === 4) {
      // STEP 5: DESTINATION GALLERY & LIGHTBOX (7.5s)
      slowScrollToSection("thu-vien-anh");

      schedule(() => {
        const firstPhoto = document.querySelector(
          "#thu-vien-anh article button"
        ) as HTMLElement | null;
        if (firstPhoto) tapElement(firstPhoto);
      }, 1800);

      schedule(() => {
        const nextImgBtn = document.querySelector(
          '#thu-vien-anh [role="dialog"] button[aria-label*="tiếp"], #thu-vien-anh [role="dialog"] button[aria-label*="Next"]'
        ) as HTMLElement | null;
        if (nextImgBtn) tapElement(nextImgBtn);
      }, 4200);

      schedule(() => {
        closeAnyOpenModals();
      }, 6800);
    } else if (idx === 5) {
      // STEP 6: JOURNAL READER MODAL (6.8s)
      slowScrollToSection("nhat-ky");

      schedule(() => {
        const firstArticle = document.querySelector(
          '#nhat-ky article[role="button"]'
        ) as HTMLElement | null;
        if (firstArticle) tapElement(firstArticle);
      }, 1700);

      schedule(() => {
        const articleDialog = document.querySelector(
          '#nhat-ky [role="dialog"]'
        ) as HTMLElement | null;
        if (articleDialog) {
          articleDialog.scrollTo({ top: 260, behavior: "smooth" });
        }
      }, 3900);

      schedule(() => {
        closeAnyOpenModals();
      }, 6200);
    } else if (idx === 6) {
      // STEP 7: QUICK SLIDE-OUT BOOKING DRAWER & FLOATING CONTACT (6.7s)
      slowScrollToSection("lien-he");

      schedule(() => {
        window.dispatchEvent(new CustomEvent("nep:open-booking"));
      }, 1500);

      schedule(() => {
        const selectEl = document.getElementById(
          "quick-tour"
        ) as HTMLSelectElement | null;
        if (selectEl && selectEl.options.length > 1) {
          selectEl.selectedIndex = 1;
          selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 3600);

      schedule(() => {
        closeAnyOpenModals();
      }, 6100);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reel_demo") === "1") {
      setEnabled(true);
    }
  }, []);

  // Listen for control messages from /reels parent page
  useEffect(() => {
    if (!enabled) return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "NEP_REEL_JUMP") {
        const idx = Number(data.stepIndex) || 0;
        setIsPlaying(true);
        runFeatureChoreography(idx);
      } else if (data.type === "NEP_REEL_TOGGLE_PLAY") {
        setIsPlaying(Boolean(data.playing));
      } else if (data.type === "NEP_REEL_RESTART") {
        setIsPlaying(true);
        runFeatureChoreography(0);
      } else if (data.type === "NEP_REEL_SPEED") {
        const nextSpeed = Number(data.speed) || 1;
        setSpeedScale(nextSpeed);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  });

  // Start initial choreography when enabled
  useEffect(() => {
    if (!enabled) return;
    runFeatureChoreography(0);
    return () => clearScheduled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, speedScale]);

  // Step timer loop
  useEffect(() => {
    if (!enabled || !isPlaying) return;
    let rafId: number;
    const currentSpec =
      REEL_FEATURE_STEPS[activeStepIdx] || REEL_FEATURE_STEPS[0];
    const effectiveDuration = currentSpec.durationMs / speedScale;
    stepStartRef.current =
      performance.now() - stepProgress * effectiveDuration;

    const tick = (now: number) => {
      const elapsed = now - stepStartRef.current;
      const ratio = Math.min(1, elapsed / effectiveDuration);
      setStepProgress(ratio);

      if (elapsed >= effectiveDuration) {
        const nextIdx = (activeStepIdx + 1) % REEL_FEATURE_STEPS.length;
        runFeatureChoreography(nextIdx);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isPlaying, activeStepIdx, speedScale]);

  if (!enabled) return null;

  const currentStep =
    REEL_FEATURE_STEPS[activeStepIdx] || REEL_FEATURE_STEPS[0];

  return (
    <div data-reel-autopilot="true">
      {/* Top Reels Story Progress + Active Website Feature Callout */}
      <div
        style={{
          position: "fixed",
          top: 8,
          left: 10,
          right: 10,
          zIndex: 9998,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${REEL_FEATURE_STEPS.length}, 1fr)`,
            gap: 4,
          }}
        >
          {REEL_FEATURE_STEPS.map((s, idx) => {
            let fill = 0;
            if (idx < activeStepIdx) fill = 100;
            else if (idx === activeStepIdx) fill = Math.round(stepProgress * 100);
            return (
              <div
                key={s.id}
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: "rgba(255, 255, 255, 0.28)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${fill}%`,
                    height: "100%",
                    background: "#e5b96f",
                    transition: "width 120ms linear",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            alignSelf: "flex-start",
            padding: "7px 12px",
            borderRadius: 4,
            background: "rgba(20, 27, 21, 0.9)",
            border: "1px solid rgba(229, 185, 111, 0.55)",
            color: "#f4f2ee",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(8px)",
            maxWidth: "92%",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#e5b96f",
              textTransform: "uppercase",
            }}
          >
            {currentStep.badge}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.25,
              marginTop: 2,
            }}
          >
            {currentStep.title}
          </div>
        </div>
      </div>

      {/* Animated Touch / Click Indicator with slow glide (680ms) */}
      <div
        style={{
          position: "fixed",
          left: cursorPos.x,
          top: cursorPos.y,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: cursorPos.visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${
            cursorPos.clicking ? 0.84 : 1
          })`,
          transition:
            "left 680ms cubic-bezier(0.22, 1, 0.36, 1), top 680ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms ease, opacity 220ms ease",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: cursorPos.clicking
              ? "rgba(229, 185, 111, 0.82)"
              : "rgba(229, 185, 111, 0.38)",
            border: "2.5px solid #e5b96f",
            boxShadow: cursorPos.clicking
              ? "0 0 0 12px rgba(229, 185, 111, 0.25), 0 4px 16px rgba(0, 0, 0, 0.45)"
              : "0 4px 16px rgba(0, 0, 0, 0.45)",
            transition: "all 240ms ease",
          }}
        />
      </div>
    </div>
  );
}
