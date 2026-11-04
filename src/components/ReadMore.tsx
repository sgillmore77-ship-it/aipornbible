"use client";

import { useState } from "react";

/** On mobile, shows the first paragraph and a "Read more" toggle. Desktop shows everything. */
export function ReadMore({ paragraphs, className = "" }: { paragraphs: React.ReactNode[]; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <div key={i} className={i > 0 && !open ? "hidden lg:block" : ""}>{p}</div>
      ))}
      {paragraphs.length > 1 && (
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-2 text-[15px] font-bold text-red lg:hidden">
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
