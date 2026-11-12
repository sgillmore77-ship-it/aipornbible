/**
 * Runs before every build (`npm run build`) and on demand (`npm run validate`).
 *
 * Content problems never fail the deploy: an item that would make a broken page
 * is held back from the site until it's fixed, and everything else still goes
 * live. The build only fails for problems that would break the whole site.
 */
import { articles, categories, contentIssues, pages, platforms } from "../src/lib/content";

const fatal: string[] = [];
const RESERVED = ["directory", "categories", "category", "platform", "reviews", "comparisons", "guides", "news", "go", "keystatic", "api"];
for (const p of pages) if (RESERVED.includes(p.slug)) fatal.push(`Info page slug "${p.slug}" clashes with a site section. Rename it in the dashboard.`);
if (!categories.some((c) => c.status === "published")) fatal.push("No published categories.");

const held = contentIssues.filter((i) => i.level === "held back");
const notes = contentIssues.filter((i) => i.level === "note");

const group = (list: typeof contentIssues) => {
  const by = new Map<string, string[]>();
  for (const i of list) by.set(i.item, [...(by.get(i.item) ?? []), i.message]);
  return by;
};

if (held.length) {
  console.warn("\n⚠ NOT SHOWN ON THE SITE until fixed in the dashboard:");
  for (const [item, msgs] of group(held)) console.warn(`  • ${item}\n      - ${msgs.join("\n      - ")}`);
}
if (notes.length) {
  console.warn("\nℹ Worth fixing (these are live):");
  for (const [item, msgs] of group(notes)) console.warn(`  • ${item}\n      - ${msgs.join("\n      - ")}`);
}
const samples = platforms.filter((p) => p.isSample && p.status === "published").length;
if (samples) console.warn(`\nℹ ${samples} sample listing(s) are live (hidden from Google). Replace or archive them before launch.`);

if (fatal.length) {
  for (const e of fatal) console.error(`✖ ${e}`);
  console.error(`\nBuild stopped: ${fatal.length} problem(s) that would break the site.`);
  process.exit(1);
}
console.log(
  `\n✔ Content OK: ${platforms.filter((p) => p.status === "published").length} platforms, ${categories.filter((c) => c.status === "published").length} categories, ${articles.filter((a) => a.status === "published").length} articles live` +
    (held.length ? `; ${new Set(held.map((h) => h.item)).size} item(s) held back` : "") +
    ".",
);
