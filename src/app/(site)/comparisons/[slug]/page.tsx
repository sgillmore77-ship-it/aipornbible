import { ArticlePage, articleMetadata, articleParams } from "@/components/articles";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articleParams("comparison");
export async function generateMetadata({ params }: Props) {
  return articleMetadata("comparison", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ArticlePage kind="comparison" slug={(await params).slug} />;
}
