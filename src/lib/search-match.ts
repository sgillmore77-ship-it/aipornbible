export interface SearchItem {
  kind: "platform" | "category";
  title: string;
  sub: string;
  href: string;
  haystack: string;
  count?: number;
  go?: string;
  rel?: string;
  hue?: number;
  initials?: string;
  logo?: string;
  rating?: number;
  sponsored?: boolean;
}

export function matchSearch(items: SearchItem[], q: string): { cats: SearchItem[]; sites: SearchItem[] } {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return { cats: [], sites: [] };
  const hits = items
    .filter((i) => terms.every((t) => i.haystack.includes(t)))
    .sort((a, b) => Number(b.title.toLowerCase().startsWith(terms[0])) - Number(a.title.toLowerCase().startsWith(terms[0])));
  return { cats: hits.filter((h) => h.kind === "category").slice(0, 3), sites: hits.filter((h) => h.kind === "platform").slice(0, 5) };
}
