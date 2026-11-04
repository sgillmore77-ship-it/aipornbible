# AI Porn Bible

The AI porn directory. Next.js 15 (App Router) + TypeScript + Tailwind CSS 4. Every page is statically generated; the only server code is the `/go/[slug]/` outbound redirect.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # validates content, then builds
```

Node 20+ required.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. The defaults are right (framework: Next.js, build: `npm run build`).
3. Add the environment variable `NEXT_PUBLIC_SITE_URL=https://aipornbible.com`.
4. Add the domain under **Settings → Domains**.
5. Turn on **Analytics** in the project dashboard (cookieless page views, already wired in).

Or from the terminal: `npx vercel` then `npx vercel --prod`.

**Moving off Vercel later:** it's a standard Next.js app, so it runs on Netlify, Cloudflare (via OpenNext), Railway or any Node host with `npm run build && npm start`. Swap `@vercel/analytics` for Plausible, Umami or similar.

## Adding and editing content

All content is typed data in `src/content/`:

| File | What |
| --- | --- |
| `platforms.ts` | Directory listings |
| `categories.ts` | Categories and their intro copy |
| `articles.ts` | Reviews, comparisons, guides, news |
| `pages.ts` | About, contact, advertising and policy pages |

To add a platform, copy an entry in `platforms.ts`, set `status: "published"`, remove `isSample`, and run `npm run validate`.

### Rules the build enforces

`npm run build` runs `scripts/validate-content.ts` first and **fails** if a published listing:

- is missing required fields (URL, descriptions, category, type, pricing model, dates)
- references an unknown category or platform
- has no `policyCheck`, or fails it (real-person nudify/deepfake tools, or no ban on minors)
- has an active affiliate link with no URL, or a rating outside 0–10
- is a real listing still pointing at example.com

### Statuses

- `draft`: not on the site
- `published`: live
- `archived`: not on the site; kept for records

### Verified data

Every factual field is a `Fact`, or left out when unknown:

```ts
glance: {
  price: { value: "From $9.99/mo", checkedOn: "2026-11-03" },   // verified
  payment: { value: "Card, crypto", unverified: true },         // shows an "Unverified" tag
  // billingName omitted                                        // shows "Not yet verified"
}
```

## Design system

Built from the Claude Design handoff (v4). Tokens are CSS variables in `src/app/globals.css` (`--paper`, `--ink`, `--red`, `--gold`…), exposed to Tailwind as `bg-paper`, `text-ink3`, `bg-gold` and so on. Red is editorial and brand; gold is only for paid placements. Font is Archivo (variable width + weight), bundled locally, with `.display` for the condensed uppercase headings. A dark theme is wired up: set `data-theme="dark"` on `<html>` in `src/app/layout.tsx`.

Key components: `PlatformCard` (`grid` / `row` / `mini`), `SearchBox`, `DirectoryBrowser` (filters synced to the URL, live counts, mobile bottom sheet), `Header`, `Footer`.

## Commercial features

- **Affiliate links:** set `commercial.affiliateUrl` and `affiliateActive: true`. Optional `trackingParams` are appended. All "Visit" buttons go through `/go/<slug>/` (302 redirect, noindex, disallowed in robots.txt) and carry `rel="sponsored nofollow"`.
- **Sponsored placement:** `sponsored: true` adds a "Sponsored" label everywhere. `featuredOnHome` puts it in the homepage Featured row; `featuredInCategories` lifts it to the top of those categories when sorted by Featured.
- **Editor's picks:** `editorsPick: true`. Shown separately from sponsored placements.

## SEO

- Static HTML for every page, trailing-slash canonical URLs, per-page titles and descriptions
- `sitemap.xml` and `robots.txt` generated from content
- Sample listings, sample articles and categories with no real listings are `noindex` and left out of the sitemap automatically
- JSON-LD: Organization, WebSite with SearchAction, BreadcrumbList, Article/NewsArticle
- No review-star structured data (Google ignores self-serving ratings and can penalise them)
- Self-labelled as adult (`rating` meta and RTA label) so SafeSearch classifies it correctly rather than guessing

## Before launch

- [ ] Replace the 19 sample listings in `platforms.ts` with researched platforms (target 30–50). `nocturne` is the fully filled-in example of every field.
- [ ] Replace the sample review and comparison in `articles.ts`
- [ ] Change `checkedBy` and the review copy if you don't actually do hands-on testing: several sample texts claim it
- [ ] Set up `hello@` and `ads@` mailboxes, or change the addresses in `src/content/pages.ts` and `src/lib/data.ts`
- [ ] Have a lawyer review the privacy policy and terms in `src/content/pages.ts`
- [ ] Add platform logos to `public/logos/` and set `logo: "/logos/name.svg"`

## Next phase

- **Admin UI:** add [Keystatic](https://keystatic.com) (git-based CMS). It edits the same content files through a web UI, so no database or rebuild of the site is needed.
- **Real popularity:** log `/go/` clicks (Vercel Analytics custom events or a small KV counter) and switch the homepage "Editor's picks" row to "Most popular" once there is data.
- **Scale:** past ~300 listings, move content to JSON files or Supabase and paginate the directory.
