import { ArticlePage, articleMetadata, articleParams } from "@/components/articles";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articleParams("news");
export async function generateMetadata({ params }: Props) {
  return articleMetadata("news", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ArticlePage kind="news" slug={(await params).slug} />;
}
