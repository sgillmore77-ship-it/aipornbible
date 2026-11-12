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
/** Long formatted text (markdown), kept as written. */
const longText = (v: unknown) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "");
/** Adds https:// when a URL was typed without it ("example.com" → "https://example.com"). */
const url = (v: unknown) => {
  const s = str(v);
  if (!s) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s.replace(/^\/+/, "")}`;
};
const isUrl = (s: string) => {
  try {
    const u = new URL(s);
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  } catch {
    return false;
  }
};
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
    intro: longText(data.intro),
    related: strs(data.related),
    status: status(data.status),
    order: typeof data.order === "number" ? data.order : 1000,
  }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  .map(({ order: _order, ...c }) => c);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

const CAT_SLUGS = new Set(categories.map((c) => c.slug));
for (const c of categories) c.related = c.related.filter((r) => CAT_SLUGS.has(r) && r !== c.slug);

const CAT_NAMES: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

/* ---------------- Platforms ---------------- */

const PRICING: PricingModel[] = ["free", "freemium", "subscription", "credits", "paid"];
const TYPES: PlatformType[] = ["web", "mobile", "desktop", "discord"];

const loadedPlatforms: Platform[] = readCollection("platforms").map(({ slug, data }) => {
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
    websiteUrl: url(data.websiteUrl),
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
            about: longText(ed.about),
            pros: strs(ed.pros),
            cons: strs(ed.cons),
            assessment: longText(ed.assessment),
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
      ...(opt(comm.affiliateUrl) ? { affiliateUrl: url(comm.affiliateUrl) } : {}),
      ...(tracking.length ? { trackingParams: Object.fromEntries(tracking.map((t) => [str(t.key), str(t.value)])) } : {}),
    },
  };
  return p;
});

/* ---------------- Articles ---------------- */

const KINDS: ArticleKind[] = ["review", "comparison", "guide", "news"];

const loadedArticles: Article[] = readCollection("articles").map(({ slug, data }) => ({
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
      body: longText(s.body),
      ...(arr(s.list).length ? { list: arr<Raw>(s.list).filter((l) => str(l.title) || str(l.body)).map((l) => ({ title: str(l.title), body: str(l.body) })) } : {}),
    })),
}));

/* ---------------- Info pages ---------------- */

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading?: string; body: string }[];
}

export const pages: StaticPage[] = readCollection("pages").map(({ slug, data }) => ({
  slug,
  title: str(data.title) || slug,
  description: str(data.description),
  sections: arr<Raw>(data.sections).map((s) => ({ ...(opt(s.heading) ? { heading: str(s.heading) } : {}), body: longText(s.body) })),
}));

export const getPage = (slug: string) => pages.find((p) => p.slug === slug);

/* ---------------- Health check ----------------
 * Small mistakes are fixed or tolerated. A published item that would produce a
 * broken page is held back from the site (treated as a draft) instead of
 * failing the whole deploy, so one bad listing never blocks other updates.
 * `npm run validate` and every build print these messages.
 */

export interface ContentIssue {
  item: string;
  /** "held back": not shown on the site until fixed. "note": shown, but worth fixing. */
  level: "held back" | "note";
  message: string;
}
export const contentIssues: ContentIssue[] = [];
const issue = (item: string, level: ContentIssue["level"], message: string) => contentIssues.push({ item, level, message });

const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
const todayIso = () => new Date().toISOString().slice(0, 10);

export const platforms: Platform[] = loadedPlatforms.map((p) => {
  if (p.status !== "published") return p;
  const where = `Platform "${p.name}" (${p.slug})`;
  const block: string[] = [];

  if (!p.websiteUrl) block.push("no website URL");
  else if (!isUrl(p.websiteUrl)) block.push(`website URL "${p.websiteUrl}" isn't a valid web address`);
  else if (!p.isSample && /example\.com/.test(p.websiteUrl)) block.push("website URL still points at example.com");
  if (!p.shortDescription) block.push("no short description");
  if (!p.primaryCategory) block.push("no main category");
  else if (!CAT_SLUGS.has(p.primaryCategory)) block.push(`main category "${p.primaryCategory}" doesn't exist`);
  if (!p.policyCheck) block.push("content policy check not filled in");
  else {
    if (!p.policyCheck.noRealPersonNudification) block.push("content policy: not confirmed that it doesn't undress or deepfake real people");
    if (!p.policyCheck.prohibitsMinors) block.push("content policy: not confirmed that it prohibits content involving minors");
  }
  if (block.length) {
    for (const b of block) issue(where, "held back", b);
    return { ...p, status: "draft" as const };
  }

  const fixed = { ...p };
  fixed.categories = p.categories.filter((c) => CAT_SLUGS.has(c));
  if (!isDate(p.dateAdded)) { fixed.dateAdded = todayIso(); issue(where, "note", "date added missing; using today"); }
  if (!isDate(fixed.lastUpdated)) fixed.lastUpdated = fixed.dateAdded;
  if (p.shortDescription.length > 300) issue(where, "note", `short description is ${p.shortDescription.length} characters; cards show the first two lines, so 1–2 sentences works best`);
  if (!p.tags.length) issue(where, "note", "no card tags");
  if (!p.glance.price) issue(where, "note", "no price");
  if (p.commercial.affiliateActive && !p.commercial.affiliateUrl) issue(where, "note", "affiliate link is ticked but there's no affiliate URL; using the website URL");
  if (p.commercial.affiliateUrl && !isUrl(p.commercial.affiliateUrl)) {
    issue(where, "note", "affiliate URL isn't valid; using the website URL");
    fixed.commercial = { ...p.commercial, affiliateUrl: undefined, affiliateActive: false };
  }
  if (p.commercial.sponsoredUntil && isDate(p.commercial.sponsoredUntil) && p.commercial.sponsoredUntil < todayIso())
    issue(where, "note", `sponsorship ended ${p.commercial.sponsoredUntil}; untick Sponsored`);
  const e = p.editorial;
  if (e) {
    if (e.rating !== undefined && (e.rating < 0 || e.rating > 10)) {
      issue(where, "note", "rating must be 0–10; hidden");
      fixed.editorial = { ...e, rating: undefined };
    }
    if (!e.assessment) issue(where, "note", "editorial assessment is ticked but “Our assessment” is empty; that section is hidden");
    if (/sample/i.test(`${e.reviewer} ${e.cons.join(" ")} ${e.pros.join(" ")}`) && !p.isSample) issue(where, "note", "still contains sample text (reviewer, pros or cons)");
  }
  if (!p.isSample && p.policyCheck && /sample/i.test(p.policyCheck.checkedBy)) issue(where, "note", "policy check “Checked by” still says sample data");
  return fixed;
});

