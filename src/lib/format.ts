/** Pure helpers, safe to use in client components (no content or filesystem access). */
import type { Platform } from "./types";

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const formatMonth = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export const outboundHref = (p: Platform) => `/go/${p.slug}/`;
export const outboundRel = (p: Platform) =>
  p.commercial.sponsored || p.commercial.affiliateActive ? "sponsored nofollow noopener" : "nofollow noopener";

/** Category name for a platform card, from names resolved when content was loaded. */
export const catLabel = (p: Platform, slug = p.primaryCategory) => p.catNames?.[slug] ?? slug;
