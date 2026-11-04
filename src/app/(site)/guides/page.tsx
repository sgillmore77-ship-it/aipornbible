import { ArticleIndex, indexMetadata } from "@/components/articles";

export const metadata = indexMetadata("guide");
export default function Page() {
  return <ArticleIndex kind="guide" />;
}
