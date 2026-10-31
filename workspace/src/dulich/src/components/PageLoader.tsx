"use client";

import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";
import { useLocale } from "./LocaleProvider";

const HERITAGE_WAYPOINTS = [
  {
    num: "01",
    regionVi: "Miền Bắc · Cao nguyên đá Đồng Văn",
    regionEn: "North · Dong Van Karst Plateau",
    coord: "23°16'N 105°21'E · HÀ GIANG",
    statusVi: "Đang mở bản đồ địa chất & nếp nhà vùng cao...",
    statusEn: "Mapping northern limestone valleys & mountain hamlets...",
  },
  {
    num: "02",
    regionVi: "Miền Trung · Cố đô Huế & Hội An",
    regionEn: "Central · Imperial Hue & Hoi An",
    coord: "16°27'N 107°34'E · THỪA THIÊN HUẾ",
    statusVi: "Đang tải tư liệu di sản cố đô & đầm phá Tam Giang...",
    statusEn: "Loading imperial garden houses & lagoon routes...",
  },
  {
    num: "03",
    regionVi: "Nam Bộ · Rừng nguyên sinh Phú Quốc",
    regionEn: "South · Phu Quoc Primary Coast",
    coord: "10°13'N 103°57'E · ĐẢO PHÚ QUỐC",
    statusVi: "Sẵn sàng khởi hành cùng Nếp Journeys",
    statusEn: "Ready for departure with Nếp Journeys",
  },
];

export default function PageLoader() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const isReelDemo = params.get("reel_demo") === "1";

    // Calm, deliberate milestones instead of 60fps rapid digit flickering
    const milestones = [0, 12, 24, 38, 52, 66, 78, 89, 96, 100];
    const stepInterval = isReelDemo ? 95 : 185;
    let stepIndex = 0;
    let exitTimer = 0;
    let doneTimer = 0;

    const intervalId = window.setInterval(() => {
      stepIndex += 1;
      if (stepIndex < milestones.length) {
        setProgress(milestones[stepIndex]);
      } else {
        window.clearInterval(intervalId);
        setProgress(100);
        exitTimer = window.setTimeout(() => {
          setPhase("exiting");
        }, 240);
        doneTimer = window.setTimeout(() => {
          setPhase("done");
        }, 1100);
      }
    }, stepInterval);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = () => {
    setProgress(100);
    setPhase("exiting");
    window.setTimeout(() => {
      setPhase("done");
    }, 850);
  };

  const activeWaypointIndex =
    progress < 36 ? 0 : progress < 74 ? 1 : 2;
  const activeWaypoint = HERITAGE_WAYPOINTS[activeWaypointIndex];

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  const backdropClass =
    phase === "loading"
      ? styles.loaderBackdrop
      : phase === "exiting"
        ? `${styles.loaderBackdrop} ${styles.loaderExiting}`
        : `${styles.loaderBackdrop} ${styles.loaderHidden}`;

  return (
    <div
      className={backdropClass}
      role="status"
      aria-live="polite"
      aria-hidden={phase !== "loading"}
    >
      <div className={styles.gridLines} aria-hidden="true" />
      <div className={styles.meridianCircle} aria-hidden="true" />

      {/* Thanh thông tin tọa độ trên cùng */}
      <div className={styles.topBar}>
        <span className={styles.archiveTag}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span>
            {isEn
              ? "NẾP JOURNEYS · HERITAGE ARCHIVE"
              : "NẾP JOURNEYS · ẤN PHẨM DU KHẢO DI SẢN"}
          </span>
        </span>
        <span className={styles.coordTicker}>{activeWaypoint.coord}</span>
      </div>

      {/* Tâm điểm biểu trưng Nếp & 3 miền di sản */}
      <div className={styles.centerStage}>
        <div className={styles.sealWrapper} aria-hidden="true">
          <svg
            className={styles.ringSvg}
            viewBox="0 0 108 108"
            aria-hidden="true"
          >
            <circle
              className={styles.ringTrack}
              cx="54"
              cy="54"
              r={radius}
            />
            <circle
              className={styles.ringFill}
              cx="54"
              cy="54"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.emblemSvg}
          >
            <rect width="64" height="64" rx="14" fill="#182019" />
            <rect
              x="4.5"
              y="4.5"
              width="55"
              height="55"
              rx="10.5"
              stroke="#D7D2CA"
              strokeOpacity="0.36"
              strokeWidth="1.2"
            />
            <circle cx="43" cy="19" r="5.5" fill="#C8A97E" fillOpacity="0.92" />
            <path
              d="M10 46L21.5 29.5L30.5 39.5L40.5 26.5L54 46H10Z"
              fill="#2E4231"
            />
            <path
              d="M19 46V21.5C19 20.4 20.3 19.8 21.1 20.6L42.9 42.4C43.7 43.2 45 42.6 45 41.5V18"
              stroke="#EEECEA"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27.5 16.5L32 12.2L36.5 16.5"
              stroke="#C8A97E"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 51.5C20.5 49.3 26.5 49.3 32 51.5C37.5 53.7 43.5 53.7 49 51.5"
              stroke="#C8A97E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={styles.regionPill}>
          <span>{isEn ? "SLOW CULTURAL TRAVEL" : "DU LỊCH VĂN HÓA CHẬM"}</span>
          <span aria-hidden="true">·</span>
          <span>{isEn ? "NORTH · CENTRAL · SOUTH" : "BẮC · TRUNG · NAM"}</span>
        </div>

        <h1 className={styles.brandHeading}>
          Nếp<em>Journeys</em>
        </h1>

        <p className={styles.tagline}>
          {isEn
            ? "Private journeys crafted at an unhurried pace across Vietnam’s living heritage."
            : "Những hành trình riêng tư, chậm rãi và giàu bản sắc đi qua ba miền di sản Việt Nam."}
        </p>

        <div className={styles.destinationSteps} aria-hidden="true">
          {HERITAGE_WAYPOINTS.map((wp, idx) => {
            const active = idx <= activeWaypointIndex;
            return (
              <span
                key={wp.num}
                className={`${styles.stepItem} ${
                  active ? styles.stepItemActive : ""
                }`}
              >
                <span className={styles.stepNum}>{wp.num}</span>
                <span>{isEn ? wp.regionEn : wp.regionVi}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Thanh trạng thái & bộ đếm phần trăm dưới cùng */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomMeta}>
          <div className={styles.statusColumn}>
            <span className={styles.statusLabel}>
              {isEn ? activeWaypoint.statusEn : activeWaypoint.statusVi}
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className={styles.skipBtn}
            >
              {isEn ? "Skip intro →" : "Bỏ qua màn hình chào →"}
            </button>
          </div>

          <div className={styles.counterValue}>
            {String(progress).padStart(2, "0")}
            <span className={styles.counterUnit}>%</span>
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
