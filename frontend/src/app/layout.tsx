import type { Metadata, Viewport } from "next";
import { bricolageGrotesque, figtree } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitabu | Maternal & Child Health Digital Companion",
  description:
    "A patient-owned digital health wallet for Kenyan maternal and child health, alongside your clinic booklet.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kitabu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1E4D3B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body bg-paper-grain selection:bg-clay selection:text-ink">
        {children}
      </body>
    </html>
  );
}
