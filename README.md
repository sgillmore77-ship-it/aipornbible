# AI Porn Bible

The AI porn directory. Next.js 15 (App Router) + TypeScript + Tailwind CSS 4, with a Keystatic admin dashboard at `/keystatic`. Every public page is pre-built static HTML: content is read once at build time, never per request. Outbound `/go/<slug>/` links are compiled into edge redirects.

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
3. Add the environment variable `NEXT_PUBLIC_SITE_URL=https://www.aipornbible.com` (the address the site is served on).
4. Add the domain under **Settings → Domains**.
5. Turn on **Analytics** in the project dashboard (cookieless page views, already wired in).

Or from the terminal: `npx vercel` then `npx vercel --prod`.

**Moving off Vercel later:** it's a standard Next.js app, so it runs on Netlify, Cloudflare (via OpenNext), Railway or any Node host with `npm run build && npm start`. Swap `@vercel/analytics` for Plausible, Umami or similar, and replace the `/go/` redirects in `next.config.ts` with that host's equivalent if it doesn't support Next.js redirects.

## Adding and editing content

### The dashboard (recommended)

Go to **https://www.aipornbible.com/keystatic** and sign in. There are forms for:

- **Platforms**: every listing field, including features, pricing, the content policy check, rating and pros/cons, and sponsorship and affiliate settings
- **Categories**: name, intro copy, order and related categories
- **Articles**: reviews, comparisons, guides and news, built from sections
- **Info & policy pages**

Clicking **Save** commits the change to GitHub. Vercel rebuilds and the change is live in about a minute. Set **Status** to Draft while you work; only Published content appears on the site.

In long text boxes, separate paragraphs with a blank line.

#### One-time setup (Keystatic Cloud, free for up to 3 users)

1. Go to keystatic.cloud and sign in with GitHub.
2. Create a team, then a project, and connect it to this GitHub repository.
3. Copy the project ID shown in the project settings (it looks like `your-team/aipornbible`).
4. In Vercel → Settings → Environment Variables, add `NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT` with that ID, then redeploy.

Until step 4 is done, `/keystatic` shows a "not connected" message and nothing can be edited.

### Editing locally

`npm run dev`, then open http://localhost:3000/keystatic. Locally, the dashboard writes straight to the files on disk.

### Where content lives

Everything is JSON in `content/`, one file per item: `content/platforms/<slug>.json`, `content/categories/`, `content/articles/`, `content/pages/`. The filename is the URL slug. `src/lib/content.ts` loads these at build time.

`npm run check:dashboard` confirms every file still matches the dashboard schema in `keystatic.config.tsx`.

### Rules the build enforces

`npm run build` runs `scripts/validate-content.ts` first, so a broken save can't take the site down. It **fails** the deploy (the live site stays on the previous version) if a published listing:

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

Every fact on a listing (price, payment, devices and so on) has three states:

- **Value plus a "checked on" date**: verified.
- **Value with "Unverified" ticked**: shows an Unverified tag. Use it for things that only come from the platform's own marketing.
- **Empty**: shows "Not yet verified".

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

- [ ] Replace the 19 sample listings with researched platforms (target 30–50). Nocturne is the fully filled-in example of every field.
- [ ] Replace the sample review and comparison
- [ ] Change `checkedBy` and the review copy if you don't actually do hands-on testing: several sample texts claim it
- [ ] Set up `hello@` and `ads@` mailboxes, or change the addresses in the info pages and `src/lib/site.ts`
- [ ] Have a lawyer review the privacy policy and terms
- [ ] Upload platform logos (Logo field on each platform)

## Next phase

- **Real popularity:** log `/go/` clicks (Vercel Analytics custom events or a small KV counter) and switch the homepage "Editor's picks" row to "Most popular" once there is data.
- **Scale:** past ~300 listings, move content to JSON files or Supabase and paginate the directory.
