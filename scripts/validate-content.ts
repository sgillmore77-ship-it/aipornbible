/**
 * Runs before every build (`npm run build`) and on demand (`npm run validate`).
 * Fails the build if published content is incomplete or breaks the content policy.
 */
import { categories } from "../src/content/categories";
import { platforms } from "../src/content/platforms";
import { articles } from "../src/content/articles";
import { pages } from "../src/content/pages";

const errors: string[] = [];
const warnings: string[] = [];
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
const catSlugs = new Set(categories.map((c) => c.slug));
const platformSlugs = new Set(platforms.map((p) => p.slug));
const pageSlugs = new Set(pages.map((p) => p.slug));

const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);
for (const d of dupes(categories.map((c) => c.slug))) errors.push(`Duplicate category slug: ${d}`);
for (const d of dupes(platforms.map((p) => p.slug))) errors.push(`Duplicate platform slug: ${d}`);
for (const s of pageSlugs) if (["directory", "categories", "reviews", "comparisons", "guides", "news", "go"].includes(s)) errors.push(`Page slug "${s}" clashes with a site route.`);

for (const c of categories) {
  if (c.status !== "published") continue;
  if (c.intro.join(" ").length < 200) errors.push(`Category "${c.slug}": intro too thin (<200 chars).`);
  for (const r of c.related) if (!catSlugs.has(r)) errors.push(`Category "${c.slug}": unknown related category "${r}".`);
}

for (const p of platforms) {
  const where = `Platform "${p.slug}"`;
  if (!/^[a-z0-9-]+$/.test(p.slug)) errors.push(`${where}: slug must be lowercase letters, numbers and hyphens.`);
  if (p.status !== "published") continue;

  if (!p.name.trim()) errors.push(`${where}: missing name.`);
  try { new URL(p.websiteUrl); } catch { errors.push(`${where}: invalid websiteUrl.`); }
  if (p.shortDescription.length < 40) errors.push(`${where}: shortDescription too short (<40 chars).`);
  if (!catSlugs.has(p.primaryCategory)) errors.push(`${where}: unknown primaryCategory.`);
  if (!p.categories.includes(p.primaryCategory)) errors.push(`${where}: categories must include primaryCategory.`);
  for (const c of p.categories) if (!catSlugs.has(c)) errors.push(`${where}: unknown category "${c}".`);
  if (p.hue < 0 || p.hue > 360) errors.push(`${where}: hue must be 0–360.`);
  if (!p.tags.length) errors.push(`${where}: add at least one display tag.`);
  if (!isDate(p.dateAdded) || !isDate(p.lastUpdated)) errors.push(`${where}: dates must be YYYY-MM-DD.`);
  if (!p.glance.price) warnings.push(`${where}: no price set.`);

  // Content policy: hard gate.
  if (!p.policyCheck) errors.push(`${where}: policyCheck missing; a published listing must pass the content policy check.`);
  else {
    if (!p.policyCheck.noRealPersonNudification) errors.push(`${where}: fails policy (undresses or deepfakes real people).`);
    if (!p.policyCheck.prohibitsMinors) errors.push(`${where}: fails policy (does not prohibit content involving minors).`);
    if (!isDate(p.policyCheck.checkedOn)) errors.push(`${where}: policyCheck.checkedOn must be a date.`);
  }

  // Editorial integrity.
  const e = p.editorial;
  if (e) {
    if (e.rating !== undefined && (e.rating < 0 || e.rating > 10)) errors.push(`${where}: rating must be 0–10.`);
    for (const s of e.subScores ?? []) if (s.value < 0 || s.value > 10) errors.push(`${where}: sub-score "${s.label}" must be 0–10.`);
    if (!e.assessment.length) errors.push(`${where}: editorial block needs an assessment.`);
    if (!isDate(e.lastChecked)) errors.push(`${where}: editorial.lastChecked must be a date.`);
  }
  if (p.commercial.affiliateActive) {
    if (!p.commercial.affiliateUrl) errors.push(`${where}: affiliateActive without affiliateUrl.`);
    else try { new URL(p.commercial.affiliateUrl); } catch { errors.push(`${where}: invalid affiliateUrl.`); }
  }
  for (const c of p.commercial.featuredInCategories)
    if (!p.categories.includes(c)) warnings.push(`${where}: featured in "${c}" but not listed in it.`);
  if (p.commercial.sponsoredUntil && isDate(p.commercial.sponsoredUntil) && p.commercial.sponsoredUntil < new Date().toISOString().slice(0, 10))
    warnings.push(`${where}: sponsorship ended ${p.commercial.sponsoredUntil}; set sponsored: false.`);

  if (!p.isSample && p.websiteUrl.includes("example.com")) errors.push(`${where}: real listing still points at example.com.`);
}

for (const a of articles) {
  if (a.status !== "published") continue;
  const where = `Article "${a.kind}/${a.slug}"`;
  if (a.sections.length === 0) errors.push(`${where}: no sections.`);
  if (a.description.length < 40) errors.push(`${where}: description too short.`);
  if (!isDate(a.publishedOn) || !isDate(a.updatedOn)) errors.push(`${where}: dates must be YYYY-MM-DD.`);
  for (const s of a.platforms ?? []) if (!platformSlugs.has(s)) errors.push(`${where}: unknown platform "${s}".`);
  for (const w of a.winners ?? []) if (!platformSlugs.has(w.platform)) errors.push(`${where}: unknown winner platform "${w.platform}".`);
  for (const s of a.sections) if (s.platform && !platformSlugs.has(s.platform)) errors.push(`${where}: section "${s.heading}" references unknown platform.`);
  if (a.kind === "review" && !a.basis) errors.push(`${where}: reviews must state basis (hands-on or research).`);
  if (a.category && !catSlugs.has(a.category)) errors.push(`${where}: unknown category.`);
}

const samples = platforms.filter((p) => p.isSample && p.status === "published").length;
if (samples) warnings.push(`${samples} sample platform listing(s) are live (noindexed). Replace before launch.`);

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✖ ${e}`);
  console.error(`\nContent validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`✔ Content valid: ${platforms.filter((p) => p.status === "published").length} published platforms, ${categories.length} categories, ${articles.filter((a) => a.status === "published").length} articles.`);
