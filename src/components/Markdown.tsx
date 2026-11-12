import { renderMarkdown } from "@/lib/markdown";

/** Renders dashboard-written text with formatting. Server component: no client JS. */
export function Markdown({ text, className = "" }: { text: string; className?: string }) {
  const html = renderMarkdown(text);
  if (!html) return null;
  return <div className={`md ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
