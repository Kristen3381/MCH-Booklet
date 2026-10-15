import type { Metadata } from "next";
import { StyleguideClient } from "./StyleguideClient";
import { AppQueryProvider } from "@/lib/api/client";
import { AppI18nProvider } from "@/lib/i18n-context";

export const metadata: Metadata = {
  title: "Kitabu | Design System & Living Style Guide",
  description:
    "Design tokens, paper-craft typography, authentic facility stamps, and accessible components for Kitabu.",
};

export default function StyleguidePage() {
  return (
    <AppQueryProvider>
      <AppI18nProvider defaultLocale="en">
        <StyleguideClient />
      </AppI18nProvider>
    </AppQueryProvider>
  );
}
