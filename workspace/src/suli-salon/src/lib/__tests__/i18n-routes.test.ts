import { describe, it, expect } from "vitest";
import {
  getLocalizedPath,
  getLocalizedPostPath,
  getRouteFromSegments,
  getEquivalentPath,
  getLegacyPath,
  getLocalizedText,
  getLocalizedPrice,
  getLocalizedContent,
} from "../i18n/routes";

describe("i18n/routes.ts - Bilingual Route and Text Resolution", () => {
  describe("getLocalizedPath", () => {
    it("should return correct Vietnamese paths", () => {
      expect(getLocalizedPath("vi", "home")).toBe("/vi");
      expect(getLocalizedPath("vi", "services")).toBe("/vi/dich-vu");
      expect(getLocalizedPath("vi", "gallery")).toBe("/vi/bo-suu-tap");
      expect(getLocalizedPath("vi", "about")).toBe("/vi/gioi-thieu");
      expect(getLocalizedPath("vi", "contact")).toBe("/vi/lien-he");
      expect(getLocalizedPath("vi", "booking")).toBe("/vi/dat-lich");
      expect(getLocalizedPath("vi", "posts")).toBe("/vi/bai-viet");
    });

    it("should return correct English paths", () => {
      expect(getLocalizedPath("en", "home")).toBe("/en");
      expect(getLocalizedPath("en", "services")).toBe("/en/services");
      expect(getLocalizedPath("en", "gallery")).toBe("/en/gallery");
      expect(getLocalizedPath("en", "about")).toBe("/en/about");
      expect(getLocalizedPath("en", "contact")).toBe("/en/contact");
      expect(getLocalizedPath("en", "booking")).toBe("/en/booking");
      expect(getLocalizedPath("en", "posts")).toBe("/en/journal");
    });

    it("should append suffix correctly", () => {
      expect(getLocalizedPath("vi", "services", "son-gel-cao-cap")).toBe("/vi/dich-vu/son-gel-cao-cap");
      expect(getLocalizedPath("en", "posts", "summer-trends")).toBe("/en/journal/summer-trends");
      // Leading slash in suffix
      expect(getLocalizedPath("vi", "posts", "/top-5-mau-nail")).toBe("/vi/bai-viet/top-5-mau-nail");
    });
  });

  describe("getLocalizedPostPath", () => {
    it("should generate proper article path for each language", () => {
      expect(getLocalizedPostPath("vi", "xu-huong-mong-2025")).toBe("/vi/bai-viet/xu-huong-mong-2025");
      expect(getLocalizedPostPath("en", "trending-nails-2025")).toBe("/en/journal/trending-nails-2025");
    });
  });

  describe("getRouteFromSegments", () => {
    it("should identify home route for empty segments", () => {
      expect(getRouteFromSegments("vi", [])).toBe("home");
      expect(getRouteFromSegments("en", [])).toBe("home");
    });

    it("should identify public routes from url segments", () => {
      expect(getRouteFromSegments("vi", ["dich-vu"])).toBe("services");
      expect(getRouteFromSegments("en", ["services"])).toBe("services");
      expect(getRouteFromSegments("vi", ["dat-lich"])).toBe("booking");
      expect(getRouteFromSegments("en", ["journal"])).toBe("posts");
    });

    it("should identify single post route when secondary segment exists", () => {
      expect(getRouteFromSegments("vi", ["bai-viet", "bai-so-1"])).toBe("post");
      expect(getRouteFromSegments("en", ["journal", "post-1"])).toBe("post");
    });

    it("should return null for invalid or overlong segments", () => {
      expect(getRouteFromSegments("vi", ["khong-ton-tai"])).toBeNull();
      expect(getRouteFromSegments("vi", ["dich-vu", "sub", "extra"])).toBeNull();
    });
  });

  describe("getEquivalentPath", () => {
    it("should convert Vietnamese path to corresponding English path", () => {
      expect(getEquivalentPath("en", "/vi/dich-vu")).toBe("/en/services");
      expect(getEquivalentPath("en", "/vi/dat-lich")).toBe("/en/booking");
      expect(getEquivalentPath("en", "/vi/bai-viet/xu-huong-2025")).toBe("/en/journal/xu-huong-2025");
    });

    it("should convert English path to corresponding Vietnamese path", () => {
      expect(getEquivalentPath("vi", "/en/services")).toBe("/vi/dich-vu");
      expect(getEquivalentPath("vi", "/en/journal")).toBe("/vi/bai-viet");
      expect(getEquivalentPath("vi", "/en/journal/summer-trends")).toBe("/vi/bai-viet/summer-trends");
    });

    it("should fallback to home for malformed or unknown paths", () => {
      expect(getEquivalentPath("en", "/invalid-path")).toBe("/en");
      expect(getEquivalentPath("vi", "/vi/unknown-segment")).toBe("/vi");
    });
  });

  describe("getLegacyPath", () => {
    it("should map legacy un-prefixed paths to localized paths", () => {
      expect(getLegacyPath("vi", "/")).toBe("/vi");
      expect(getLegacyPath("en", "/")).toBe("/en");
      expect(getLegacyPath("vi", "/services")).toBe("/vi/dich-vu");
      expect(getLegacyPath("en", "/services")).toBe("/en/services");
      expect(getLegacyPath("vi", "/bai-viet/mau-mong-dep")).toBe("/vi/bai-viet/mau-mong-dep");
      expect(getLegacyPath("en", "/bai-viet/mau-mong-dep")).toBe("/en/journal/mau-mong-dep");
    });

    it("should return null for unmapped legacy routes", () => {
      expect(getLegacyPath("vi", "/admin")).toBeNull();
      expect(getLegacyPath("en", "/unknown")).toBeNull();
    });
  });

  describe("getLocalizedText and getLocalizedPrice", () => {
    it("should separate bilingual string with ' | ' delimiter", () => {
      const text = "Mộc Salon | Moc Salon Official";
      expect(getLocalizedText(text, "vi")).toBe("Mộc Salon");
      expect(getLocalizedText(text, "en")).toBe("Moc Salon Official");

      const price = "350.000 VNĐ | $15 USD";
      expect(getLocalizedPrice(price, "vi")).toBe("350.000 VNĐ");
      expect(getLocalizedPrice(price, "en")).toBe("$15 USD");
    });

    it("should return full string if no delimiter is present", () => {
      expect(getLocalizedText("Móng Tay", "en")).toBe("Móng Tay");
      expect(getLocalizedText("", "vi")).toBe("");
      expect(getLocalizedText(null, "vi")).toBe("");
      expect(getLocalizedText(undefined, "en")).toBe("");
    });
  });

  describe("getLocalizedContent", () => {
    it("should separate rich html with '<!-- bilingual-split -->' comment", () => {
      const content = "<h2>Tiêu đề Tiếng Việt</h2><p>Nội dung</p><!-- bilingual-split --><h2>English Title</h2><p>Content</p>";
      expect(getLocalizedContent(content, "vi")).toBe("<h2>Tiêu đề Tiếng Việt</h2><p>Nội dung</p>");
      expect(getLocalizedContent(content, "en")).toBe("<h2>English Title</h2><p>Content</p>");
    });

    it("should return original content when split comment is missing", () => {
      const simple = "<p>Đơn ngữ</p>";
      expect(getLocalizedContent(simple, "vi")).toBe("<p>Đơn ngữ</p>");
      expect(getLocalizedContent(simple, "en")).toBe("<p>Đơn ngữ</p>");
      expect(getLocalizedContent(null, "vi")).toBe("");
    });
  });
});
