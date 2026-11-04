/**
 * Build-time content loader.
 *
 * Reads the JSON files the Keystatic dashboard writes (content/<collection>/<slug>.json)
 * and maps them onto the site's types. Runs on the server during `next build`
 * only: public pages are static HTML and never read content per request.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Article, ArticleKind, Category, ContentStatus, Fact, FeatureRow, Platform, PlatformType, PricingModel } from "./types";

const ROOT = join(process.cwd(), "content");

/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = Record<string, any>;

function readCollection(dir: string): { slug: string; data: Raw }[] {
  const path = join(ROOT, dir);
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.json$/, "");
      try {
        return { slug, data: JSON.parse(readFileSync(join(path, f), "utf8")) as Raw };
      } catch (e) {
        throw new Error(`content/${dir}/${f} is not valid JSON: ${(e as Error).message}`);
      }
    });
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const opt = (v: unknown) => str(v) || undefined;
const arr = <T = any>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const strs = (v: unknown) => arr(v).map(str).filter(Boolean);
/** Multi-line text with blank lines between paragraphs → array of paragraphs. */
const paras = (v: unknown) => str(v).split(/\n\s*\n/).map((s) => s.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
const status = (v: unknown): ContentStatus => (v === "published" || v === "archived" ? v : "draft");
const date = (v: unknown) => str(v);

function fact(v: Raw | undefined): Fact | undefined {
  const value = str(v?.value);
  if (!value) return undefined;
  return { value, ...(v?.unverified ? { unverified: true } : {}), ...(str(v?.checkedOn) ? { checkedOn: str(v?.checkedOn) } : {}) };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ---------------- Categories ---------------- */

export const categories: Category[] = readCollection("categories")
  .map(({ slug, data }) => ({
    slug,
    name: str(data.name) || slug,
    short: str(data.short),
    intro: paras(data.intro),
    related: strs(data.related),
    status: status(data.status),
    order: typeof data.order === "number" ? data.order : 1000,
  }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  .map(({ order: _order, ...c }) => c);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

const CAT_NAMES: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

/* ---------------- Platforms ---------------- */

const PRICING: PricingModel[] = ["free", "freemium", "subscription", "credits", "paid"];
const TYPES: PlatformType[] = ["web", "mobile", "desktop", "discord"];

export const platforms: Platform[] = readCollection("platforms").map(({ slug, data }) => {
  const primary = str(data.primaryCategory);
  const cats = strs(data.categories);
  const allCats = primary && !cats.includes(primary) ? [primary, ...cats] : cats;
  const ed = data.editorial?.discriminant ? (data.editorial.value as Raw) : undefined;
  const pc = data.policyCheck as Raw | undefined;
  const comm = (data.commercial ?? {}) as Raw;
  const tracking = arr<Raw>(comm.trackingParams).filter((t) => str(t.key));

  const features: FeatureRow[] = arr<Raw>(data.features).map((f) => {
    const label = str(f.label);
    const key = f.key === "custom" || !f.key ? slugify(label) || "feature" : String(f.key);
    return {
      key,
      ...(label ? { label } : {}),
      value: f.value === "no" || f.value === "unknown" ? f.value : "yes",
      ...(f.unverified ? { unverified: true } : {}),
    };
  });

  const privacyFacts = {
    dataRetention: fact(data.privacy?.dataRetention),
    trainingOnChats: fact(data.privacy?.trainingOnChats),
    ageVerification: fact(data.privacy?.ageVerification),
    allowedContent: fact(data.privacy?.allowedContent),
    prohibitedContent: fact(data.privacy?.prohibitedContent),
  };

  const p: Platform = {
    slug,
    name: str(data.name) || slug,
    status: status(data.status),
    ...(data.isSample ? { isSample: true } : {}),
    ...(opt(data.logo) ? { logo: str(data.logo) } : {}),
    hue: typeof data.hue === "number" ? data.hue : 200,
    ...(opt(data.initials) ? { initials: str(data.initials).slice(0, 2) } : {}),
    websiteUrl: str(data.websiteUrl),
    shortDescription: str(data.shortDescription),
    primaryCategory: primary,
    categories: allCats,
    catNames: CAT_NAMES,
    platformType: TYPES.includes(data.platformType) ? data.platformType : "web",
    pricingModel: PRICING.includes(data.pricingModel) ? data.pricingModel : "freemium",
    tags: strs(data.tags),
    ...(opt(data.bestFor) ? { bestFor: str(data.bestFor) } : {}),
    dateAdded: date(data.dateAdded),
    lastUpdated: date(data.lastUpdated) || date(data.dateAdded),
    features,
    glance: {
      price: fact(data.glance?.price),
      freeAccess: fact(data.glance?.freeAccess),
      payment: fact(data.glance?.payment),
      devices: fact(data.glance?.devices),
      account: fact(data.glance?.account),
      billingName: fact(data.glance?.billingName),
    },
    ...(Object.values(privacyFacts).some(Boolean) ? { privacy: privacyFacts } : {}),
    policyCheck:
      pc && (pc.noRealPersonNudification || pc.prohibitsMinors || str(pc.checkedOn))
        ? {
            noRealPersonNudification: !!pc.noRealPersonNudification,
            prohibitsMinors: !!pc.prohibitsMinors,
            checkedOn: str(pc.checkedOn),
            checkedBy: str(pc.checkedBy),
          }
        : null,
    ...(ed
      ? {
          editorial: {
            ...(typeof ed.rating === "number" ? { rating: ed.rating } : {}),
            ...(arr(ed.subScores).length
              ? { subScores: arr<Raw>(ed.subScores).filter((s) => str(s.label) && typeof s.value === "number").map((s) => ({ label: str(s.label), value: s.value as number })) }
              : {}),
            basis: ed.basis === "hands-on" ? "hands-on" : "research",
            reviewer: str(ed.reviewer) || "AI Porn Bible Editorial",
            lastChecked: date(ed.lastChecked) || date(data.lastUpdated),
            about: paras(ed.about),
            pros: strs(ed.pros),
            cons: strs(ed.cons),
            assessment: paras(ed.assessment),
            ...(opt(ed.verdict) ? { verdict: str(ed.verdict) } : {}),
          },
        }
      : {}),
    commercial: {
      sponsored: !!comm.sponsored,
      ...(opt(comm.sponsoredFrom) ? { sponsoredFrom: str(comm.sponsoredFrom) } : {}),
      ...(opt(comm.sponsoredUntil) ? { sponsoredUntil: str(comm.sponsoredUntil) } : {}),
      editorsPick: !!comm.editorsPick,
      featuredOnHome: !!comm.featuredOnHome,
      featuredInCategories: strs(comm.featuredInCategories),
      affiliateActive: !!comm.affiliateActive,
      ...(opt(comm.affiliateUrl) ? { affiliateUrl: str(comm.affiliateUrl) } : {}),
      ...(tracking.length ? { trackingParams: Object.fromEntries(tracking.map((t) => [str(t.key), str(t.value)])) } : {}),
    },
  };
  return p;
});

/* ---------------- Articles ---------------- */

const KINDS: ArticleKind[] = ["review", "comparison", "guide", "news"];

export const articles: Article[] = readCollection("articles").map(({ slug, data }) => ({
  slug,
  kind: KINDS.includes(data.kind) ? data.kind : "guide",
  status: status(data.status),
  ...(data.isSample ? { isSample: true } : {}),
  title: str(data.title) || slug,
  description: str(data.description),
  publishedOn: date(data.publishedOn),
  updatedOn: date(data.updatedOn) || date(data.publishedOn),
  author: str(data.author) || "AI Porn Bible Editorial",
  ...(opt(data.authorRole) ? { authorRole: str(data.authorRole) } : {}),
  ...(opt(data.category) ? { category: str(data.category) } : {}),
  ...(strs(data.platforms).length ? { platforms: strs(data.platforms) } : {}),
  ...(arr(data.winners).length
    ? { winners: arr<Raw>(data.winners).filter((w) => str(w.platform)).map((w) => ({ label: str(w.label), platform: str(w.platform) })) }
    : {}),
  ...(data.basis === "hands-on" || data.basis === "research" ? { basis: data.basis } : {}),
  ...(data.sponsored ? { sponsored: true } : {}),
  sections: arr<Raw>(data.sections)
    .filter((s) => str(s.heading))
    .map((s) => ({
      heading: str(s.heading),
      ...(opt(s.platform) ? { platform: str(s.platform) } : {}),
      body: paras(s.body),
      ...(arr(s.list).length ? { list: arr<Raw>(s.list).filter((l) => str(l.title) || str(l.body)).map((l) => ({ title: str(l.title), body: str(l.body) })) } : {}),
    })),
}));

/* ---------------- Info pages ---------------- */

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading?: string; body: string[] }[];
}

export const pages: StaticPage[] = readCollection("pages").map(({ slug, data }) => ({
  slug,
  title: str(data.title) || slug,
  description: str(data.description),
  sections: arr<Raw>(data.sections).map((s) => ({ ...(opt(s.heading) ? { heading: str(s.heading) } : {}), body: paras(s.body) })),
}));

export const getPage = (slug: string) => pages.find((p) => p.slug === slug);