const PLATFORM_SLUGS = new Set(platforms.filter((p) => p.status === "published").map((p) => p.slug));

export const articles: Article[] = loadedArticles.map((a) => {
  if (a.status !== "published") return a;
  const where = `Article "${a.title}" (${a.slug})`;
  const block: string[] = [];
  if (!a.sections.some((s) => s.body || s.list?.length)) block.push("has no text in any section");
  if (block.length) {
    for (const b of block) issue(where, "held back", b);
    return { ...a, status: "draft" as const };
  }
  const fixed = { ...a };
  if (!isDate(a.publishedOn)) { fixed.publishedOn = todayIso(); issue(where, "note", "publish date missing; using today"); }
  if (!isDate(fixed.updatedOn)) fixed.updatedOn = fixed.publishedOn;
  if (a.category && !CAT_SLUGS.has(a.category)) { fixed.category = undefined; issue(where, "note", `category "${a.category}" doesn't exist`); }
  const dropped = (a.platforms ?? []).filter((s) => !PLATFORM_SLUGS.has(s));
  if (dropped.length) issue(where, "note", `references platforms that aren't live: ${dropped.join(", ")}`);
  fixed.platforms = a.platforms?.filter((s) => PLATFORM_SLUGS.has(s));
  fixed.winners = a.winners?.filter((w) => PLATFORM_SLUGS.has(w.platform));
  fixed.sections = a.sections.map((s) => (s.platform && !PLATFORM_SLUGS.has(s.platform) ? { ...s, platform: undefined } : s));
  if (a.kind === "review" && !a.basis) { fixed.basis = "research"; issue(where, "note", "review doesn't say whether it's hands-on or research; showing “Research-based”"); }
  if (a.description.length < 40) issue(where, "note", "description is short; it's used in Google results");
  return fixed;
});

for (const c of categories)
  if (c.status === "published" && c.intro.length < 200) issue(`Category "${c.name}" (${c.slug})`, "note", "intro is under 200 characters; thin category pages rank poorly");
