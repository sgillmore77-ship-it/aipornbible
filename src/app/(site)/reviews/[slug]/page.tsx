import { ArticlePage, articleMetadata, articleParams } from "@/components/articles";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articleParams("review");
export async function generateMetadata({ params }: Props) {
  return articleMetadata("review", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <ArticlePage kind="review" slug={(await params).slug} />;
}
