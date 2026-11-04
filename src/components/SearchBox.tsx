"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { matchSearch, type SearchItem } from "@/lib/search-match";

function Magnifier({ className = "", stroke = 2.5 }: { className?: string; stroke?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="m13 13 5 5" />
    </svg>
  );
}
export { Magnifier };

const POPULAR: [string, string][] = [
  ["Sex chat", "chat"],
  ["Image generators", "generator"],
  ["AI girlfriends", "girlfriend"],
  ["Free", "free"],
  ["No signup", "no signup"],
];

export function SearchBox({ items, variant = "hero", autoFocus = false, onNavigate }: {
  items: SearchItem[];
  variant?: "hero" | "compact";
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Debounce matching by ~120ms.
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 120);
    return () => clearTimeout(t);
  }, [q]);

  const { cats, sites } = useMemo(() => matchSearch(items, dq), [items, dq]);
  const flat = [...cats, ...sites];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (href: string) => { setOpen(false); onNavigate?.(); router.push(href); };
  const all = `/directory/?q=${encodeURIComponent(q.trim())}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && flat[active]) return go(flat[active].href);
    if (q.trim()) go(all);
  };

  const hero = variant === "hero";
  const showDrop = open && q.trim().length > 0 && dq.trim().length > 0;

  return (
    <div className={hero ? "flex flex-col gap-[18px]" : ""}>
      <div ref={wrap} className="relative z-20 max-w-[780px]">
        <form onSubmit={submit} role="search">
          <div
            className={`flex items-center gap-3 rounded-[10px] border-2 border-ink bg-card ${hero ? "h-[54px] pl-4 pr-[5px] lg:h-[62px] lg:pl-5 lg:pr-1.5" : "h-12 pl-4 pr-1.5"}`}
          >
            <Magnifier className="hidden size-[18px] flex-none text-ink lg:block" />
            <input
              ref={input}
              autoFocus={autoFocus}
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, flat.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
                if (e.key === "Escape") { setOpen(false); input.current?.blur(); }
              }}
              placeholder="Search sites, categories or features…"
              aria-label="Search the directory"
              className={`h-full min-w-0 flex-1 bg-transparent outline-none ${hero ? "text-[16px] lg:text-[18px]" : "text-[16px]"}`}
              role="combobox"
              aria-expanded={showDrop}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              enterKeyHint="search"
            />
            {q && (
              <button type="button" onClick={() => { setQ(""); setDq(""); input.current?.focus(); }} aria-label="Clear search" className="hidden size-9 flex-none rounded-[6px] bg-paper2 text-[14px] sm:block">
                ✕
              </button>
            )}
            <button type="submit" aria-label="Search" className="btn-red grid h-[42px] w-11 flex-none place-items-center rounded-[7px] text-[16px] font-bold lg:h-12 lg:w-auto lg:px-[26px]">
              <Magnifier className="size-[15px] lg:hidden" stroke={2.2} />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </form>

        {showDrop && (
          <div id={listId} role="listbox" className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[10px] border border-rule bg-card shadow-[0_20px_50px_rgba(17,17,20,.14)]">
            {cats.length > 0 && (
              <>
                <div className="px-[18px] pb-1 pt-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Categories</div>
                {cats.map((c, i) => (
                  <Link
                    key={c.href}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={active === i}
                    href={c.href}
                    onClick={() => { setOpen(false); onNavigate?.(); }}
                    className={`flex items-center gap-3 px-[18px] py-2.5 hover:bg-paper2 ${active === i ? "bg-paper2" : ""}`}
                  >
                    <span className="flex-1 text-[16px] font-bold">{c.title}</span>
                    <span className="text-[13.5px] text-ink3">{c.count} sites →</span>
                  </Link>
                ))}
              </>
            )}
            {sites.length > 0 && (
              <>
                <div className="px-[18px] pb-1 pt-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Sites</div>
                {sites.map((s, j) => {
                  const i = cats.length + j;
                  return (
                    <div
                      key={s.href}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={active === i}
                      className={`flex items-center gap-3 px-[18px] py-2 hover:bg-paper2 ${active === i ? "bg-paper2" : ""}`}
                    >
                      <span
                        aria-hidden
                        style={{ background: `oklch(0.94 0.035 ${s.hue})`, color: `oklch(0.42 0.12 ${s.hue})` }}
                        className="grid size-9 flex-none place-items-center rounded-[8px] text-[14px] font-extrabold"
                      >
                        {s.initials}
                      </span>
                      <Link href={s.href} onClick={() => { setOpen(false); onNavigate?.(); }} className="flex min-w-0 flex-1 flex-col gap-px">
                        <span className="text-[15.5px] font-bold">{s.title}</span>
                        <span className="truncate text-[13px] text-ink3">{s.sub}</span>
                      </Link>
                      {s.sponsored && (
                        <span className="hidden h-5 items-center rounded-[3px] bg-gold px-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-goldink sm:inline-flex">Sponsored</span>
                      )}
                      <span className="min-w-[30px] text-right text-[14px] font-extrabold">{s.rating?.toFixed(1) ?? ""}</span>
                      <a href={s.go} target="_blank" rel={s.rel} className="btn-ink inline-flex h-[34px] items-center rounded-[6px] px-3 text-[13px] font-semibold">
                        Visit ↗
                      </a>
                    </div>
                  );
                })}
              </>
            )}
            {flat.length === 0 && (
              <div className="px-[18px] py-5 text-[15px] text-ink2">
                No matches for “{q}”. Try a category or a feature like “voice”.
              </div>
            )}
            <Link
              href={all}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className="mt-1.5 flex justify-between border-t border-rule px-[18px] py-[13px] text-[14px] font-bold"
            >
              <span>See all results for “{q}”</span>
              <span className="hidden text-ink3 sm:inline">Enter ↵</span>
            </Link>
          </div>
        )}
      </div>

      {hero && (
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 text-[14px] text-ink3 lg:mx-0 lg:flex-wrap lg:px-0">
          <span className="hidden lg:inline">Popular:</span>
          {POPULAR.map(([label, query]) => (
            <button
              key={label}
              type="button"
              onClick={() => { setQ(query); setOpen(true); input.current?.focus(); }}
              className="inline-flex h-11 flex-none items-center whitespace-nowrap rounded-[8px] bg-paper2 px-3.5 text-[15px] font-medium text-ink hover:bg-rule lg:h-8 lg:rounded-[6px] lg:px-3 lg:text-[14px]"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
