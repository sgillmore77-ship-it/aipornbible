import { ArticlePage, articleMetadata, articleParams } from "@/components/articles";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articleParams("guide");
export async function generateMetadata({ params }: Props) {
  return articleMetadata("guide", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ArticlePage kind="guide" slug={(await params).slug} />;
}
