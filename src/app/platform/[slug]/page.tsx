import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, FactValue, FeatureIcon, PickLabel, SampleNotice, SponsoredLabel, Tile, UnverifiedTag } from "@/components/ui";
import { PlatformCard, VisitLink } from "@/components/PlatformCard";
import { getCategory } from "@/content/categories";
import {
  boxRank, categoryName, comparisonForCategory, articlePath, formatDate, formatMonth, getPlatform,
  isIndexablePlatform, platformsInCategory, publishedPlatforms, reviewForPlatform,
} from "@/lib/data";
import { FEATURE_LABELS, PRICING_LABELS, TYPE_LABELS, verdictWord } from "@/lib/labels";
import type { Fact, FilterFeature, Platform } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => publishedPlatforms().map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPlatform((await params).slug);
  if (!p) return {};
  const cat = categoryName(p.primaryCategory).replace(/s$/, "");
  return {
    title: `${p.name} Review: ${cat} – Pricing, Features & Alternatives`,
    description: `${p.shortDescription} See ${p.name}'s pricing, features, pros and cons, and the best alternatives.`,
    alternates: { canonical: `/platform/${p.slug}/` },
    robots: isIndexablePlatform(p) ? undefined : { index: false, follow: true },
  };
}

function Bar({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
  return (
    <div className={`grid items-center gap-3 ${compact ? "grid-cols-[72px_1fr_30px]" : "grid-cols-[80px_1fr_34px]"}`}>
      <span className="text-[13.5px] text-ink2">{label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-paper2"><span className="block h-full rounded-full bg-ink" style={{ width: `${value * 10}%` }} /></span>
      <span className="text-right text-[13.5px] font-bold tabular-nums">{value.toFixed(1)}</span>
    </div>
  );
}

function KV({ k, v }: { k: string; v?: Fact | React.ReactNode }) {
  const isFact = v && typeof v === "object" && "value" in (v as object);
  return (
    <div className="flex flex-col gap-1 border-b border-rule py-3 last:border-0 sm:grid sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-[13.5px] text-ink3">{k}</dt>
      <dd className="text-[15px] font-medium">{isFact || v === undefined ? <FactValue fact={v as Fact | undefined} /> : (v as React.ReactNode)}</dd>
    </div>
  );
}

function glanceRows(p: Platform): [string, Fact | React.ReactNode][] {
  return [
    ["Type", TYPE_LABELS[p.platformType]],
    ["Pricing model", PRICING_LABELS[p.pricingModel]],
    ["Price", p.glance.price],
    ["Free trial", p.glance.freeAccess],
    ["Payment", p.glance.payment],
    ["Devices", p.glance.devices],
    ["Account needed", p.glance.account],
    ["Billing name", p.glance.billingName],
  ];
}

export default async function PlatformPage({ params }: Props) {
  const p = getPlatform((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.primaryCategory)!;
  const e = p.editorial;
  const review = reviewForPlatform(p.slug);
  const compare = comparisonForCategory(p.primaryCategory);
  const alternatives = platformsInCategory(p.primaryCategory).filter((x) => x.slug !== p.slug).sort(boxRank).slice(0, 4);
  const features = p.features.map((f) => ({ ...f, label: f.label ?? FEATURE_LABELS[f.key as FilterFeature] ?? f.key }));
  const privacyRows: [string, Fact | undefined][] = p.privacy
    ? [
        ["Data retention", p.privacy.dataRetention],
        ["Training on your chats", p.privacy.trainingOnChats],
        ["Age verification", p.privacy.ageVerification],
        ["Allowed content", p.privacy.allowedContent],
        ["Prohibited content", p.privacy.prohibitedContent],
      ]
    : [];
  const disclose = p.commercial.affiliateActive || p.commercial.sponsored;

  return (
    <>
      <Container className="pb-24 lg:pb-20">
        <div className="pt-5 lg:pt-8">
          <Breadcrumbs items={[{ name: cat.name, href: `/category/${cat.slug}/` }, { name: p.name, href: `/platform/${p.slug}/` }]} />
        </div>
        {p.isSample && <div className="mt-4"><SampleNotice /></div>}

        {/* Head */}
        <section className="grid gap-6 border-b border-rule pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 lg:pb-12 lg:pt-8">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:gap-6">
            <span className="sm:hidden"><Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={64} radius={12} /></span>
            <span className="hidden sm:block"><Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={112} radius={18} /></span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {p.commercial.sponsored && <SponsoredLabel />}
                {p.commercial.editorsPick && <PickLabel />}
                {p.categories.map((c) => (
                  <Link key={c} href={`/category/${c}/`} className="inline-flex h-[22px] items-center rounded-[4px] bg-paper2 px-2 text-[12px] font-semibold text-ink2">{categoryName(c)}</Link>
                ))}
              </div>
              <h1 className="display mt-3 text-[44px] lg:text-[72px]">{p.name}</h1>
              <p className="mt-3 max-w-[640px] text-[16px] leading-[1.5] text-ink2 lg:text-[19px]">{p.shortDescription}</p>
              <p className="mt-3 text-[13.5px] text-ink3">
                {e && <>Reviewed by {e.reviewer} · Last checked {formatDate(e.lastChecked)} · </>}Listed since {formatMonth(p.dateAdded)}
              </p>
            </div>
          </div>

          {/* Rating box */}
          <div className="flex flex-col gap-4 rounded-[8px] border-[1.5px] border-ink p-5 lg:self-start">
            {e?.rating !== undefined ? (
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Our rating</p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="display text-[56px] lg:text-[64px]" style={{ fontStretch: "85%" }}>{e.rating.toFixed(1)}</span>
                    <span className="text-[18px] font-bold text-ink3">/10</span>
                  </p>
                </div>
                <div className="pb-2 text-right">
                  <p className="text-[18px] font-extrabold">{verdictWord(e.rating)}</p>
                  <p className="text-[12.5px] text-ink3">{e.basis === "hands-on" ? "Hands-on tested" : "Based on research"}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Our rating</p>
                <p className="mt-1 text-[22px] font-extrabold">Not yet rated</p>
                <p className="text-[13.5px] text-ink3">Listed and checked, but not yet fully assessed.</p>
              </div>
            )}
            {e?.subScores && (
              <div className="flex flex-col gap-2">
                {e.subScores.map((s, i) => <div key={s.label} className={i >= 3 ? "hidden sm:block" : ""}><Bar label={s.label} value={s.value} /></div>)}
              </div>
            )}
            <div className="hidden sm:block"><VisitLink p={p} className="h-[58px] w-full rounded-[8px] text-[18px] font-bold">Visit {p.name} ↗</VisitLink></div>
            {disclose && (
              <p className="hidden text-[12.5px] leading-[1.45] text-ink3 sm:block">
                Affiliate link. We may earn a commission; it never affects our rating.{" "}
                <Link href="/affiliate-disclosure/" className="underline underline-offset-2">Disclosure</Link>
              </p>
            )}
          </div>
        </section>

        {/* Body */}
        <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,820px)_360px] lg:justify-between lg:gap-[72px] lg:pt-14">
          <div className="flex min-w-0 flex-col gap-12">
            {/* At a glance (mobile) */}
            <section className="lg:hidden">
              <h2 className="display display-80 mb-3 text-[24px]">At a glance</h2>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule">
                {glanceRows(p).slice(0, 6).map(([k, v]) => (
                  <div key={k} className="bg-card p-3">
                    <dt className="text-[12px] text-ink3">{k}</dt>
                    <dd className="mt-0.5 text-[14.5px] font-semibold">{v && typeof v === "object" && "value" in (v as object) ? <FactValue fact={v as Fact} /> : v === undefined ? <FactValue /> : (v as React.ReactNode)}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {e?.about && (
              <section>
                <h2 className="display display-80 text-[28px] lg:text-[34px]">About {p.name}</h2>
                <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-ink2 lg:text-[17.5px]">{e.about.map((t, i) => <p key={i}>{t}</p>)}</div>
              </section>
            )}

            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="display display-80 text-[28px] lg:text-[34px]">Features</h2>
                <p className="flex flex-wrap items-center gap-3 text-[12.5px] text-ink3">
                  <span className="inline-flex items-center gap-1.5"><FeatureIcon value="yes" /> Yes</span>
                  <span className="inline-flex items-center gap-1.5"><FeatureIcon value="no" /> No</span>
                  <span className="inline-flex items-center gap-1.5"><FeatureIcon value="unknown" /> Unknown</span>
                  <span className="inline-flex items-center gap-1.5"><UnverifiedTag /> = claimed, not yet tested</span>
                </p>
              </div>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f.key} className="flex min-h-12 items-center gap-3 border-b border-rule py-2">
                    <FeatureIcon value={f.value} />
                    <span className={`flex-1 text-[15px] ${f.value === "yes" ? "font-semibold text-ink" : "text-ink2"}`}>{f.label}</span>
                    {f.unverified && <UnverifiedTag />}
                  </li>
                ))}
              </ul>
            </section>

            {e && (e.pros.length > 0 || e.cons.length > 0) && (
              <section className="grid gap-6 sm:grid-cols-2">
                <div className="border-t-[3px] border-ink pt-4">
                  <h3 className="text-[18px] font-extrabold">Pros</h3>
                  <ul className="mt-3 space-y-2.5">{e.pros.map((t) => <li key={t} className="flex gap-2.5 text-[15.5px] leading-[1.45]"><span className="font-extrabold">+</span>{t}</li>)}</ul>
                </div>
                <div className="border-t-[3px] border-red pt-4">
                  <h3 className="text-[18px] font-extrabold">Cons</h3>
                  <ul className="mt-3 space-y-2.5">{e.cons.map((t) => <li key={t} className="flex gap-2.5 text-[15.5px] leading-[1.45]"><span className="font-extrabold text-red">−</span>{t}</li>)}</ul>
                </div>
              </section>
            )}

            {e && (
              <section>
                <h2 className="display display-80 text-[28px] lg:text-[34px]">Our assessment</h2>
                <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-ink2 lg:text-[17.5px]">{e.assessment.map((t, i) => <p key={i}>{t}</p>)}</div>
                {e.verdict && (
                  <blockquote className="mt-6 rounded-[10px] border border-rule bg-paper2 px-6 py-5 text-[19px] font-bold leading-[1.4] lg:text-[22px]">
                    “{e.verdict}”
                  </blockquote>
                )}
                <p className="mt-4 text-[13px] text-ink3">
                  {e.basis === "hands-on" ? "Based on hands-on testing" : "Based on research, not hands-on testing"} · Last checked {formatDate(e.lastChecked)}
                </p>
                {review && <Link href={articlePath(review)} className="mt-3 inline-block text-[15px] font-bold text-red">Read the full {p.name} review →</Link>}
              </section>
            )}

            {privacyRows.length > 0 && (
              <section>
                <h2 className="display display-80 text-[28px] lg:text-[34px]">Privacy &amp; content rules</h2>
                <dl className="mt-4 border-t border-rule">{privacyRows.map(([k, v]) => <KV key={k} k={k} v={v} />)}</dl>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[92px] rounded-[10px] border border-rule p-5">
              <h2 className="text-[17px] font-extrabold">At a glance</h2>
              <dl className="mt-2">
                {glanceRows(p).map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 border-b border-rule py-3 text-[14px]">
                    <dt className="flex-none text-ink3">{k}</dt>
                    <dd className="text-right font-medium">{v && typeof v === "object" && "value" in (v as object) ? <FactValue fact={v as Fact} /> : v === undefined ? <FactValue /> : (v as React.ReactNode)}</dd>
                  </div>
                ))}
              </dl>
              <VisitLink p={p} variant="ink" className="mt-4 flex h-12 w-full rounded-[8px] text-[15px] font-bold">Visit {p.name} ↗</VisitLink>
              <p className="mt-3 text-[12.5px] text-ink3">
                Added {formatDate(p.dateAdded)} · Updated {formatDate(p.lastUpdated)}. Spotted something wrong? <Link href="/contact/" className="underline">Tell us</Link>.
              </p>
            </div>
          </aside>
        </div>

        {alternatives.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <div className="mb-[18px] flex flex-wrap items-baseline gap-3.5">
              <h2 className="display display-80 text-[26px] lg:text-[34px]">Alternatives to {p.name}</h2>
              {compare && <Link href={articlePath(compare)} className="ml-auto text-[14px] font-bold">Compare all {cat.name.replace(/^AI /, "").toLowerCase()} →</Link>}
            </div>
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">{alternatives.map((a) => <PlatformCard key={a.slug} p={a} />)}</div>
            <div className="border-t border-rule sm:hidden">{alternatives.slice(0, 3).map((a) => <PlatformCard key={a.slug} p={a} variant="row" />)}</div>
          </section>
        )}
      </Container>

      {/* Mobile sticky visit bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 sm:hidden">
        <VisitLink p={p} className="flex h-[52px] w-full rounded-[8px] text-[17px] font-bold">Visit {p.name} ↗</VisitLink>
        {disclose && <p className="mt-1.5 text-center text-[11.5px] text-ink3">Affiliate link · never affects our rating</p>}
      </div>
    </>
  );
}
