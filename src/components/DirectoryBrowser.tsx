"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PlatformCard } from "./PlatformCard";
import { Magnifier } from "./SearchBox";
import { FEATURE_LABELS, FILTER_FEATURES, PRICING_LABELS, SORTS, TYPE_LABELS, type SortKey } from "@/lib/labels";
import type { FilterFeature, Platform, PlatformType, PricingModel } from "@/lib/types";

type Filters = { q: string; cat: string[]; pricing: PricingModel[]; type: PlatformType[]; f: FilterFeature[]; sort: SortKey };
const EMPTY: Filters = { q: "", cat: [], pricing: [], type: [], f: [], sort: "featured" };
const PAGE = 12;

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const toggle = <T,>(xs: T[], v: T) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]);
const has = (p: Platform, f: FilterFeature) => p.features.some((x) => x.key === f && x.value === "yes");

function matches(p: Platform, s: Filters, locked?: string, skip?: keyof Filters) {
  if (locked && !p.categories.includes(locked)) return false;
  if (skip !== "cat" && s.cat.length && !s.cat.some((c) => p.categories.includes(c))) return false;
  if (skip !== "pricing" && s.pricing.length && !s.pricing.includes(p.pricingModel)) return false;
  if (skip !== "type" && s.type.length && !s.type.includes(p.platformType)) return false;
  if (s.f.length && !s.f.every((f) => has(p, f))) return false;
  if (s.q) {
    const hay = [p.name, p.shortDescription, ...p.tags, ...p.categories, PRICING_LABELS[p.pricingModel], TYPE_LABELS[p.platformType],
      ...p.features.filter((x) => x.value === "yes").map((x) => x.label ?? FEATURE_LABELS[x.key as FilterFeature] ?? "")].join(" ").toLowerCase();
    if (!s.q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t))) return false;
  }
  return true;
}

const SORT_FNS: Record<SortKey, (a: Platform, b: Platform) => number> = {
  featured: (a, b) =>
    Number(b.commercial.sponsored) - Number(a.commercial.sponsored) ||
    Number(b.commercial.editorsPick) - Number(a.commercial.editorsPick) ||
    (b.editorial?.rating ?? 0) - (a.editorial?.rating ?? 0) || a.name.localeCompare(b.name),
  az: (a, b) => a.name.localeCompare(b.name),
  added: (a, b) => b.dateAdded.localeCompare(a.dateAdded),
  updated: (a, b) => b.lastUpdated.localeCompare(a.lastUpdated),
};

/* ---------- small UI pieces ---------- */

function CheckRow({ on, label, count, onClick }: { on: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onClick} disabled={!on && count === 0}
      className="flex min-h-[34px] w-full items-center gap-2.5 text-left text-[14.5px] disabled:opacity-40">
      <span className={`grid size-[18px] flex-none place-items-center rounded-[4px] border-[1.5px] text-[11px] font-bold ${on ? "border-ink bg-ink text-paper" : "border-ink3"}`}>{on ? "✓" : ""}</span>
      <span className="flex-1">{label}</span>
      <span className="text-[13px] tabular-nums text-ink3">{count}</span>
    </button>
  );
}

function Chip({ on, label, count, onClick, big = false }: { on: boolean; label: string; count?: number; onClick: () => void; big?: boolean }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} disabled={!on && count === 0}
      className={`inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-[8px] border font-medium disabled:opacity-40 ${big ? "h-11 px-3.5 text-[15px]" : "h-9 px-3 text-[14px]"} ${on ? "border-ink bg-ink text-paper" : "border-rule bg-card text-ink hover:border-ink3"}`}>
      {label}
      {count !== undefined && <span className={`text-[12.5px] ${on ? "text-paper/70" : "text-ink3"}`}>{count}</span>}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-ink pb-4 pt-3">
      <legend className="float-left mb-1.5 w-full text-[12px] font-bold uppercase tracking-[0.06em]">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

/* ---------- main component ---------- */

