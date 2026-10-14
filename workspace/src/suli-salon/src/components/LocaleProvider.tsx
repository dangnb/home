"use client";

import { createContext, useContext, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { TranslationDictionary } from "@/lib/i18n/types";

type LocaleContextValue = {
  locale: Locale;
  dictionary: TranslationDictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  locale,
  dictionary,
}: React.PropsWithChildren<LocaleContextValue>) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
