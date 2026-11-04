"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Magnifier, SearchBox } from "./SearchBox";
import type { SearchItem } from "@/lib/search-match";

const NAV = [
  { href: "/directory/", label: "Directory" },
  { href: "/categories/", label: "Categories" },
  { href: "/reviews/", label: "Reviews" },
  { href: "/comparisons/", label: "Comparisons" },
  { href: "/guides/", label: "Guides" },
  { href: "/news/", label: "News" },
];

export function Header({ searchIndex, siteCount, categories }: {
  searchIndex: SearchItem[];
  siteCount: number;
  categories: { slug: string; name: string; count: number }[];
}) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => { setMenu(false); setSearch(false); }, [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") { setSearch(false); setMenu(false); }
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
              const active = path?.startsWith(n.href) || (n.href === "/categories/" && path?.startsWith("/category/"));
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
              {NAV.map((n) => (
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
