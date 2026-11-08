/* cspell:disable */
"use client";

import React, { useEffect, useRef } from "react";
import { CharmType } from "@/data/gemstones";
import { AngleMode, Bracelet3DViewer } from "@/lib/bracelet3dEngine";

interface Bracelet3DStageProps {
  stoneKey: string;
  beadCount: number;
  beadMm?: number;
  beadSizeMm?: number;
  charmType?: CharmType | string;
  interactive?: boolean;
  showHint?: boolean;
  className?: string;
  scrollRotDeg?: number;
  angleMode?: AngleMode;
  children?: React.ReactNode;
}

export default function Bracelet3DStage({
  stoneKey,
  beadCount,
  beadMm,
  beadSizeMm,
  charmType = "tyhuu",
  interactive = true,
  showHint = true,
  className = "bracelet-svg-stage",
  scrollRotDeg = 0,
  angleMode = "tilt",
  children,
}: Bracelet3DStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Bracelet3DViewer | null>(null);
  const resolvedBeadMm = beadMm ?? beadSizeMm ?? 10;
  const shouldShowBuiltInHint = showHint && !children;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const viewer = new Bracelet3DViewer(el, {
      stoneKey,
      beadCount,
      beadMm: resolvedBeadMm,
      charmType,
      interactive,
      showHint: shouldShowBuiltInHint,
    });
    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
    // Mount once per stage container; config updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.updateConfig(
      {
        stoneKey,
        beadCount,
        beadMm: resolvedBeadMm,
        charmType,
      },
      true
    );
  }, [stoneKey, beadCount, resolvedBeadMm, charmType]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setScrollRotation(scrollRotDeg);
  }, [scrollRotDeg]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setAngleMode(angleMode);
  }, [angleMode]);

  return (
    <div className={`has-webgl-3d ${className}`.trim()}>
      <div ref={containerRef} className="webgl-canvas-host" />
      {children}
    </div>
  );
}
