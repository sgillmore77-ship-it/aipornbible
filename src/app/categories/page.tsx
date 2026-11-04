import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container } from "@/components/ui";
import { PlatformCard } from "@/components/PlatformCard";
import { boxRank, platformsInCategory, publishedCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Porn Categories",
  description: "Every category of AI porn site: generators, AI porn video, sex chat, AI girlfriends, NSFW characters, voice, creator tools, communities and AI models.",
  alternates: { canonical: "/categories/" },
};

export default function CategoriesPage() {
  return (
    <Container className="pb-16 lg:pb-20">
      <div className="pt-5 lg:pt-8"><Breadcrumbs items={[{ name: "Categories", href: "/categories/" }]} /></div>
      <h1 className="display mt-3 text-[44px] lg:text-[64px]">Categories</h1>
      <p className="mb-8 mt-3 max-w-[720px] text-[16px] leading-[1.5] text-ink2 lg:text-[18px]">
        Pick what you&apos;re after. Each category explains what to look for and lists every platform we&apos;ve checked.
      </p>
      <div className="grid gap-2.5 lg:grid-cols-3 lg:gap-4">
        {publishedCategories().map((c) => {
          const list = platformsInCategory(c.slug).sort(boxRank);
          return (
            <div key={c.slug} className="flex flex-col rounded-[12px] border border-rule bg-card px-[18px] pb-3.5 pt-[18px]">
              <Link href={`/category/${c.slug}/`} className="flex flex-col gap-[5px] pb-3 hover:!text-ink">
                <span className="flex items-center gap-2.5">
                  <span className="flex-1 text-[20px] font-extrabold leading-[1.15]">{c.name}</span>
                  <span className="inline-flex h-6 items-center rounded-full bg-paper2 px-[9px] text-[12.5px] font-bold text-ink2">{list.length} {list.length === 1 ? "site" : "sites"}</span>
                </span>
                <span className="text-[14px] leading-[1.4] text-ink3">{c.short}</span>
              </Link>
              {list.slice(0, 4).map((p) => <PlatformCard key={p.slug} p={p} variant="mini" />)}
              <Link href={`/category/${c.slug}/`} className="mt-auto flex min-h-[42px] items-center justify-between border-t border-rule pt-1.5 text-[14px] font-bold text-red">
                <span>See all {list.length}</span><span>→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
