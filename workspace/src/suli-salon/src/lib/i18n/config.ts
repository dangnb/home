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
  const languages = (acceptLanguage ?? "").toLowerCase().split(",");
  return languages.some((language) => language.trim().startsWith("en")) ? "en" : DEFAULT_LOCALE;
}
