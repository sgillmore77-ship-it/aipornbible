import type { Metadata } from "next";
import { Breadcrumbs, Container } from "@/components/ui";
import { DirectoryBrowser } from "@/components/DirectoryBrowser";
import { publishedCategories, publishedPlatforms } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Porn Directory: Every AI Porn Site, Rated & Compared",
  description: "Browse every AI porn site we've listed. Filter AI porn generators, sex chat, AI girlfriends and NSFW AI tools by category, price, platform and features.",
  alternates: { canonical: "/directory/" },
};

export default function DirectoryPage() {
  const cats = publishedCategories().map((c) => ({ slug: c.slug, name: c.name }));
  const all = publishedPlatforms();
  return (
    <Container className="pb-16 lg:pb-20">
      <div className="pt-5 lg:pt-8"><Breadcrumbs items={[{ name: "Directory", href: "/directory/" }]} /></div>
      <h1 className="display mt-3 text-[44px] lg:text-[64px]">Directory</h1>
      <p className="mb-5 mt-3 max-w-[720px] text-[16px] leading-[1.5] text-ink2 lg:text-[18px]">
        {all.length} platforms across {cats.length} categories. Every listing is checked by hand before it appears here.
      </p>
            <DirectoryBrowser platforms={all} categories={cats} />
          </Container>
  );
}
