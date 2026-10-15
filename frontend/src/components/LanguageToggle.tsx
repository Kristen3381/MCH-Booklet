"use client";

import React from "react";
import { useAppLocale } from "../lib/i18n-context";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useAppLocale();

  return (
    <div
      className={`inline-flex items-center rounded-md border border-ink/20 bg-paper-dark/70 p-1 font-heading text-xs select-none ${className}`}
      role="group"
      aria-label="Language selection / Kuchagua lugha"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`touch-target px-3.5 py-1.5 rounded font-bold transition-all ${
          locale === "en"
            ? "bg-paper text-ink shadow-xs border border-ink/15"
            : "text-ink-muted hover:text-ink"
        }`}
        aria-pressed={locale === "en"}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLocale("sw")}
        className={`touch-target px-3.5 py-1.5 rounded font-bold transition-all ${
          locale === "sw"
            ? "bg-paper text-ink shadow-xs border border-ink/15"
            : "text-ink-muted hover:text-ink"
        }`}
        aria-pressed={locale === "sw"}
      >
        Kiswahili
      </button>
    </div>
  );
}
