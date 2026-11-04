/**
 * Keystatic admin dashboard: forms for every kind of content on the site.
 * Opens at /keystatic. Content is saved as JSON files under /content and
 * read at build time, so public pages stay fully static.
 *
 * Storage:
 * - Local development: edits are written straight to the files on disk.
 * - Production: set NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT (e.g. "my-team/aipornbible")
 *   to use Keystatic Cloud, which signs you in and commits edits to GitHub.
 */
import { collection, config, fields } from "@keystatic/core";

const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT;

const STATUS = fields.select({
  label: "Status",
  description: "Only Published content appears on the site.",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ],
  defaultValue: "draft",
});

const paragraphs = (label: string, description = "Separate paragraphs with a blank line.") =>
  fields.text({ label, multiline: true, description });

const optionalDate = (label: string, description?: string) =>
  fields.date({ label, description, validation: { isRequired: false } });

/** A fact about a platform. Leave the value empty if you don't know it. */
const fact = (label: string, description?: string) =>
  fields.object(
    {
      value: fields.text({ label, description: description ?? "Leave empty if unknown; the site shows “Not yet verified”." }),
      unverified: fields.checkbox({ label: "Unverified", description: "Tick if this only comes from the platform's own marketing." }),
      checkedOn: optionalDate("Checked on"),
    },
    { label, layout: [6, 3, 3] },
  );

const FEATURE_OPTIONS = [
  { label: "Free tier (filterable)", value: "free-tier" },
  { label: "No signup (filterable)", value: "no-signup" },
  { label: "Unfiltered (filterable)", value: "unfiltered" },
  { label: "Memory (filterable)", value: "memory" },
  { label: "Voice (filterable)", value: "voice" },
  { label: "Native app (filterable)", value: "native-app" },
  { label: "Crypto payments (filterable)", value: "crypto" },
  { label: "Other feature (use the label below)", value: "custom" },
] as const;

