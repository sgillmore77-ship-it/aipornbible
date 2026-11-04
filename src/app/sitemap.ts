import type { MetadataRoute } from "next";
import { pages } from "@/content/pages";
import { SITE, articlePath, isIndexableCategory, isIndexablePlatform, publishedArticles, publishedCategories, publishedPlatforms } from "@/lib/data";

/** Only indexable pages go in the sitemap: no samples, no empty categories. */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => SITE.url + p;
  const latest = (xs: string[]) => xs.sort().at(-1);
  const plats = publishedPlatforms().filter(isIndexablePlatform);
  const arts = publishedArticles().filter((a) => !a.isSample);

  return [
    { url: u("/"), changeFrequency: "daily", priority: 1, lastModified: latest(plats.map((p) => p.lastUpdated)) },
    { url: u("/directory/"), changeFrequency: "daily", priority: 0.9 },
    { url: u("/categories/"), changeFrequency: "weekly", priority: 0.7 },
    ...publishedCategories().filter((c) => isIndexableCategory(c.slug)).map((c) => ({ url: u(`/category/${c.slug}/`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...plats.map((p) => ({ url: u(`/platform/${p.slug}/`), lastModified: p.lastUpdated, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...(["review", "comparison", "guide", "news"] as const)
      .filter((k) => arts.some((a) => a.kind === k))
      .map((k) => ({ url: u({ review: "/reviews/", comparison: "/comparisons/", guide: "/guides/", news: "/news/" }[k]), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...arts.map((a) => ({ url: u(articlePath(a)), lastModified: a.updatedOn, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...pages.map((p) => ({ url: u(`/${p.slug}/`), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
