/* cspell:disable */
"use client";

import React, { useEffect, useRef } from "react";
import { CharmType } from "@/data/gemstones";
import { drawCard3DFrame } from "@/lib/bracelet3dEngine";

interface BraceletCard3DProps {
  stoneKey: string;
  beadCount: number;
  beadMm?: number;
  beadSizeMm?: number;
  charmType?: CharmType | string;
  cardRef?: React.RefObject<HTMLElement | null>;
}

export default function BraceletCard3D({
  stoneKey,
  beadCount,
  beadMm,
  beadSizeMm,
  charmType = "tyhuu",
  cardRef,
}: BraceletCard3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resolvedBeadMm = beadMm ?? beadSizeMm ?? 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const baseRotX = -0.34;
    const baseRotY = 0.08;
    const baseRotZ = 0;

    const config = {
      stoneKey,
      beadCount,
      beadMm: resolvedBeadMm,
      charmType,
    };
    drawCard3DFrame(canvas, config, baseRotX, baseRotY, baseRotZ);

    const cardEl =
      cardRef?.current ||
      (canvas.closest(".product-card") as HTMLElement | null) ||
      canvas.parentElement;
    if (!cardEl) return;

    let rafId: number | null = null;
    let isHovered = false;
    let rotX = baseRotX;
    let rotY = baseRotY;
    let rotZ = baseRotZ;
    let targetRotX = baseRotX;
    let targetRotY = baseRotY;
    let targetRotZ = baseRotZ;

    const step = () => {
      if (!isHovered || !canvas.isConnected) return;
      targetRotZ -= 0.0045;
      rotX += (targetRotX - rotX) * 0.12;
      rotY += (targetRotY - rotY) * 0.12;
      rotZ += (targetRotZ - rotZ) * 0.12;
      drawCard3DFrame(canvas, config, rotX, rotY, rotZ);
      rafId = requestAnimationFrame(step);
    };

    const onPointerEnter = () => {
      isHovered = true;
      rotX = baseRotX;
      rotY = baseRotY;
      rotZ = baseRotZ;
      targetRotX = baseRotX;
      targetRotY = baseRotY;
      targetRotZ = baseRotZ;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = cardEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetRotX = baseRotX + ny * 0.36;
      targetRotY = baseRotY + nx * 0.44;
      cardEl.style.setProperty("--card-tilt-x", `${(-ny * 5.5).toFixed(2)}deg`);
      cardEl.style.setProperty("--card-tilt-y", `${(nx * 6.5).toFixed(2)}deg`);
      cardEl.style.setProperty(
        "--glare-x",
        `${((nx + 0.5) * 100).toFixed(1)}%`
      );
      cardEl.style.setProperty(
        "--glare-y",
        `${((ny + 0.5) * 100).toFixed(1)}%`
      );
    };

    const onPointerLeave = () => {
      isHovered = false;
      cardEl.style.setProperty("--card-tilt-x", "0deg");
      cardEl.style.setProperty("--card-tilt-y", "0deg");
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawCard3DFrame(canvas, config, baseRotX, baseRotY, baseRotZ);
    };

    cardEl.addEventListener("pointerenter", onPointerEnter);
    cardEl.addEventListener("pointermove", onPointerMove);
    cardEl.addEventListener("pointerleave", onPointerLeave);

    return () => {
      isHovered = false;
      if (rafId) cancelAnimationFrame(rafId);
      cardEl.removeEventListener("pointerenter", onPointerEnter);
      cardEl.removeEventListener("pointermove", onPointerMove);
      cardEl.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [stoneKey, beadCount, resolvedBeadMm, charmType, cardRef]);

  return (
    <canvas
      ref={canvasRef}
      className="card-3d-canvas"
      width={440}
      height={440}
    />
  );
}
