import { ArticleIndex, indexMetadata } from "@/components/articles";

export const metadata = indexMetadata("review");
export default function Page() {
  return <ArticleIndex kind="review" />;
}
