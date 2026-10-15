import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnnouncementModal from "../AnnouncementModal";
import type { SiteSettings } from "@/lib/db";

// Mock LocaleProvider
vi.mock("@/components/LocaleProvider", () => ({
  useLocale: () => ({ locale: "vi" }),
}));

// Mock BrandLogo
vi.mock("@/components/BrandLogo", () => ({
  default: () => <div data-testid="brand-logo" />,
}));

const mockBaseSettings: SiteSettings = {
  siteName: "Mộc Salon",
  tagline: "Nghệ thuật móng tinh tế",
  hotline: "0988 123 456",
  hotline2: "",
  phone: "0988 123 456",
  email: "contact@mocsalon.vn",
  address: "123 Phố Huế",
  workingHours: "09:00 - 20:00",
  facebook: "",
  tiktok: "",
  youtube: "",
  zalo: "",
  instagram: "",
  mapEmbedUrl: "",
  mapLat: "",
  mapLng: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  footerTaglines: [],
  copyright: "",
  departureSlots: [],
  bannerImage: "",
  bannerBadge: "",
  bannerTitle: "",
  bannerSubtitle: "",
  bannerCta1Text: "",
  bannerCta1Link: "",
  bannerCta2Text: "",
  bannerCta2Link: "",
  bannerStats: [],
  aboutHeadline: "",
  aboutSubheadline: "",
  aboutImage1: "",
  aboutImage2: "",
  aboutValues: [],
  popupEnabled: true,
  popupLevel: "promo",
  popupBadge: "Ưu Đãi Đặc Biệt",
  popupTitle: "Chào mừng quý khách đến với Mộc Salon",
  popupContent: "Tặng voucher giảm 20% cho khách đặt lịch online",
  popupCtaText: "Đặt lịch ngay",
  popupCtaLink: "/dat-lich",
  popupDismissType: "daily",
};

describe("AnnouncementModal component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not render when popupEnabled is false", () => {
    const settings = { ...mockBaseSettings, popupEnabled: false };
    render(<AnnouncementModal settings={settings} />);

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("should render when popupEnabled is true after timeout delay", () => {
    render(<AnnouncementModal settings={mockBaseSettings} />);

    // Before timer fires, modal is closed
    expect(screen.queryByRole("dialog")).toBeNull();

    // Advance preloader delay (2800ms)
    act(() => {
      vi.advanceTimersByTime(2900);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Chào mừng quý khách đến với Mộc Salon")).toBeInTheDocument();
    expect(screen.getByText("Tặng voucher giảm 20% cho khách đặt lịch online")).toBeInTheDocument();
  });

  it("should close modal when clicking close button and remember dismissal", () => {
    render(<AnnouncementModal settings={mockBaseSettings} />);

    act(() => {
      vi.advanceTimersByTime(2900);
    });

    const closeBtn = screen.getByRole("button", { name: /Đóng thông báo/i });
    act(() => {
      closeBtn.click();
    });

    // Advance close animation (280ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
    // Daily dismissal saved into localStorage
    expect(localStorage.getItem("moc_announcement_dismissed")).not.toBeNull();
  });
});
