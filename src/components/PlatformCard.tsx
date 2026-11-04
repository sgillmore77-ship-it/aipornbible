import Link from "next/link";
import { AdLabel, PickLabel, PricingTag, RatingPill, SponsoredLabel, Tag, Tile } from "./ui";
import { catLabel, formatDate, outboundHref, outboundRel } from "@/lib/format";
import { PRICING_LABELS } from "@/lib/labels";
import type { Platform } from "@/lib/types";

export function VisitLink({ p, className = "", children = "Visit site ↗", variant = "red", label }: {
  p: Platform; className?: string; children?: React.ReactNode; variant?: "red" | "ink" | "plain"; label?: string;
}) {
  const v = variant === "red" ? "btn-red" : variant === "ink" ? "btn-ink" : "";
  return (
    <a href={outboundHref(p)} target="_blank" rel={outboundRel(p)} aria-label={label} className={`inline-flex items-center justify-center gap-1.5 ${v} ${className}`}>
      {children}
    </a>
  );
}

export function PlatformCard({ p, variant = "grid", maxTags = 2, inCategory }: {
  p: Platform; variant?: "grid" | "row" | "mini"; maxTags?: number; inCategory?: string;
}) {
  const href = `/platform/${p.slug}/`;
  const sponsored = p.commercial.sponsored;
  const pick = p.commercial.editorsPick;
  const rating = p.editorial?.rating;
  const cat = catLabel(p, inCategory && p.categories.includes(inCategory) ? inCategory : p.primaryCategory);

  if (variant === "mini") {
    return (
      <div className="grid min-h-11 grid-cols-[28px_minmax(0,1fr)_auto_32px] items-center gap-2.5 border-t border-rule py-1">
        <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={28} />
        <span className="flex min-w-0 items-center gap-[7px]">
          <Link href={href} className="truncate text-[15px] font-semibold">{p.name}</Link>
          {sponsored && <AdLabel />}
          {pick && <span title="Editor's pick" className="flex-none text-[12px] text-red">★</span>}
        </span>
        <span className="text-[13px] font-bold text-ink2">{rating?.toFixed(1) ?? ""}</span>
        <a
          href={outboundHref(p)}
          target="_blank"
          rel={outboundRel(p)}
          aria-label={`Visit ${p.name}`}
          className="grid size-8 place-items-center rounded-[6px] bg-paper2 text-[14px] font-bold text-ink hover:!bg-red hover:!text-white"
        >
          ↗
        </a>
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 border-b border-rule py-3">
        <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={40} radius={8} />
        <div className="flex min-w-0 flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={href} className="text-[15.5px] font-bold">{p.name}</Link>
            {rating !== undefined && <span className="text-[12.5px] font-bold">{rating.toFixed(1)}</span>}
            {sponsored && <SponsoredLabel size="sm" />}
            {pick && <PickLabel size="sm" short />}
          </div>
          <span className="truncate text-[13px] text-ink3">{cat} · Added {formatDate(p.dateAdded)}</span>
        </div>
        <VisitLink p={p} variant="ink" className="h-9 rounded-[6px] px-3.5 text-[13.5px] font-semibold">Visit ↗</VisitLink>
      </div>
    );
  }

  return (
    <article
      className={`flex h-full flex-col gap-3 rounded-[10px] border p-4 transition-colors hover:border-ink3 ${sponsored ? "border-goldline bg-goldsoft" : "border-rule bg-card"}`}
    >
      <div className="flex items-center gap-3">
        <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={48} />
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <Link href={href} className="text-[17px] font-bold leading-[1.2]">{p.name}</Link>
          <span className="text-[13px] text-ink3">{cat}</span>
        </div>
        {rating !== undefined && <RatingPill value={rating} />}
      </div>
      {(sponsored || pick) && (
        <div className="flex gap-1.5">
          {sponsored && <SponsoredLabel />}
          {pick && <PickLabel />}
        </div>
      )}
      <p className="text-[14.5px] leading-[1.5] text-pretty text-ink2">{p.shortDescription}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        <PricingTag>{PRICING_LABELS[p.pricingModel]}</PricingTag>
        {p.tags.slice(0, maxTags).map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
      <div className="flex gap-2 pt-1">
        <VisitLink p={p} className="h-10 flex-1 rounded-[6px] text-[14.5px] font-bold" />
        <Link href={href} className="inline-flex h-10 items-center justify-center rounded-[6px] border border-rule px-3.5 text-[14px] font-semibold text-ink hover:border-ink">
          Details
        </Link>
      </div>
    </article>
  );
}
