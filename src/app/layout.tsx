import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";

/**
 * Archivo variable (weight 100–900, width 62–125%), self-hosted and preloaded.
 * next/font adds a size-matched fallback so the swap to Archivo doesn't shift layout.
 */
const archivo = localFont({
  src: "../fonts/archivo-latin-wdth-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  adjustFontFallback: "Arial",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AI Porn Bible: The AI Porn Directory & Reviews",
    template: "%s | AI Porn Bible",
  },
  description:
    "The AI porn directory. Find and compare the best AI porn generators, AI sex chat, AI girlfriends, NSFW AI characters and AI porn video tools, with honest reviews.",
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  other: {
    // Self-label as adult content so SafeSearch and filters classify it correctly.
    rating: "adult",
    RATING: "RTA-5042-1996-1400-1577-RTA",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={archivo.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
