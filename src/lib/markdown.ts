/**
 * Formatting for long text written in the dashboard (About, assessment, article
 * and page bodies, category intros). Runs at build time only and outputs plain
 * HTML, so it adds no JavaScript to public pages.
 *
 * Supported: # / ## / ### headings, - or * bullet lists, 1. numbered lists,
 * **bold**, *italic*, [links](https://…), > quotes and --- dividers.
 * Raw HTML is shown as text, never executed.
 */
import { Marked, type Tokens } from "marked";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const md = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    // Pages already have an H1 and section H2s, so text headings start at H3.
    heading({ tokens, depth }: Tokens.Heading) {
      const level = depth <= 2 ? 3 : 4;
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escape(text);
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const safe = /^(https?:|mailto:|\/|#)/i.test(href) ? href : `https://${href.replace(/^\/+/, "")}`;
      const external = /^https?:/i.test(safe) && !/^https?:\/\/(www\.)?aipornbible\.com/i.test(safe);
      const t = title ? ` title="${escape(title)}"` : "";
      return external
        ? `<a href="${escape(safe)}"${t} target="_blank" rel="nofollow noopener">${text}</a>`
        : `<a href="${escape(safe)}"${t}>${text}</a>`;
    },
    image({ text }: Tokens.Image) {
      // Images aren't supported in text fields; show the alt text instead.
      return escape(text);
    },
  },
});

/** Whole text → HTML. */
export function renderMarkdown(text: string): string {
  return text.trim() ? (md.parse(text) as string) : "";
}

/** Text → one HTML string per top-level block (paragraph, list, heading…). */
export function markdownBlocks(text: string): string[] {
  const tokens = md.lexer(text);
  const blocks: string[] = [];
  for (const t of tokens) {
    if (t.type === "space") continue;
    const html = md.parser([t] as unknown as Parameters<typeof md.parser>[0]) as string;
    if (html.trim()) blocks.push(html);
  }
  return blocks;
}

/** Plain text (for word counts and meta descriptions). */
export const markdownToText = (text: string) =>
  text.replace(/[#>*_`~-]+/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
