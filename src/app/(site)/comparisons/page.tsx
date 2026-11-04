import { ArticleIndex, indexMetadata } from "@/components/articles";

export const metadata = indexMetadata("comparison");
export default function Page() {
  return <ArticleIndex kind="comparison" />;
}
