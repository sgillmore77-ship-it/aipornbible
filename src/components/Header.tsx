"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Magnifier, SearchBox } from "./SearchBox";
import type { SearchItem } from "@/lib/search-match";

const NAV = [
  { href: "/directory/", label: "Directory" },
  { href: "#categories", label: "Categories" },
  { href: "/reviews/", label: "Reviews" },
  { href: "/comparisons/", label: "Comparisons" },
  { href: "/guides/", label: "Guides" },
  { href: "/news/", label: "News" },
];

export function Header({ searchIndex, siteCount, categories }: {
  searchIndex: SearchItem[];
  siteCount: number;
  categories: { slug: string; name: string; short: string; count: number }[];
}) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [cats, setCats] = useState(false);
  const catsRef = useRef<HTMLLIElement>(null);

  useEffect(() => { setMenu(false); setSearch(false); setCats(false); }, [path]);
  useEffect(() => {
    if (!cats) return;
    const onDoc = (e: MouseEvent) => { if (!catsRef.current?.contains(e.target as Node)) setCats(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [cats]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") { setSearch(false); setMenu(false); setCats(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto flex h-[58px] max-w-[1440px] items-center gap-10 pl-4 pr-1.5 lg:h-[68px] lg:px-10">
        <Link href="/" aria-label="AI Porn Bible home" className="flex-none hover:!text-ink">
          <span className="lg:hidden"><Logo size="sm" /></span>
          <span className="hidden lg:inline"><Logo /></span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-1 text-[15px] font-semibold">
            {NAV.map((n) => {
              if (n.href === "#categories") {
                const active = path?.startsWith("/category/");
                return (
                  <li key={n.href} ref={catsRef} className="group relative">
                    <button
                      type="button"
                      onClick={() => setCats((o) => !o)}
                      aria-expanded={cats}
                      aria-controls="nav-categories"
                      className={`flex items-center gap-1.5 rounded-[6px] px-3 py-2 hover:text-red ${active || cats ? "bg-paper2" : ""}`}
                    >
                      Categories
                      <svg viewBox="0 0 10 6" aria-hidden="true" className={`size-2.5 transition-transform ${cats ? "rotate-180" : ""}`}><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    {/* Always in the HTML (crawlable); shown on hover, or opened with a click / Enter. */}
                    <div
                      id="nav-categories"
                      className={`absolute left-0 top-full z-50 pt-2 ${cats ? "visible opacity-100" : "invisible opacity-0 group-hover:visible group-hover:opacity-100"} transition-opacity duration-100`}
                    >
                      <div className="w-[640px] rounded-[10px] border border-rule bg-card p-2 shadow-[0_20px_50px_rgba(17,17,20,.14)]">
                        <ul className="grid grid-cols-2 gap-0.5">
                          {categories.map((c) => {
                            const here = path === `/category/${c.slug}/`;
                            return (
                              <li key={c.slug}>
                                <Link
                                  href={`/category/${c.slug}/`}
                                  aria-current={here ? "page" : undefined}
                                  className={`flex flex-col gap-0.5 rounded-[7px] px-3 py-2.5 hover:bg-paper2 hover:!text-ink ${here ? "bg-paper2" : ""}`}
                                >
                                  <span className="flex items-baseline justify-between gap-3">
                                    <span className="text-[15px] font-bold">{c.name}</span>
                                    <span className="flex-none text-[12px] font-semibold text-ink3">{c.count}</span>
                                  </span>
                                  <span className="line-clamp-1 text-[13px] font-normal text-ink3">{c.short}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <Link href="/directory/" className="mt-1 flex items-center justify-between rounded-[7px] border-t border-rule px-3 pb-1.5 pt-3 text-[14px] font-bold text-red">
                          <span>All platforms in the directory</span><span>→</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              }
              const active = path?.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active ? "page" : undefined} className={`block rounded-[6px] px-3 py-2 ${active ? "bg-paper2" : ""}`}>
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setSearch((s) => !s)}
            aria-expanded={search}
            className="flex h-10 w-[260px] items-center gap-2.5 rounded-[8px] bg-paper2 px-3.5 text-[14px] text-ink3 hover:text-ink"
          >
            <Magnifier className="size-3.5" />
            Search {siteCount} sites
            <kbd className="ml-auto rounded border border-rule px-1.5 text-[11px] text-ink3">/</kbd>
          </button>
          <span title="Adults only" className="inline-flex h-7 items-center rounded-[6px] bg-ink px-2 text-[12px] font-extrabold text-paper">18+</span>
        </div>

        <div className="ml-auto flex lg:hidden">
          <button onClick={() => { setSearch((s) => !s); setMenu(false); }} aria-label="Search" aria-expanded={search} className="grid size-11 place-items-center">
            <Magnifier className="size-[18px]" />
          </button>
          <button onClick={() => { setMenu((m) => !m); setSearch(false); }} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} className="grid size-11 place-items-center">
            {menu ? (
              <span className="text-[20px] leading-none">✕</span>
            ) : (
              <span className="flex flex-col gap-1"><span className="h-0.5 w-5 bg-ink" /><span className="h-0.5 w-5 bg-ink" /><span className="h-0.5 w-5 bg-ink" /></span>
            )}
          </button>
        </div>
      </div>

      {search && (
        <div className="border-t border-rule bg-paper">
          <div className="mx-auto max-w-[860px] px-4 py-4 lg:px-10">
            <SearchBox items={searchIndex} variant="compact" autoFocus onNavigate={() => setSearch(false)} />
          </div>
        </div>
      )}

      {menu && (
        <div className="fixed inset-x-0 bottom-0 top-[58px] z-50 overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Mobile" className="px-4 pb-10 pt-2">
            <ul>
              {NAV.filter((n) => n.href !== "#categories").map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="display display-80 flex min-h-14 items-center justify-between border-b border-rule text-[26px]">
                    {n.label} <span className="text-red">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-8 text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Categories</p>
            <ul className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}/`} className="flex min-h-11 items-center justify-between border-b border-rule text-[16px] font-semibold">
                    {c.name}
                    <span className="text-[13px] font-normal text-ink3">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-[13px] text-ink3">
              <span className="inline-flex h-6 items-center rounded-[5px] bg-ink px-1.5 text-[11px] font-extrabold text-paper">18+</span>
              Adults only.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
