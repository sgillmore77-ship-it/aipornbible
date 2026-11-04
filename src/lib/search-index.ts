import { categoryName, platformsInCategory, publishedCategories, publishedPlatforms } from "./data";
import { FEATURE_LABELS, PRICING_LABELS, TYPE_LABELS } from "./labels";
import type { FilterFeature } from "./types";
import type { SearchItem } from "./search-match";
export type { SearchItem };

/** Small, serialisable index passed to client search components. */
export function buildSearchIndex(): SearchItem[] {
  return [
    ...publishedCategories().map((c) => ({
      kind: "category" as const,
      title: c.name,
      sub: c.short,
      href: `/category/${c.slug}/`,
      count: platformsInCategory(c.slug).length,
      haystack: `${c.name} ${c.short}`.toLowerCase(),
    })),
    ...publishedPlatforms().map((p) => ({
      kind: "platform" as const,
      title: p.name,
      sub: `${categoryName(p.primaryCategory)} · ${PRICING_LABELS[p.pricingModel]}`,
      href: `/platform/${p.slug}/`,
      go: `/go/${p.slug}/`,
      rel: p.commercial.sponsored || p.commercial.affiliateActive ? "sponsored nofollow noopener" : "nofollow noopener",
      hue: p.hue,
      initials: p.initials ?? p.name.slice(0, 2),
      logo: p.logo,
      rating: p.editorial?.rating,
      sponsored: p.commercial.sponsored,
      haystack: [
        p.name,
        p.shortDescription,
        ...p.categories.map(categoryName),
        ...p.tags,
        TYPE_LABELS[p.platformType],
        PRICING_LABELS[p.pricingModel],
        ...p.features.filter((f) => f.value === "yes").map((f) => f.label ?? FEATURE_LABELS[f.key as FilterFeature] ?? ""),
      ].join(" ").toLowerCase(),
    })),
  ];
}
