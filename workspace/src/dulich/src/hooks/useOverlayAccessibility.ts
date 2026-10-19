"use client";

import { useEffect, useRef } from "react";
import { useBodyScrollLock } from "./useBodyScrollLock";

/**
 * Provides the shared behavior expected from drawers and modal dialogs:
 * keyboard dismissal, focus placement/restoration, and background scroll lock.
 */
export function useOverlayAccessibility(
  isOpen: boolean,
  onClose: () => void,
  initialFocusSelector: string,
) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const openWithTrigger = (trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
  };

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current ??= document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      document.querySelector<HTMLElement>(initialFocusSelector)?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
  }, [initialFocusSelector, isOpen]);

  return { openWithTrigger };
}
