import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformCard, VisitLink } from "./PlatformCard";
import { Toc } from "./Toc";
import { Breadcrumbs, Container, JsonLd, PricingTag, SampleNotice, SponsoredLabel, Tag, Tile, TypeTag } from "./ui";
import { getCategory } from "@/lib/content";
import { SITE, articlePath, categoryName, formatDate, getArticle, getPlatform, outboundHref, outboundRel, publishedArticles, readMinutes } from "@/lib/data";
import { PRICING_LABELS } from "@/lib/labels";
import type { ArticleKind, Platform } from "@/lib/types";

export const SECTION: Record<ArticleKind, { path: string; name: string; title: string; intro: string; metaTitle: string; metaDesc: string }> = {
  review: {
    path: "/reviews/", name: "Reviews", title: "Reviews",
    intro: "In-depth reviews of AI porn generators, sex chat apps and AI girlfriends. Every review says whether we tested the platform ourselves or researched it.",
    metaTitle: "AI Porn Site Reviews", metaDesc: "Honest, in-depth reviews of AI porn generators, AI sex chat and AI girlfriend apps: features, pricing, pros and cons.",
  },
  comparison: {
    path: "/comparisons/", name: "Comparisons", title: "Comparisons",
    intro: "Head-to-head comparisons of the best AI porn sites in each category, with tables and our verdict on which suits whom.",
    metaTitle: "Best AI Porn Sites Compared", metaDesc: "Side-by-side comparisons of the best AI porn generators, AI sex chat and AI girlfriend apps.",
  },
  guide: {
    path: "/guides/", name: "Guides", title: "Guides",
    intro: "How AI porn tools work, how to get better results, and how to stay private while using them.",
    metaTitle: "AI Porn Guides", metaDesc: "Guides to AI porn generators, AI sex chat and NSFW AI: how they work, getting better results, and privacy.",
  },
  news: {
    path: "/news/", name: "News", title: "News",
    intro: "What's new in AI porn: launches, shutdowns, price changes and industry developments.",
    metaTitle: "AI Porn News", metaDesc: "The latest AI porn industry news: new platforms, launches, shutdowns and price changes.",
  },
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function indexMetadata(kind: ArticleKind): Metadata {
  const s = SECTION[kind];
  const hasReal = publishedArticles(kind).some((a) => !a.isSample);
  return { title: s.metaTitle, description: s.metaDesc, alternates: { canonical: s.path }, robots: hasReal ? undefined : { index: false, follow: true } };
}

export function ArticleIndex({ kind }: { kind: ArticleKind }) {
  const s = SECTION[kind];
  const list = publishedArticles(kind);
  return (
    <Container className="pb-16 lg:pb-20">
      <div className="pt-5 lg:pt-8"><Breadcrumbs items={[{ name: s.name, href: s.path }]} /></div>
      <h1 className="display mt-3 text-[44px] lg:text-[64px]">{s.title}</h1>
      <p className="mb-8 mt-3 max-w-[720px] text-[16px] leading-[1.5] text-ink2 lg:text-[18px]">{s.intro}</p>
      {list.length ? (
        <div className="border-t border-ink">
          {list.map((a) => (
            <Link key={a.slug} href={articlePath(a)} className="grid gap-2 border-b border-rule py-5 lg:grid-cols-[120px_minmax(0,1fr)_140px] lg:items-baseline lg:gap-6">
              <TypeTag kind={a.kind} />
              <span>
                <span className="block text-[20px] font-bold leading-[1.25] lg:text-[22px]">{a.title}</span>
                <span className="mt-1.5 block text-[15px] leading-[1.5] text-ink2">{a.description}</span>
              </span>
              <span className="text-[13px] text-ink3 lg:text-right">{formatDate(a.updatedOn)} · {readMinutes(a)} min</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border-t border-ink pt-8 text-[16px] text-ink2">Nothing published here yet. Check back soon.</p>
      )}
    </Container>
  );
}

export const articleParams = (kind: ArticleKind) => publishedArticles(kind).map((a) => ({ slug: a.slug }));

export function articleMetadata(kind: ArticleKind, slug: string): Metadata {
  const a = getArticle(kind, slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: articlePath(a) },
    openGraph: { type: "article", title: a.title, description: a.description, publishedTime: a.publishedOn, modifiedTime: a.updatedOn },
    robots: a.isSample ? { index: false, follow: true } : undefined,
  };
}

const freeAccess = (p: Platform) => p.glance.freeAccess?.value ?? (p.pricingModel === "free" ? "Fully free" : p.pricingModel === "freemium" ? "Free tier" : "No");

function ComparisonTable({ platforms }: { platforms: Platform[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left text-[14.5px]">
          <thead>
            <tr className="bg-ink text-paper">
              {["Platform", "Best for", "Pricing", "Free access", "Features", "Devices", "Rating", ""].map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-[0.06em] first:rounded-tl-[8px] last:rounded-tr-[8px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {platforms.map((p, i) => (
              <tr key={p.slug} className={`border-b border-rule align-middle ${p.commercial.sponsored ? "bg-goldsoft" : ""}`}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="display display-80 w-5 text-[20px] text-red">{i + 1}</span>
                    <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={36} />
                    <span className="flex flex-col items-start gap-1">
                      <Link href={`/platform/${p.slug}/`} className="text-[15.5px] font-bold">{p.name}</Link>
                      {p.commercial.sponsored && <SponsoredLabel size="sm" />}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-ink2">{p.bestFor ?? "—"}</td>
                <td className="px-4 py-4"><span className="font-semibold">{PRICING_LABELS[p.pricingModel]}</span><span className="block text-[13px] text-ink3">{p.glance.price?.value ?? "—"}</span></td>
                <td className="px-4 py-4 text-ink2">{freeAccess(p)}</td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-1">{p.tags.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}</div></td>
                <td className="px-4 py-4 text-ink2">{p.glance.devices?.value ?? "—"}</td>
                <td className="px-4 py-4">
                  {p.editorial?.rating !== undefined
                    ? <span className="whitespace-nowrap"><span className="text-[18px] font-extrabold">{p.editorial.rating.toFixed(1)}</span><span className="text-[12px] text-ink3">/10</span></span>
                    : <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink3">New</span>}
                </td>
                <td className="px-4 py-4"><VisitLink p={p} className="h-9 whitespace-nowrap rounded-[6px] px-3.5 text-[13.5px] font-bold">Visit ↗</VisitLink></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <div className="flex flex-col gap-3 lg:hidden">
        {platforms.map((p, i) => (
          <div key={p.slug} className={`rounded-[10px] border p-4 ${p.commercial.sponsored ? "border-goldline bg-goldsoft" : "border-rule"}`}>
            <div className="flex items-center gap-3">
              <span className="display display-80 text-[22px] text-red">{i + 1}</span>
              <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={40} radius={8} />
              <span className="min-w-0 flex-1">
                <Link href={`/platform/${p.slug}/`} className="block text-[16px] font-bold">{p.name}</Link>
                <span className="block truncate text-[13px] text-ink3">{p.bestFor ?? categoryName(p.primaryCategory)}</span>
              </span>
              <span className="text-[17px] font-extrabold">{p.editorial?.rating?.toFixed(1) ?? <span className="text-[12px] uppercase text-ink3">New</span>}</span>
            </div>
            {p.commercial.sponsored && <div className="mt-2"><SponsoredLabel size="sm" /></div>}
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px]">
              <div><dt className="text-ink3">Pricing</dt><dd className="font-semibold">{p.glance.price?.value ?? PRICING_LABELS[p.pricingModel]}</dd></div>
              <div><dt className="text-ink3">Free access</dt><dd className="font-semibold">{freeAccess(p)}</dd></div>
              <div className="col-span-2"><dt className="text-ink3">Devices</dt><dd className="font-semibold">{p.glance.devices?.value ?? "—"}</dd></div>
            </dl>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <VisitLink p={p} className="h-11 rounded-[6px] text-[14.5px] font-bold">Visit ↗</VisitLink>
              <Link href={`/platform/${p.slug}/`} className="inline-flex h-11 items-center justify-center rounded-[6px] border border-rule text-[14.5px] font-semibold">Review</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InlinePlatform({ p }: { p: Platform }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[10px] border border-rule bg-card p-4">
      <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={48} />
      <div className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold">{p.name}</span>
        <span className="block text-[13.5px] text-ink3">
          {p.editorial?.rating !== undefined ? `${p.editorial.rating.toFixed(1)}/10 · ` : ""}
          {PRICING_LABELS[p.pricingModel]}{p.glance.freeAccess ? ` · ${p.glance.freeAccess.value}` : ""}
        </span>
      </div>
      <Link href={`/platform/${p.slug}/`} className="ml-auto text-[14px] font-bold">Full review</Link>
      <a href={outboundHref(p)} target="_blank" rel={outboundRel(p)} className="btn-red inline-flex h-10 items-center rounded-[6px] px-4 text-[14px] font-bold">Visit ↗</a>
    </div>
  );
}

export function ArticlePage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const a = getArticle(kind, slug);
  if (!a) notFound();
  const s = SECTION[kind];
  const cat = a.category ? getCategory(a.category) : undefined;
  const plats = (a.platforms ?? []).map(getPlatform).filter((p): p is Platform => !!p);
  const winners = (a.winners ?? []).map((w) => ({ label: w.label, p: getPlatform(w.platform) })).filter((w): w is { label: string; p: Platform } => !!w.p);
  const reviewed = kind === "review" ? plats[0] : undefined;
  const toc = a.sections.map((sec) => ({ id: slugify(sec.heading), label: sec.heading }));
  const more = publishedArticles(kind).filter((x) => x.slug !== a.slug).slice(0, 3);
  const initials = a.author.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const kindLabel = { review: "Review", comparison: "Comparison", guide: "Guide", news: "News" }[kind];

  return (
    <Container className="pb-16 lg:pb-20">
      <div className="pt-5 lg:pt-8"><Breadcrumbs items={[{ name: s.name, href: s.path }, { name: a.title, href: articlePath(a) }]} /></div>
      {a.isSample && <div className="mt-4"><SampleNotice what={kind} /></div>}

      {/* Header */}
      <header className="mx-auto max-w-[900px] pb-8 pt-8 text-left lg:pb-10 lg:pt-12 lg:text-center">
        <div className="flex flex-wrap items-center gap-2 lg:justify-center">
          <TypeTag kind={kind}>{kindLabel}{cat ? ` · ${cat.name}` : ""}</TypeTag>
          {a.sponsored && <SponsoredLabel />}
          {kind === "review" && a.basis && <Tag>{a.basis === "hands-on" ? "Hands-on tested" : "Research-based"}</Tag>}
        </div>
        <h1 className="mt-4 text-[34px] font-black leading-[1.05] tracking-[-0.01em] lg:text-[60px]" style={{ fontStretch: "85%" }}>{a.title}</h1>
        <p className="mx-auto mt-4 max-w-[720px] text-[17px] leading-[1.5] text-ink2 lg:text-[20px]">{a.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-ink3 lg:justify-center">
          <span className="grid size-9 place-items-center rounded-full bg-ink text-[13px] font-bold text-paper">{initials}</span>
          <span><span className="font-semibold text-ink">{a.author}</span>{a.authorRole ? `, ${a.authorRole}` : ""}</span>
          <span aria-hidden>·</span>
          <span>Updated <time dateTime={a.updatedOn}>{formatDate(a.updatedOn)}</time></span>
          <span aria-hidden>·</span>
          <span>{readMinutes(a)} min read</span>
          <span aria-hidden>·</span>
          <Link href="/how-we-review/" className="font-semibold text-ink underline underline-offset-2">How we test</Link>
        </div>
      </header>

      {/* Summary strip */}
      {winners.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          {winners.map((w) => (
            <div key={w.label} className="flex items-center gap-3 rounded-[10px] border border-rule p-4">
              <Tile name={w.p.name} initials={w.p.initials} hue={w.p.hue} logo={w.p.logo} size={48} />
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-red">{w.label}</p>
                <Link href={`/platform/${w.p.slug}/`} className="block text-[17px] font-bold">{w.p.name}</Link>
                <p className="truncate text-[13px] text-ink3">{w.p.editorial?.rating?.toFixed(1) ?? "New"}/10 · {w.p.glance.price?.value ?? PRICING_LABELS[w.p.pricingModel]}</p>
              </div>
              <VisitLink p={w.p} variant="ink" className="h-9 rounded-[6px] px-3 text-[13.5px] font-semibold">Visit ↗</VisitLink>
            </div>
          ))}
        </div>
      )}

      {/* Reviewed platform strip */}
      {reviewed && (
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center gap-4 rounded-[10px] border-[1.5px] border-ink p-4 lg:p-5">
          <Tile name={reviewed.name} initials={reviewed.initials} hue={reviewed.hue} logo={reviewed.logo} size={56} radius={12} />
          <div className="min-w-0 flex-1">
            <Link href={`/platform/${reviewed.slug}/`} className="text-[18px] font-bold">{reviewed.name}</Link>
            <div className="mt-1 flex flex-wrap gap-1.5"><PricingTag>{PRICING_LABELS[reviewed.pricingModel]}</PricingTag>{reviewed.tags.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          {reviewed.editorial?.rating !== undefined && (
            <span className="flex items-baseline gap-0.5"><span className="text-[32px] font-black" style={{ fontStretch: "85%" }}>{reviewed.editorial.rating.toFixed(1)}</span><span className="text-[14px] text-ink3">/10</span></span>
          )}
          <VisitLink p={reviewed} className="h-11 rounded-[6px] px-5 text-[15px] font-bold">Visit {reviewed.name} ↗</VisitLink>
        </div>
      )}

      {(winners.length > 0 || plats.length > 0) && (
        <p className="mx-auto mt-4 max-w-[900px] text-[13.5px] text-ink3 lg:text-center">
          Some links are affiliate links. Rankings are never sold. <SponsoredLabel size="sm" /> listings are paid placements and are ranked on the same criteria as everyone else.
        </p>
      )}

      {kind === "comparison" && plats.length > 0 && (
        <section className="mt-8 lg:mt-10">
          <h2 className="display display-80 mb-3 text-[24px] lg:hidden">The shortlist</h2>
          <ComparisonTable platforms={plats} />
        </section>
      )}

      {/* Body */}
      <div className={`mt-10 grid gap-10 lg:mt-14 ${toc.length > 2 ? "lg:grid-cols-[260px_minmax(0,700px)] lg:justify-center lg:gap-16" : "lg:grid-cols-[minmax(0,700px)] lg:justify-center"}`}>
        {toc.length > 2 && <aside className="hidden lg:block"><Toc items={toc} /></aside>}
        <article className="article-body min-w-0">
          {a.sections.map((sec) => {
            const p = sec.platform ? getPlatform(sec.platform) : undefined;
            return (
              <section key={sec.heading}>
                <h2 id={slugify(sec.heading)}>{sec.heading}</h2>
                {p && <InlinePlatform p={p} />}
                {sec.body.map((b, i) => <p key={i}>{b}</p>)}
                {sec.list && (
                  <ol className="mt-5 space-y-4">
                    {sec.list.map((li, i) => (
                      <li key={li.title} className="grid grid-cols-[40px_1fr] gap-3">
                        <span className="display display-80 text-[32px] text-red">{i + 1}</span>
                        <span className="pt-1 text-[18px] leading-[1.55]"><strong className="font-bold text-ink">{li.title}</strong> <span className="text-ink2">{li.body}</span></span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </article>
      </div>

      {reviewed && (
        <div className="mx-auto mt-12 flex max-w-[700px] flex-col items-start gap-3 rounded-[10px] bg-paper2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[18px] font-extrabold">Ready to try {reviewed.name}?</p>
          <VisitLink p={reviewed} className="h-11 rounded-[6px] px-5 text-[15px] font-bold">Visit {reviewed.name} ↗</VisitLink>
        </div>
      )}

      {plats.length > 0 && kind === "comparison" && (
        <section className="mt-16">
          <h2 className="display display-80 mb-[18px] text-[26px] lg:text-[34px]">Every platform in this test</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{plats.map((p) => <PlatformCard key={p.slug} p={p} />)}</div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mt-16">
          <h2 className="display display-80 mb-2 text-[24px] lg:text-[28px]">More {s.name.toLowerCase()}</h2>
          {more.map((m) => (
            <Link key={m.slug} href={articlePath(m)} className="flex flex-col gap-1.5 border-b border-rule py-3.5 lg:flex-row lg:items-center lg:gap-3.5">
              <TypeTag kind={m.kind} wide />
              <span className="flex-1 text-[16px] font-bold leading-[1.3]">{m.title}</span>
              <span className="text-[13px] text-ink3">{formatDate(m.publishedOn)}</span>
            </Link>
          ))}
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": kind === "news" ? "NewsArticle" : "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.publishedOn,
          dateModified: a.updatedOn,
          author: { "@type": a.author.includes("Editorial") ? "Organization" : "Person", name: a.author },
          publisher: { "@id": `${SITE.url}/#org` },
          mainEntityOfPage: SITE.url + articlePath(a),
        }}
      />
    </Container>
  );
}
