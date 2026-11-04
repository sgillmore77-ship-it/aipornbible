import type { NextConfig } from "next";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Outbound "Visit" links (/go/<slug>/) are compiled into redirects at build time,
 * so clicks are answered at Vercel's edge with no server function and no content read.
 * Uses the affiliate URL when active, plus any tracking parameters.
 */
function outboundRedirects() {
  const dir = join(process.cwd(), "content", "platforms");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => {
      const slug = f.replace(/\.json$/, "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p: any = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (p.status !== "published") return [];
      const c = p.commercial ?? {};
      let target: string = c.affiliateActive && c.affiliateUrl ? c.affiliateUrl : p.websiteUrl;
      try {
        const u = new URL(target);
        for (const t of c.trackingParams ?? []) if (t?.key) u.searchParams.set(t.key, t.value ?? "");
        target = u.toString();
      } catch {
        return [];
      }
      return [{ source: `/go/${slug}`, destination: target, permanent: false }];
    });
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      ...outboundRedirects(),
      // Unknown or removed platform: send people to the directory instead of a 404.
      { source: "/go/:path*", destination: "/directory/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // RTA label so parental-control filters recognise the site as adults-only.
          { key: "Rating", value: "RTA-5042-1996-1400-1577-RTA" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/go/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/keystatic/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/keystatic", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
