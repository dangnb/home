export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_METADATA: Record<Locale, { htmlLang: string; label: string; flag: string }> = {
  vi: { htmlLang: "vi", label: "Tiếng Việt", flag: "VN" },
  en: { htmlLang: "en", label: "English", flag: "EN" },
};

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}
