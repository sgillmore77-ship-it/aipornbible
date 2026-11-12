import { Analytics } from "@vercel/analytics/next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { JsonLd } from "./ui";
import { SITE, platformsInCategory, publishedCategories, publishedPlatforms } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search-index";

/** Header, footer, analytics and site-wide structured data for every public page. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const cats = publishedCategories().map((c) => ({ slug: c.slug, name: c.name, short: c.short, count: platformsInCategory(c.slug).length }));
  return (
    <>
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
    </>
  );
}
