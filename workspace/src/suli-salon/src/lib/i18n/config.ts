export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_METADATA: Record<Locale, { htmlLang: string; openGraph: string; label: string }> = {
  vi: { htmlLang: "vi", openGraph: "vi_VN", label: "Tiếng Việt" },
  en: { htmlLang: "en", openGraph: "en_US", label: "English" },
};

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const languages = acceptLanguage.toLowerCase().split(",").map((l) => l.trim().split(";")[0]);
  // Nếu có tiếng Việt trong danh sách ưu tiên ngôn ngữ, luôn mặc định là tiếng Việt
  if (languages.some((lang) => lang.startsWith("vi"))) {
    return DEFAULT_LOCALE;
  }
  // Nếu trình duyệt chỉ yêu cầu tiếng Anh và không có tiếng Việt
  if (languages[0] && languages[0].startsWith("en")) {
    return "en";
  }
  return DEFAULT_LOCALE;
}