export default config({
  storage: cloudProject ? { kind: "cloud" } : { kind: "local" },
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: "AI Porn Bible" },
    navigation: {
      Directory: ["platforms", "categories"],
      Editorial: ["articles"],
      Site: ["pages"],
    },
  },
  collections: {
    platforms: collection({
      label: "Platforms",
      path: "content/platforms/*",
      format: { data: "json" },
      slugField: "name",
      columns: ["status", "primaryCategory", "lastUpdated"],
      schema: {
        name: fields.slug({
          name: { label: "Platform name", validation: { isRequired: true } },
          slug: { label: "URL slug", description: "Used in the page address: /platform/<slug>/. Don't change it once published." },
        }),
        status: STATUS,
        isSample: fields.checkbox({ label: "Sample listing", description: "Sample listings show a banner and are hidden from Google. Untick for real platforms." }),

        websiteUrl: fields.url({ label: "Website URL", validation: { isRequired: true } }),
        shortDescription: fields.text({
          label: "Short description",
          description: "One or two sentences shown on cards (at least 40 characters).",
          multiline: true,
          validation: { isRequired: true, length: { min: 40 } },
        }),
        primaryCategory: fields.relationship({ label: "Main category", collection: "categories", validation: { isRequired: true } }),
        categories: fields.multiRelationship({ label: "All categories", description: "Include the main category too.", collection: "categories" }),
        platformType: fields.select({
          label: "Platform type",
          options: [
            { label: "Web app", value: "web" },
            { label: "Mobile app", value: "mobile" },
            { label: "Desktop software", value: "desktop" },
            { label: "Discord", value: "discord" },
          ],
          defaultValue: "web",
        }),
        pricingModel: fields.select({
          label: "Pricing model",
          options: [
            { label: "Free", value: "free" },
            { label: "Freemium", value: "freemium" },
            { label: "Subscription", value: "subscription" },
            { label: "Credits", value: "credits" },
            { label: "Paid", value: "paid" },
          ],
          defaultValue: "freemium",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Card tags", description: "2–3 short phrases shown on cards, e.g. “Long memory”.", itemLabel: (p) => p.value || "Tag" }),
        bestFor: fields.text({ label: "Best for", description: "Short phrase for comparison tables, e.g. “Long-form roleplay”." }),

        logo: fields.image({ label: "Logo", description: "Square image. Without one, a coloured monogram is shown.", directory: "public/logos", publicPath: "/logos/" }),
        initials: fields.text({ label: "Monogram letters", description: "Two letters for the monogram. Defaults to the name's initials." }),
        hue: fields.integer({ label: "Monogram colour", description: "0–360 on the colour wheel (0 red, 120 green, 240 blue).", defaultValue: 200, validation: { min: 0, max: 360 } }),

        dateAdded: fields.date({ label: "Date added", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        lastUpdated: fields.date({ label: "Last updated", defaultValue: { kind: "today" }, validation: { isRequired: true } }),

        features: fields.array(
          fields.object(
            {
              key: fields.select({ label: "Feature", options: FEATURE_OPTIONS as unknown as { label: string; value: string }[], defaultValue: "custom" }),
              label: fields.text({ label: "Label", description: "Required for “Other feature”. Optional otherwise." }),
              value: fields.select({
                label: "Has it?",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                  { label: "Unknown", value: "unknown" },
                ],
                defaultValue: "yes",
              }),
              unverified: fields.checkbox({ label: "Unverified", description: "Claimed by the platform, not yet confirmed." }),
            },
            { layout: [4, 4, 2, 2] },
          ),
          {
            label: "Features",
            description: "Filterable features power the directory filters.",
            itemLabel: (p) => {
              const key = p.fields.key.value;
              const name = p.fields.label.value || FEATURE_OPTIONS.find((o) => o.value === key)?.label.replace(/ \(.*\)$/, "") || key;
              return `${name}: ${p.fields.value.value}${p.fields.unverified.value ? " (unverified)" : ""}`;
            },
          },
        ),

        glance: fields.object(
          {
            price: fact("Price", "e.g. “Free · $9.99/mo”"),
            freeAccess: fact("Free trial / free access", "e.g. “50 messages/day”"),
            payment: fact("Payment methods", "e.g. “Card, crypto”"),
            devices: fact("Devices", "e.g. “Web, iOS, Android”"),
            account: fact("Account needed", "e.g. “Yes, email only”"),
            billingName: fact("Billing name", "What appears on bank statements"),
          },
          { label: "At a glance" },
        ),

        privacy: fields.object(
          {
            dataRetention: fact("Data retention"),
            trainingOnChats: fact("Training on your chats"),
            ageVerification: fact("Age verification"),
            allowedContent: fact("Allowed content"),
            prohibitedContent: fact("Prohibited content"),
          },
          { label: "Privacy & content rules" },
        ),

        policyCheck: fields.object(
          {
            noRealPersonNudification: fields.checkbox({ label: "Does NOT undress, nudify or deepfake real people" }),
            prohibitsMinors: fields.checkbox({ label: "Prohibits content involving minors" }),
            checkedOn: optionalDate("Checked on"),
            checkedBy: fields.text({ label: "Checked by" }),
          },
          { label: "Content policy check", description: "Required before publishing. The site won't build if a published listing fails this." },
        ),

        editorial: fields.conditional(
          fields.checkbox({ label: "Has an editorial assessment", description: "Tick to add a rating, pros/cons and verdict." }),
          {
            true: fields.object({
              rating: fields.number({ label: "Rating out of 10", description: "Leave empty for “Not yet rated”.", step: 0.1, validation: { min: 0, max: 10 } }),
              subScores: fields.array(
                fields.object({ label: fields.text({ label: "Label" }), value: fields.number({ label: "Score", step: 0.1, validation: { min: 0, max: 10, isRequired: true } }) }, { layout: [8, 4] }),
                { label: "Sub-scores", itemLabel: (p) => `${p.fields.label.value}: ${p.fields.value.value ?? ""}` },
              ),
              basis: fields.select({
                label: "Based on",
                options: [
                  { label: "Research", value: "research" },
                  { label: "Hands-on testing", value: "hands-on" },
                ],
                defaultValue: "research",
              }),
              reviewer: fields.text({ label: "Reviewer" }),
              lastChecked: fields.date({ label: "Last checked", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
              about: paragraphs("About"),
              pros: fields.array(fields.text({ label: "Pro" }), { label: "Pros", itemLabel: (p) => p.value || "Pro" }),
              cons: fields.array(fields.text({ label: "Con" }), { label: "Cons", itemLabel: (p) => p.value || "Con" }),
              assessment: paragraphs("Our assessment"),
              verdict: fields.text({ label: "Verdict pull-quote", multiline: true }),
            }),
            false: fields.empty(),
          },
        ),

        commercial: fields.object(
          {
            sponsored: fields.checkbox({ label: "Sponsored (paid placement)", description: "Always labelled “Sponsored” on the site." }),
            sponsoredFrom: optionalDate("Sponsored from"),
            sponsoredUntil: optionalDate("Sponsored until", "The build warns you when this date passes."),
            editorsPick: fields.checkbox({ label: "Editor's pick", description: "Chosen by editors. Must never be paid for." }),
            featuredOnHome: fields.checkbox({ label: "Show in homepage Featured row" }),
            featuredInCategories: fields.multiRelationship({ label: "Featured at the top of these categories", collection: "categories" }),
            affiliateActive: fields.checkbox({ label: "Affiliate link active" }),
            affiliateUrl: fields.url({ label: "Affiliate URL", validation: { isRequired: false } }),
            trackingParams: fields.array(
              fields.object({ key: fields.text({ label: "Parameter" }), value: fields.text({ label: "Value" }) }, { layout: [6, 6] }),
              { label: "Tracking parameters", description: "Added to the outbound URL, e.g. utm_source = aipornbible.", itemLabel: (p) => `${p.fields.key.value}=${p.fields.value.value}` },
            ),
          },
          { label: "Commercial" },
        ),
      },
    }),

    categories: collection({
      label: "Categories",
      path: "content/categories/*",
      format: { data: "json" },
      slugField: "name",
      columns: ["status", "order"],
      schema: {
        name: fields.slug({
          name: { label: "Category name", validation: { isRequired: true } },
          slug: { label: "URL slug", description: "Used in /category/<slug>/. Don't change it once published." },
        }),
        status: STATUS,
        order: fields.integer({ label: "Display order", description: "Lower numbers appear first.", defaultValue: 10 }),
        short: fields.text({ label: "Short description", description: "One line shown on category boxes.", validation: { isRequired: true } }),
        intro: paragraphs("Introduction", "Original copy for the category page (at least 200 characters). Separate paragraphs with a blank line. Mentions of other category names become links automatically."),
        related: fields.multiRelationship({ label: "Related categories", collection: "categories" }),
      },
    }),

    articles: collection({
      label: "Articles",
      path: "content/articles/*",
      format: { data: "json" },
      slugField: "title",
      columns: ["kind", "status", "publishedOn"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
          slug: { label: "URL slug", description: "Used in the address, e.g. /reviews/<slug>/." },
        }),
        kind: fields.select({
          label: "Type",
          options: [
            { label: "Review", value: "review" },
            { label: "Comparison", value: "comparison" },
            { label: "Guide", value: "guide" },
            { label: "News", value: "news" },
          ],
          defaultValue: "guide",
        }),
        status: STATUS,
        isSample: fields.checkbox({ label: "Sample article", description: "Hidden from Google, with a banner." }),
        description: fields.text({ label: "Standfirst / description", multiline: true, validation: { isRequired: true, length: { min: 40 } } }),
        publishedOn: fields.date({ label: "Published", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        updatedOn: fields.date({ label: "Last updated", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        author: fields.text({ label: "Author", defaultValue: "AI Porn Bible Editorial" }),
        authorRole: fields.text({ label: "Author role", description: "e.g. “senior reviewer”" }),
        category: fields.relationship({ label: "Category", collection: "categories" }),
        basis: fields.select({
          label: "Reviews: based on",
          options: [
            { label: "Not a review", value: "" },
            { label: "Research", value: "research" },
            { label: "Hands-on testing", value: "hands-on" },
          ],
          defaultValue: "",
        }),
        sponsored: fields.checkbox({ label: "Sponsored article" }),
        platforms: fields.multiRelationship({ label: "Platforms", description: "Reviews: the platform reviewed. Comparisons: the ranked list, in order.", collection: "platforms" }),
        winners: fields.array(
          fields.object({ label: fields.text({ label: "Award", description: "e.g. “Best overall”" }), platform: fields.relationship({ label: "Platform", collection: "platforms", validation: { isRequired: true } }) }, { layout: [6, 6] }),
          { label: "Comparisons: winners strip", itemLabel: (p) => `${p.fields.label.value}: ${p.fields.platform.value ?? ""}` },
        ),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: "Heading", validation: { isRequired: true } }),
            platform: fields.relationship({ label: "Show a platform card under the heading", collection: "platforms" }),
            body: paragraphs("Body"),
            list: fields.array(
              fields.object({ title: fields.text({ label: "Point (bold)" }), body: fields.text({ label: "Detail" }) }),
              { label: "Numbered list", itemLabel: (p) => p.fields.title.value || "Item" },
            ),
          }),
          { label: "Sections", itemLabel: (p) => p.fields.heading.value || "Section" },
        ),
      },
    }),

    pages: collection({
      label: "Info & policy pages",
      path: "content/pages/*",
      format: { data: "json" },
      slugField: "title",
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
          slug: { label: "URL slug", description: "The page lives at /<slug>/. Footer links use these, so don't rename existing ones." },
        }),
        description: fields.text({ label: "Meta description", multiline: true, validation: { isRequired: true } }),
        sections: fields.array(
          fields.object({ heading: fields.text({ label: "Heading (optional)" }), body: paragraphs("Body") }),
          { label: "Sections", itemLabel: (p) => p.fields.heading.value || "Section" },
        ),
      },
    }),
  },
});
