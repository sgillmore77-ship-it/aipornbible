import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/ui";
import { SITE, platformsInCategory, publishedCategories, publishedPlatforms } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search-index";

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
  const cats = publishedCategories().map((c) => ({ slug: c.slug, name: c.name, count: platformsInCategory(c.slug).length }));
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[6px] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <Header searchIndex={buildSearchIndex()} siteCount={publishedPlatforms().length} categories={cats} />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg` },
              {
                "@type": "WebSite",
                "@id": `${SITE.url}/#website`,
                name: SITE.name,
                url: SITE.url,
                publisher: { "@id": `${SITE.url}/#org` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${SITE.url}/directory/?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
