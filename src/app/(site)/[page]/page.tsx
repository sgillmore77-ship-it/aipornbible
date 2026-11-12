import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container } from "@/components/ui";
import { getPage, pages } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export const dynamicParams = false;
export const generateStaticParams = () => pages.map((p) => ({ page: p.slug }));

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPage((await params).page);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/${p.slug}/` } };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function StaticPage({ params }: Props) {
  const p = getPage((await params).page);
  if (!p) notFound();
  return (
    <Container className="pb-16 lg:pb-24">
      <div className="mx-auto max-w-[760px]">
        <div className="pt-5 lg:pt-8"><Breadcrumbs items={[{ name: p.title, href: `/${p.slug}/` }]} /></div>
        <h1 className="display mt-3 text-[44px] lg:text-[64px]">{p.title}</h1>
        <div className="article-body mt-2">
          {p.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 id={slugify(s.heading)}>{s.heading}</h2>}
              {s.body && <div className="mt-[1.1rem]"><Markdown text={s.body} /></div>}
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
