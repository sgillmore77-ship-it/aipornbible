import { ArticleIndex, indexMetadata } from "@/components/articles";

export const metadata = indexMetadata("news");
export default function Page() {
  return <ArticleIndex kind="news" />;
}
