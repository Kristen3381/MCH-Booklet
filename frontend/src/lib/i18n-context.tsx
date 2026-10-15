"use client";

import React, { createContext, useContext, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import swMessages from "@/messages/sw.json";

export type SupportedLocale = "en" | "sw";

const messagesMap: Record<SupportedLocale, typeof enMessages> = {
  en: enMessages,
  sw: swMessages,
};

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function AppI18nProvider({
  children,
  defaultLocale = "en",
}: {
  children: React.ReactNode;
  defaultLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mch_preferred_locale") as SupportedLocale | null;
      if (saved && (saved === "en" || saved === "sw")) {
        return saved;
      }
    }
    return defaultLocale;
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("mch_preferred_locale", newLocale);
  };

  const toggleLocale = () => {
    const next = locale === "en" ? "sw" : "en";
    setLocale(next);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesMap[locale]}
        timeZone="Africa/Nairobi"
      >
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useAppLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useAppLocale must be used within an AppI18nProvider");
  }
  return context;
}
