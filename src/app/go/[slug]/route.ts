import { NextResponse } from "next/server";
import { getPlatform, resolveOutboundUrl } from "@/lib/data";

/**
 * Outbound click redirect: /go/<slug>/ → affiliate URL (if active) or website.
 * Keeps affiliate URLs out of page HTML, gives one place to count clicks,
 * and is noindexed via the X-Robots-Tag header in next.config.ts.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = getPlatform((await params).slug);
  if (!p) return NextResponse.redirect(new URL("/directory/", _req.url), 302);
  const res = NextResponse.redirect(resolveOutboundUrl(p), 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
