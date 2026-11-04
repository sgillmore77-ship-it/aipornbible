import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs, Container, TypeTag } from "@/components/ui";
import { PlatformCard } from "@/components/PlatformCard";
import { DirectoryBrowser } from "@/components/DirectoryBrowser";
import { ReadMore } from "@/components/ReadMore";
import { getCategory, categories as allCats } from "@/content/categories";
import {
  articlePath, articlesForCategory, byRating, comparisonForCategory, formatDate, hasFeature,
  isIndexableCategory, platformsInCategory, publishedCategories, publishedPlatforms, readMinutes,
} from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => publishedCategories().map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  const n = platformsInCategory(c.slug).length;
  return {
    title: `Best ${c.name} (${new Date().getFullYear()})`,
    description: `${c.short} Compare ${n} ${c.name.toLowerCase()} by price, features and our ratings.`,
    alternates: { canonical: `/category/${c.slug}/` },
    robots: isIndexableCategory(c.slug) ? undefined : { index: false, follow: true },
  };
}

/** Turns mentions of other category names in intro copy into links. */
function linkify(text: string, self: string): React.ReactNode[] {
  const others = allCats.filter((c) => c.slug !== self).sort((a, b) => b.name.length - a.name.length);
  const re = new RegExp(`(${others.map((c) => c.name.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&")).join("|")})`, "g");
  return text.split(re).map((part, i) => {
    const c = others.find((o) => o.name === part);
    return c ? <Link key={i} href={`/category/${c.slug}/`} className="font-semibold text-red underline underline-offset-2">{part}</Link> : part;
  });
}

export default async function CategoryPage({ params }: Props) {
  const c = getCategory((await params).slug);
  if (!c || c.status !== "published") notFound();
  const list = platformsInCategory(c.slug);
  const free = list.filter((p) => hasFeature(p, "free-tier") || p.pricingModel === "free" || p.pricingModel === "freemium").length;
  const updated = list.map((p) => p.lastUpdated).sort().at(-1);
  const top = [...list].filter((p) => p.editorial?.rating !== undefined).sort(byRating)[0];
  const bestOf = comparisonForCategory(c.slug);
  const guides = articlesForCategory(c.slug).filter((a) => a.slug !== bestOf?.slug).slice(0, 3);
  const related = c.related.map(getCategory).filter((x): x is NonNullable<typeof x> => !!x);
  const cats = publishedCategories().map((x) => ({ slug: x.slug, name: x.name }));

  return (
    <Container className="pb-16 lg:pb-20">
      <section className="grid gap-8 pb-6 pt-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:pb-10 lg:pt-8">
        <div className="min-w-0">
          <Breadcrumbs items={[{ name: "Directory", href: "/directory/" }, { name: c.name, href: `/category/${c.slug}/` }]} />
          <h1 className="display mt-3 text-[44px] lg:text-[72px]">{c.name}</h1>
          <p className="mt-3 text-[14px] font-semibold text-ink3">
            {list.length} platforms · {free} with a free tier{updated && <> · Updated {formatDate(updated)}</>}
          </p>
          <ReadMore
            className="mt-4 max-w-[700px] space-y-4 text-[16px] leading-[1.65] text-ink2 lg:text-[18px]"
            paragraphs={c.intro.map((t, i) => <p key={i}>{linkify(t, c.slug)}</p>)}
          />
        </div>

        {(top || bestOf) && (
          <aside className="hidden flex-col gap-3 lg:flex">
            {top && (
              <>
                <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-ink3">Top rated in this category</p>
                <PlatformCard p={top} inCategory={c.slug} maxTags={3} />
              </>
            )}
            {bestOf && (
              <Link href={articlePath(bestOf)} className="flex items-center justify-between rounded-[10px] border border-rule px-4 py-3.5 text-[15px] font-bold hover:border-ink3">
                <span>Read: {bestOf.title.replace(/:.*$/, "")}</span><span className="text-red">→</span>
              </Link>
            )}
          </aside>
        )}
      </section>

      <Suspense>
        <DirectoryBrowser platforms={publishedPlatforms()} categories={cats} lockedCategory={c.slug} mode="chips" />
      </Suspense>

      <section className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-14">
        {related.length > 0 && (
          <div>
            <h2 className="display display-80 mb-2 text-[24px] lg:text-[28px]">Related categories</h2>
            {related.map((r) => (
              <Link key={r.slug} href={`/category/${r.slug}/`} className="flex items-center gap-4 border-b border-rule py-3.5">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[17px] font-bold">{r.name}</span>
                  <span className="text-[14px] text-ink3">{r.short}</span>
                </span>
                <span className="flex-none text-[14px] font-bold">{platformsInCategory(r.slug).length} sites →</span>
              </Link>
            ))}
          </div>
        )}
        {(guides.length > 0 || bestOf) && (
          <div>
            <h2 className="display display-80 mb-2 text-[24px] lg:text-[28px]">Related guides</h2>
            {[...(bestOf ? [bestOf] : []), ...guides].slice(0, 3).map((a) => (
              <Link key={a.kind + a.slug} href={articlePath(a)} className="flex flex-col gap-1.5 border-b border-rule py-3.5">
                <TypeTag kind={a.kind} />
                <span className="text-[17px] font-bold leading-[1.3]">{a.title}</span>
                <span className="text-[13px] text-ink3">{formatDate(a.updatedOn)} · {readMinutes(a)} min read</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
