import Link from "next/link";
import { SITE } from "@/lib/data";
import type { Fact } from "@/lib/types";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 lg:px-10 ${className}`}>{children}</div>;
}

/** Logo or monogram tile. Size in px. */
export function Tile({ name, initials, hue, logo, size = 48, radius }: { name: string; initials?: string; hue: number; logo?: string; size?: number; radius?: number }) {
  const r = radius ?? (size >= 48 ? 10 : size >= 36 ? 8 : 6);
  const style = { width: size, height: size, borderRadius: r };
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={`${name} logo`} style={style} className="flex-none object-cover" loading="lazy" />;
  }
  const ini = initials ?? name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  return (
    <span
      aria-hidden="true"
      style={{ ...style, background: `oklch(0.94 0.035 ${hue})`, color: `oklch(0.42 0.12 ${hue})`, fontSize: Math.round(size * 0.37) }}
      className="grid flex-none place-items-center font-extrabold"
    >
      {ini}
    </span>
  );
}

const labelBase = "inline-flex flex-none items-center font-bold uppercase tracking-[0.06em]";
export function SponsoredLabel({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <span title="Paid placement. Never affects the rating." className={`${labelBase} bg-gold text-goldink ${size === "sm" ? "h-[18px] rounded-[3px] px-1.5 text-[9.5px]" : "h-[22px] rounded-[4px] px-2 text-[11px]"}`}>
      Sponsored
    </span>
  );
}
export function AdLabel() {
  return <span title="Sponsored" className={`${labelBase} h-4 rounded-[3px] bg-gold px-[5px] text-[9px] text-goldink`}>Ad</span>;
}
export function PickLabel({ size = "md", short = false }: { size?: "md" | "sm"; short?: boolean }) {
  return (
    <span title="Chosen by our editors. Never paid for." className={`${labelBase} bg-redsoft text-red ${size === "sm" ? "h-[18px] rounded-[3px] px-1.5 text-[9.5px]" : "h-[22px] rounded-[4px] px-2 text-[11px]"}`}>
      ★ {short ? "Pick" : "Editor's pick"}
    </span>
  );
}
export function PricingTag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-6 items-center rounded-[4px] bg-ink px-2 text-[12px] font-semibold text-paper">{children}</span>;
}
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-6 items-center rounded-[4px] bg-paper2 px-2 text-[12px] text-ink2">{children}</span>;
}

const TYPE_TAG = {
  review: "bg-ink text-paper",
  comparison: "bg-redsoft text-red",
  guide: "bg-paper2 text-ink2",
  news: "bg-paper2 text-ink2",
} as const;
export function TypeTag({ kind, wide = false, children }: { kind: keyof typeof TYPE_TAG; wide?: boolean; children?: React.ReactNode }) {
  return (
    <span className={`${labelBase} h-6 justify-center rounded-[4px] px-2 text-[11px] ${TYPE_TAG[kind]} ${wide ? "self-start lg:w-24 lg:self-auto" : "self-start"}`}>
      {children ?? kind}
    </span>
  );
}

export function RatingPill({ value }: { value: number }) {
  return (
    <span aria-label={`Rating ${value.toFixed(1)} out of 10`} className="inline-flex h-[30px] flex-none items-baseline gap-px rounded-[6px] bg-paper2 px-[9px] pt-[5px]">
      <span className="text-[16px] font-extrabold">{value.toFixed(1)}</span>
      <span className="text-[11px] text-ink3">/10</span>
    </span>
  );
}

export function UnverifiedTag() {
  return (
    <span
      title="Claimed by the platform, not yet confirmed"
      className="inline-flex h-[18px] flex-none items-center rounded-[3px] border border-dashed border-goldline px-1.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-ink2"
    >
      Unverified
    </span>
  );
}

/** Renders a Fact, or "Not yet verified" when unknown. */
export function FactValue({ fact }: { fact?: Fact }) {
  if (!fact) return <span className="text-ink3">Not yet verified</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span>{fact.value}</span>
      {fact.unverified && <UnverifiedTag />}
    </span>
  );
}

export function FeatureIcon({ value }: { value: "yes" | "no" | "unknown" }) {
  const label = value === "yes" ? "Yes" : value === "no" ? "No" : "Unknown";
  if (value === "yes")
    return <span role="img" aria-label={label} className="grid size-[26px] flex-none place-items-center rounded-[6px] bg-ink text-[13px] font-bold text-paper">✓</span>;
  if (value === "no")
    return <span role="img" aria-label={label} className="grid size-[26px] flex-none place-items-center rounded-[6px] border border-red text-[13px] font-bold text-red">✕</span>;
  return <span role="img" aria-label={label} className="grid size-[26px] flex-none place-items-center rounded-[6px] border border-dashed border-ink3 text-[13px] font-bold text-ink3">?</span>;
}

export function SectionHead({ title, caption, href, linkLabel, star, small = false, muted = false }: {
  title: string; caption?: React.ReactNode; href?: string; linkLabel?: string; star?: boolean; small?: boolean; muted?: boolean;
}) {
  return (
    <div className="mb-[18px] flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
      <h2 className={`display display-80 ${small ? "text-[24px] lg:text-[28px]" : "text-[26px] lg:text-[34px]"}`}>
        {star && <span className="text-red">★ </span>}
        {title}
      </h2>
      {caption && <span className="text-[13.5px] text-ink3 lg:text-[15px]">{caption}</span>}
      {href && (
        <Link href={href} className={`ml-auto text-[14px] font-bold ${muted ? "font-semibold text-ink3" : ""}`}>
          {linkLabel ?? "View all"} {!muted && "→"}
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE.url + it.href })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-[13.5px] text-ink3">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === all.length - 1 ? <span aria-current="page" className="text-ink2">{it.name}</span> : <Link href={it.href}>{it.name}</Link>}
          </li>
        ))}
      </ol>
      <JsonLd data={ld} />
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SampleNotice({ what = "listing" }: { what?: string }) {
  return (
    <div className="rounded-[8px] border border-dashed border-goldline bg-goldsoft px-4 py-2.5 text-[13.5px] text-ink2">
      <strong className="font-bold text-ink">Sample {what}.</strong> Placeholder content showing the template. Not a real platform, and not indexed by search engines.
    </div>
  );
}

export function AdsExplainer({ short = false }: { short?: boolean }) {
  return (
    <>
      Includes paid placements, always labelled{" "}
      {short ? "Sponsored." : <><span className="align-[1px]"><SponsoredLabel size="sm" /></span>. Ads never change a rating.</>}
    </>
  );
}