export function DirectoryBrowser({ platforms, categories, lockedCategory, mode = "sidebar" }: {
  platforms: Platform[];
  categories: { slug: string; name: string }[];
  lockedCategory?: string;
  mode?: "sidebar" | "chips";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [s, setS] = useState<Filters>(EMPTY);
  const [shown, setShown] = useState(mode === "chips" ? 8 : PAGE);
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileAll, setMobileAll] = useState(false);

  // Read state from the URL once on load (shareable filtered URLs).
  useEffect(() => {
    if (!params) return;
    const sort = params.get("sort") as SortKey | null;
    setS({
      q: params.get("q") ?? "",
      cat: lockedCategory ? [] : list(params.get("cat")),
      pricing: list(params.get("pricing")) as PricingModel[],
      type: list(params.get("type")) as PlatformType[],
      f: list(params.get("f")) as FilterFeature[],
      sort: sort && SORT_FNS[sort] ? sort : "featured",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (next: Partial<Filters>) => {
    const n = { ...s, ...next };
    setS(n);
    setShown(mode === "chips" ? 8 : PAGE);
    const qp = new URLSearchParams();
    if (n.q) qp.set("q", n.q);
    if (n.cat.length) qp.set("cat", n.cat.join(","));
    if (n.pricing.length) qp.set("pricing", n.pricing.join(","));
    if (n.type.length) qp.set("type", n.type.join(","));
    if (n.f.length) qp.set("f", n.f.join(","));
    if (n.sort !== "featured") qp.set("sort", n.sort);
    const qs = qp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => platforms.filter((p) => matches(p, s, lockedCategory)).sort(SORT_FNS[s.sort]), [platforms, s, lockedCategory]);

  const count = {
    cat: (c: string) => platforms.filter((p) => matches(p, s, lockedCategory, "cat") && p.categories.includes(c)).length,
    pricing: (m: PricingModel) => platforms.filter((p) => matches(p, s, lockedCategory, "pricing") && p.pricingModel === m).length,
    type: (t: PlatformType) => platforms.filter((p) => matches(p, s, lockedCategory, "type") && p.platformType === t).length,
    f: (f: FilterFeature) => (s.f.includes(f) ? results.length : results.filter((p) => has(p, f)).length),
  };

  const activeN = s.cat.length + s.pricing.length + s.type.length + s.f.length;
  const clear = () => update({ cat: [], pricing: [], type: [], f: [], q: "" });
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const activeChips: { label: string; remove: () => void }[] = [
    ...s.cat.map((c) => ({ label: catName(c), remove: () => update({ cat: toggle(s.cat, c) }) })),
    ...s.pricing.map((m) => ({ label: PRICING_LABELS[m], remove: () => update({ pricing: toggle(s.pricing, m) }) })),
    ...s.type.map((t) => ({ label: TYPE_LABELS[t], remove: () => update({ type: toggle(s.type, t) }) })),
    ...s.f.map((f) => ({ label: FEATURE_LABELS[f], remove: () => update({ f: toggle(s.f, f) }) })),
    ...(s.q ? [{ label: `“${s.q}”`, remove: () => update({ q: "" }) }] : []),
  ];

  const pricingOptions = (mode === "chips" ? ["free", "freemium", "subscription"] : Object.keys(PRICING_LABELS)) as PricingModel[];
  const featureOptions = (mode === "chips" ? ["no-signup", "memory", "voice", "crypto"] : FILTER_FEATURES) as FilterFeature[];

  /* Bottom sheet (mobile), shared by both modes */
  const sheetUI = sheet && (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <button className="absolute inset-0 bg-black/60" aria-label="Close filters" onClick={() => setSheet(false)} />
      <div className="absolute inset-x-0 bottom-0 flex h-[90dvh] flex-col rounded-t-[14px] bg-paper">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-rule" />
        <div className="flex h-14 items-center justify-between border-b border-rule px-4">
          <button onClick={() => setSheet(false)} aria-label="Close" className="grid size-11 place-items-center text-[18px]">✕</button>
          <span className="text-[17px] font-extrabold">Filters</span>
          <button onClick={clear} className="h-11 px-2 text-[15px] font-bold text-red">Clear</button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <div>
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]">Sort</p>
            <div className="flex flex-wrap gap-2">{SORTS.map(([k, l]) => <Chip big key={k} on={s.sort === k} label={l} onClick={() => update({ sort: k })} />)}</div>
          </div>
          {!lockedCategory && (
            <div>
              <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]">Category</p>
              <div className="flex flex-wrap gap-2">{categories.map((c) => <Chip big key={c.slug} on={s.cat.includes(c.slug)} label={c.name} count={count.cat(c.slug)} onClick={() => update({ cat: toggle(s.cat, c.slug) })} />)}</div>
            </div>
          )}
          <div>
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]">Pricing model</p>
            <div className="flex flex-wrap gap-2">{(Object.keys(PRICING_LABELS) as PricingModel[]).map((m) => <Chip big key={m} on={s.pricing.includes(m)} label={PRICING_LABELS[m]} count={count.pricing(m)} onClick={() => update({ pricing: toggle(s.pricing, m) })} />)}</div>
          </div>
          <div>
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]">Platform type</p>
            <div className="flex flex-wrap gap-2">{(Object.keys(TYPE_LABELS) as PlatformType[]).map((t) => <Chip big key={t} on={s.type.includes(t)} label={TYPE_LABELS[t]} count={count.type(t)} onClick={() => update({ type: toggle(s.type, t) })} />)}</div>
          </div>
          <div>
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.06em]">Features</p>
            <div className="flex flex-wrap gap-2">{FILTER_FEATURES.map((f) => <Chip big key={f} on={s.f.includes(f)} label={FEATURE_LABELS[f]} count={count.f(f)} onClick={() => update({ f: toggle(s.f, f) })} />)}</div>
          </div>
        </div>
        <div className="border-t border-rule p-4">
          <button onClick={() => setSheet(false)} className="btn-red h-[52px] w-full rounded-[8px] text-[16px] font-bold">
            Show {results.length} {results.length === 1 ? "platform" : "platforms"}
          </button>
        </div>
      </div>
    </div>
  );

  const empty = (
    <div className="rounded-[10px] border border-dashed border-ink3 px-6 py-14 text-center">
      <p className="text-[18px] font-extrabold">Nothing matches every filter.</p>
      <p className="mt-1.5 text-[15px] text-ink2">
        Remove a filter, or <Link href="/submit/" className="font-semibold text-red underline underline-offset-2">suggest a platform we&apos;re missing</Link>.
      </p>
      {activeN > 0 && <button onClick={clear} className="mt-4 text-[14px] font-bold text-red">Clear all filters</button>}
    </div>
  );

  const SortSelect = (
    <label className="relative inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-rule bg-card pl-3 pr-2 text-[14px]">
      <span className="text-ink3">Sort</span>
      <select value={s.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="appearance-none bg-transparent pr-4 font-semibold outline-none">
        {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2.5 text-[10px]">▾</span>
    </label>
  );

  /* ---------- Category ("chips") mode ---------- */
  if (mode === "chips") {
    const visible = results.slice(0, shown);
    return (
      <div>
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto border-y border-rule px-4 py-3 lg:mx-0 lg:flex-wrap lg:px-0">
          <button onClick={() => setSheet(true)} className="btn-ink inline-flex h-9 flex-none items-center gap-1.5 rounded-[8px] px-3 text-[14px] font-semibold lg:hidden">
            Filters · {activeN}
          </button>
          <span className="mr-2 hidden flex-none text-[15px] font-bold lg:inline">{results.length} {results.length === 1 ? "platform" : "platforms"}</span>
          {pricingOptions.map((m) => <Chip key={m} on={s.pricing.includes(m)} label={PRICING_LABELS[m]} count={count.pricing(m)} onClick={() => update({ pricing: toggle(s.pricing, m) })} />)}
          <span className="mx-1 hidden h-6 w-px flex-none bg-rule lg:block" />
          {featureOptions.map((f) => <Chip key={f} on={s.f.includes(f)} label={FEATURE_LABELS[f]} count={count.f(f)} onClick={() => update({ f: toggle(s.f, f) })} />)}
          <div className="ml-auto hidden lg:block">{SortSelect}</div>
        </div>

        <div className="pt-5">
          {results.length === 0 ? empty : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visible.map((p, i) => (
                  <div key={p.slug} className={!mobileAll && i >= 3 ? "hidden sm:block" : ""}>
                    <PlatformCard p={p} inCategory={lockedCategory} />
                  </div>
                ))}
              </div>
              {!mobileAll && results.length > 3 && (
                <button onClick={() => setMobileAll(true)} className="mt-4 h-11 w-full rounded-[8px] border border-ink text-[15px] font-bold sm:hidden">
                  Show all {results.length} platforms
                </button>
              )}
              {results.length > shown && (
                <button onClick={() => setShown((n) => n + PAGE)} className="mt-6 hidden h-11 w-full rounded-[8px] border border-ink text-[15px] font-bold sm:block">
                  Load more platforms
                </button>
              )}
            </>
          )}
          <Link href={`/directory/?cat=${lockedCategory}`} className="mt-5 inline-block text-[14.5px] font-bold">
            Open in full directory with all filters →
          </Link>
        </div>
        {sheetUI}
      </div>
    );
  }

  /* ---------- Directory ("sidebar") mode ---------- */
  const visible = results.slice(0, shown);
  return (
    <div>
      {/* Search */}
      <label className="flex h-14 items-center gap-3 rounded-[10px] border-2 border-ink bg-card px-4 lg:max-w-[780px]">
        <Magnifier className="size-[17px] flex-none" />
        <span className="sr-only">Search the directory</span>
        <input
          value={s.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search by name, feature or keyword…"
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none lg:text-[17px]"
          enterKeyHint="search"
        />
        {s.q && <button onClick={() => update({ q: "" })} aria-label="Clear search" className="size-8 rounded-[6px] bg-paper2 text-[13px]">✕</button>}
      </label>

      {/* Mobile sticky bar */}
      <div className="sticky top-[58px] z-30 -mx-4 mt-4 grid grid-cols-2 gap-2 border-b border-rule bg-paper px-4 py-2.5 lg:hidden">
        <button onClick={() => setSheet(true)} className="btn-ink inline-flex h-11 items-center justify-center gap-2 rounded-[8px] text-[15px] font-semibold">
          Filters {activeN > 0 && <span className="grid size-5 place-items-center rounded-full bg-red text-[11px] font-bold text-white">{activeN}</span>}
        </button>
        <label className="relative inline-flex h-11 items-center justify-center gap-1 rounded-[8px] border border-rule text-[15px] font-semibold">
          <span>Sort: {SORTS.find(([k]) => k === s.sort)?.[1]} ▾</span>
          <select aria-label="Sort" value={s.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="absolute inset-0 opacity-0">
            {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-10 pt-4 lg:grid-cols-[268px_minmax(0,1fr)] lg:pt-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[17px] font-extrabold">Filters</h2>
            {activeN > 0 && <button onClick={clear} className="text-[14px] font-bold text-red">Clear all</button>}
          </div>
          {!lockedCategory && (
            <Group title="Category">
              {categories.map((c) => <CheckRow key={c.slug} on={s.cat.includes(c.slug)} label={c.name} count={count.cat(c.slug)} onClick={() => update({ cat: toggle(s.cat, c.slug) })} />)}
            </Group>
          )}
          <Group title="Pricing model">
            {(Object.keys(PRICING_LABELS) as PricingModel[]).map((m) => <CheckRow key={m} on={s.pricing.includes(m)} label={PRICING_LABELS[m]} count={count.pricing(m)} onClick={() => update({ pricing: toggle(s.pricing, m) })} />)}
          </Group>
          <Group title="Platform type">
            {(Object.keys(TYPE_LABELS) as PlatformType[]).map((t) => <CheckRow key={t} on={s.type.includes(t)} label={TYPE_LABELS[t]} count={count.type(t)} onClick={() => update({ type: toggle(s.type, t) })} />)}
          </Group>
          <Group title="Features">
            {FILTER_FEATURES.map((f) => <CheckRow key={f} on={s.f.includes(f)} label={FEATURE_LABELS[f]} count={count.f(f)} onClick={() => update({ f: toggle(s.f, f) })} />)}
          </Group>
        </aside>

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
            <p className="text-[15px] font-bold" aria-live="polite">{results.length} {results.length === 1 ? "platform" : "platforms"}</p>
            <div className="no-scrollbar -mx-4 flex flex-1 basis-full gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:basis-auto lg:flex-wrap lg:px-0">
              {activeChips.map((c) => (
                <button key={c.label} onClick={c.remove} aria-label={`Remove filter ${c.label}`}
                  className="btn-ink inline-flex h-8 flex-none items-center gap-1.5 whitespace-nowrap rounded-full pl-3 pr-2.5 text-[13px] font-semibold">
                  {c.label} <span aria-hidden className="text-[11px]">✕</span>
                </button>
              ))}
            </div>
            <div className="ml-auto hidden items-center gap-2 lg:flex">
              <div role="radiogroup" aria-label="Sort" className="inline-flex h-9 rounded-[8px] bg-paper2 p-[3px]">
                {SORTS.map(([k, l]) => (
                  <button key={k} role="radio" aria-checked={s.sort === k} onClick={() => update({ sort: k })}
                    className={`rounded-[6px] px-3 text-[13.5px] font-semibold ${s.sort === k ? "bg-card text-ink shadow-[0_0_0_1px_var(--rule)]" : "text-ink3 hover:text-ink"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div role="radiogroup" aria-label="View" className="inline-flex h-9 rounded-[8px] bg-paper2 p-[3px]">
                {(["grid", "list"] as const).map((v) => (
                  <button key={v} role="radio" aria-checked={view === v} onClick={() => setView(v)}
                    className={`rounded-[6px] px-3 text-[13.5px] font-semibold capitalize ${view === v ? "bg-card text-ink shadow-[0_0_0_1px_var(--rule)]" : "text-ink3 hover:text-ink"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5">
            {results.length === 0 ? empty : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                {visible.map((p) => <PlatformCard key={p.slug} p={p} />)}
              </div>
            ) : (
              <div className="border-t border-rule">{visible.map((p) => <PlatformCard key={p.slug} p={p} variant="row" />)}</div>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-[13.5px] text-ink3">Showing {Math.min(shown, results.length)} of {results.length}</p>
              {results.length > shown && (
                <button onClick={() => setShown((n) => n + PAGE)} className="h-12 rounded-[8px] border-2 border-ink px-8 text-[15px] font-bold hover:bg-ink hover:text-paper">
                  Load more platforms
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {sheetUI}
    </div>
  );
}
