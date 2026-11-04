"use client";

import { useEffect, useState } from "react";

/** Sticky table of contents with scroll-spy. */
export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="Contents" className="sticky top-[92px]">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Contents</p>
      <ol className="border-l border-rule">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-4 text-[14.5px] leading-[1.35] ${active === i.id ? "border-red font-semibold text-red" : "border-transparent text-ink"}`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
