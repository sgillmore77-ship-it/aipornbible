import { categories } from "@/content/categories";
import { platforms } from "@/content/platforms";
import { articles } from "@/content/articles";
import type { Article, ArticleKind, Platform } from "./types";

export const SITE = {
  name: "AI Porn Bible",
  tagline: "The AI Porn Directory & Industry Guide",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://aipornbible.com").replace(/\/$/, ""),
  contactEmail: "hello@aipornbible.com",
};

export const publishedPlatforms = (): Platform[] => platforms.filter((p) => p.status === "published");
export const getPlatform = (slug: string) => publishedPlatforms().find((p) => p.slug === slug);
export const platformsInCategory = (slug: string) => publishedPlatforms().filter((p) => p.categories.includes(slug));
export const publishedCategories = () => categories.filter((c) => c.status === "published");
export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

export const publishedArticles = (kind?: ArticleKind): Article[] =>
  articles
    .filter((a) => a.status === "published" && (!kind || a.kind === kind))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

export const getArticle = (kind: ArticleKind, slug: string) => publishedArticles(kind).find((a) => a.slug === slug);
export const reviewForPlatform = (slug: string) => publishedArticles("review").find((a) => a.platforms?.includes(slug));
export const comparisonForCategory = (slug: string) => publishedArticles("comparison").find((a) => a.category === slug);
export const articlesForCategory = (slug: string) => publishedArticles().filter((a) => a.category === slug);

/** Sponsored first, then editor's picks, then rating. */
export const featuredRank = (a: Platform, b: Platform) =>
  Number(b.commercial.sponsored) - Number(a.commercial.sponsored) ||
  Number(b.commercial.editorsPick) - Number(a.commercial.editorsPick) ||
  (b.editorial?.rating ?? 0) - (a.editorial?.rating ?? 0);

/** Sponsored first, then rating (category boxes). */
export const boxRank = (a: Platform, b: Platform) =>
  Number(b.commercial.sponsored) - Number(a.commercial.sponsored) || (b.editorial?.rating ?? 0) - (a.editorial?.rating ?? 0);

export const byRating = (a: Platform, b: Platform) => (b.editorial?.rating ?? -1) - (a.editorial?.rating ?? -1);

export const hasFeature = (p: Platform, key: string) => p.features.some((f) => f.key === key && f.value === "yes");

/** Pages are indexed only when they have real, non-sample content. */
export const isIndexablePlatform = (p: Platform) => !p.isSample && p.status === "published";
export const isIndexableCategory = (slug: string) => platformsInCategory(slug).some(isIndexablePlatform);

export const outboundHref = (p: Platform) => `/go/${p.slug}/`;
export const outboundRel = (p: Platform) =>
  p.commercial.sponsored || p.commercial.affiliateActive ? "sponsored nofollow noopener" : "nofollow noopener";

export const resolveOutboundUrl = (p: Platform): string => {
  const base = p.commercial.affiliateActive && p.commercial.affiliateUrl ? p.commercial.affiliateUrl : p.websiteUrl;
  if (!p.commercial.trackingParams) return base;
  const u = new URL(base);
  for (const [k, v] of Object.entries(p.commercial.trackingParams)) u.searchParams.set(k, v);
  return u.toString();
};

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const formatMonth = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export const articlePath = (a: Article) => {
  const base = { review: "reviews", comparison: "comparisons", guide: "guides", news: "news" }[a.kind];
  return `/${base}/${a.slug}/`;
};

export const readMinutes = (a: Article) => {
  const words = a.sections.flatMap((s) => [s.heading, ...s.body, ...(s.list ?? []).map((l) => l.title + " " + l.body)]).join(" ").split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
};

export const initials = (p: Platform) => p.initials ?? p.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
