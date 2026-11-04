import Link from "next/link";
import { AdsExplainer, Container, SectionHead, Tile, TypeTag } from "@/components/ui";
import { PlatformCard, VisitLink } from "@/components/PlatformCard";
import { SearchBox } from "@/components/SearchBox";
import {
  articlePath, boxRank, byRating, categoryName, featuredRank, formatDate, platformsInCategory,
  publishedArticles, publishedCategories, publishedPlatforms,
} from "@/lib/data";
import { buildSearchIndex } from "@/lib/search-index";

export default function Home() {
  const cats = publishedCategories();
  const all = publishedPlatforms();
  // No fabricated popularity: this panel ranks by our editorial rating until real click data exists.
  const top = all.filter((p) => p.editorial?.rating !== undefined).sort(byRating).slice(0, 5);
  const featured = all.filter((p) => p.commercial.featuredOnHome).sort(featuredRank).slice(0, 4);
  const picks = all.filter((p) => p.commercial.editorsPick).sort(byRating).slice(0, 3);
  const recent = [...all].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 6);
  const articles = publishedArticles().filter((a) => a.kind !== "news").slice(0, 6);

  return (
    <>
      {/* Hero */}
      <Container>
        <section className="grid gap-8 pb-6 pt-[26px] lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:pb-11 lg:pt-12">
          <div className="flex min-w-0 flex-col gap-3.5 lg:gap-[18px]">
            <h1 className="display text-[44px] lg:text-[76px] lg:tracking-[-0.015em]">
              The AI Porn <span className="text-red">Directory</span>
            </h1>
            <p className="max-w-[640px] text-[16px] leading-[1.5] text-ink2 lg:text-[19px]">
              {all.length} hand-checked AI porn sites in {cats.length} categories: generators, sex chat, AI girlfriends, video and more.
              Rated, reviewed and one click away.
            </p>
            <div className="lg:mt-1.5">
              <SearchBox items={buildSearchIndex()} />
            </div>
          </div>

          {top.length > 0 && (
            <aside className="hidden flex-col rounded-[12px] bg-paper2 lg:flex px-5 pb-2 pt-[18px]">
              <div className="mb-1.5 flex items-baseline justify-between">
                <h2 className="text-[17px] font-extrabold">Top {top.length} by our rating</h2>
                <Link href="/directory/" className="text-[13px] font-semibold text-ink3">All →</Link>
              </div>
              <ol>
                {top.map((p, i) => (
                  <li key={p.slug} className="grid grid-cols-[22px_36px_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-rule py-2.5">
                    <span className="display display-80 text-[18px] text-red">{i + 1}</span>
                    <Tile name={p.name} initials={p.initials} hue={p.hue} logo={p.logo} size={36} />
                    <Link href={`/platform/${p.slug}/`} className="flex min-w-0 flex-col gap-px">
                      <span className="truncate text-[15px] font-bold">{p.name}</span>
                      <span className="truncate text-[12.5px] text-ink3">{categoryName(p.primaryCategory)} · {p.editorial!.rating!.toFixed(1)}</span>
                    </Link>
                    <VisitLink p={p} variant="plain" className="h-8 rounded-[6px] border border-rule bg-card px-[11px] text-[13px] font-semibold hover:border-ink">
                      Visit ↗
                    </VisitLink>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </section>
      </Container>

      {/* Browse by category */}
      <Container>
        <section className="pb-7 pt-2 lg:pb-16">
          <SectionHead title="Browse by category" caption={<span className="hidden lg:inline">Top-rated sites in each, ranked by our score</span>} href="/categories/" linkLabel="All categories" />
          <div className="grid gap-2.5 lg:grid-cols-3 lg:gap-4">
            {cats.map((c) => {
              const list = platformsInCategory(c.slug).sort(boxRank);
              return (
                <div key={c.slug} className="flex flex-col rounded-[12px] border border-rule bg-card px-3.5 pb-2 pt-3.5 lg:px-[18px] lg:pb-3.5 lg:pt-[18px]">
                  <Link href={`/category/${c.slug}/`} className="flex flex-col gap-[5px] pb-1.5 hover:!text-ink lg:pb-3">
                    <span className="flex min-h-11 items-center gap-2.5 lg:min-h-0">
                      <span className="flex-1 text-[18px] font-extrabold leading-[1.15] lg:text-[20px]">{c.name}</span>
                      <span className="inline-flex h-6 flex-none items-center rounded-full bg-paper2 px-[9px] text-[12.5px] font-bold text-ink2">
                        {list.length}<span className="hidden lg:inline">&nbsp;{list.length === 1 ? "site" : "sites"}</span>
                      </span>
                      <span className="font-bold text-red lg:hidden">→</span>
                    </span>
                    <span className="hidden text-[14px] leading-[1.4] text-ink3 lg:block">{c.short}</span>
                  </Link>
                  {list.slice(0, 4).map((p, i) => (
                    <div key={p.slug} className={i === 3 ? "hidden lg:block" : ""}>
                      <PlatformCard p={p} variant="mini" />
                    </div>
                  ))}
                  <Link href={`/category/${c.slug}/`} className="mt-auto hidden min-h-[42px] items-center justify-between border-t border-rule pt-1.5 text-[14px] font-bold text-red lg:flex">
                    <span>See all {list.length}</span><span>→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </Container>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="pb-7 lg:pb-16">
          <Container>
            <SectionHead
              title="Featured"
              caption={<><span className="lg:hidden"><AdsExplainer short /></span><span className="hidden lg:inline"><AdsExplainer /></span></>}
              href="/sponsored-placements/"
              linkLabel="How we label ads"
              muted
            />
          </Container>
          <div className="no-scrollbar mx-auto flex max-w-[1440px] gap-2.5 overflow-x-auto px-4 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-10">
            {featured.map((p) => (
              <div key={p.slug} className="w-[290px] flex-none lg:w-auto">
                <PlatformCard p={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Editor's picks */}
      {picks.length > 0 && (
        <section className="bg-paper2 pb-7 pt-[26px] lg:pb-12 lg:pt-10">
          <Container>
            <SectionHead
              title="Editor's picks"
              star
              caption={<><span className="lg:hidden">Chosen by our reviewers. Never paid for.</span><span className="hidden lg:inline">Chosen by our reviewers after hands-on testing. Never paid for.</span></>}
            />
            <div className="grid gap-2.5 lg:grid-cols-3 lg:gap-4">
              {picks.map((p) => <PlatformCard key={p.slug} p={p} maxTags={3} />)}
            </div>
          </Container>
        </section>
      )}

      {/* Recently added + Reviews & guides */}
      <Container>
        <section className="grid gap-6 pb-9 pt-[26px] lg:grid-cols-2 lg:gap-14 lg:pb-[72px] lg:pt-14">
          <div>
            <SectionHead title="Recently added" small href="/directory/?sort=added" />
            <div className="-mt-3.5">
              {recent.map((p, i) => <div key={p.slug} className={i >= 4 ? "hidden lg:block" : ""}><PlatformCard p={p} variant="row" /></div>)}
            </div>
          </div>
          <div>
            <SectionHead title="Reviews & guides" small href="/guides/" linkLabel="All articles" />
            <div className="-mt-3.5">
              {articles.map((a, i) => (
                <Link
                  key={a.kind + a.slug}
                  href={articlePath(a)}
                  className={`flex flex-col gap-1.5 border-b border-rule py-3 lg:min-h-[65px] lg:flex-row lg:items-center lg:gap-3.5 lg:py-2.5 ${i >= 3 ? "hidden lg:flex" : "flex"}`}
                >
                  <TypeTag kind={a.kind} wide />
                  <span className="flex-1 text-[16px] font-bold leading-[1.3]">{a.title}</span>
                  <span className="hidden flex-none text-[13px] text-ink3 lg:inline">{formatDate(a.publishedOn)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
