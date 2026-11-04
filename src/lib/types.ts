/**
 * Content model for AI Porn Bible.
 *
 * Content lives in src/content/*.ts and is checked by
 * scripts/validate-content.ts on every build, so an incomplete "published"
 * listing fails the deploy instead of going live.
 */

export type ContentStatus = "draft" | "published" | "archived";

/**
 * A fact about a platform. Leave it undefined when you don't know it
 * (rendered as "Not yet verified"). Set `unverified: true` when it comes only
 * from the platform's own marketing (rendered with an "Unverified" tag).
 */
export type Fact<T = string> = { value: T; unverified?: boolean; checkedOn?: string };

export type PricingModel = "free" | "freemium" | "subscription" | "credits" | "paid";
export type PlatformType = "web" | "mobile" | "desktop" | "discord";

/** Feature keys used by directory filters. Profiles can add any other rows. */
export type FilterFeature = "free-tier" | "no-signup" | "unfiltered" | "memory" | "voice" | "native-app" | "crypto";

export interface FeatureRow {
  /** A FilterFeature key (makes it filterable), or any other slug. */
  key: FilterFeature | (string & {});
  /** Optional; defaults to the standard label for filter keys. */
  label?: string;
  value: "yes" | "no" | "unknown";
  /** Claimed by the platform, not yet confirmed. */
  unverified?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  /** One line, used on cards and boxes. */
  short: string;
  /** Original introductory copy for the category page (paragraphs). */
  intro: string[];
  related: string[];
  status: ContentStatus;
}

export interface Platform {
  slug: string;
  name: string;
  status: ContentStatus;
  /** Sample listings show a banner, are noindexed and left out of the sitemap. */
  isSample?: boolean;

  /** Path under /public. Without it, a monogram tile is shown. */
  logo?: string;
  /** 0–360 hue for the monogram tile. */
  hue: number;
  /** Two-letter monogram; defaults to initials of the name. */
  initials?: string;

  websiteUrl: string;
  shortDescription: string;
  primaryCategory: string;
  categories: string[];
  /** Category slug → name, filled in by the content loader (lets cards render without content lookups). */
  catNames?: Record<string, string>;
  platformType: PlatformType;
  pricingModel: PricingModel;
  /** Display tags shown on cards (2–3 short phrases). */
  tags: string[];
  /** Short phrase for comparison tables, e.g. "Long-form roleplay". */
  bestFor?: string;

  dateAdded: string;
  lastUpdated: string;

  features: FeatureRow[];

  glance: {
    price?: Fact;
    freeAccess?: Fact;
    payment?: Fact;
    devices?: Fact;
    account?: Fact;
    billingName?: Fact;
  };

  privacy?: {
    dataRetention?: Fact;
    trainingOnChats?: Fact;
    ageVerification?: Fact;
    allowedContent?: Fact;
    prohibitedContent?: Fact;
  };

  /**
   * Inclusion-policy check. A listing cannot be published unless an editor
   * has confirmed the platform does NOT undress/deepfake real people and
   * prohibits content involving minors. See /content-policy/.
   */
  policyCheck: {
    noRealPersonNudification: boolean;
    prohibitsMinors: boolean;
    checkedOn: string;
    checkedBy: string;
  } | null;

  editorial?: {
    /** 0–10, only when the platform has genuinely been assessed. */
    rating?: number;
    subScores?: { label: string; value: number }[];
    basis: "hands-on" | "research";
    reviewer: string;
    lastChecked: string;
    about: string[];
    pros: string[];
    cons: string[];
    assessment: string[];
    verdict?: string;
  };

  commercial: {
    affiliateUrl?: string;
    affiliateActive: boolean;
    trackingParams?: Record<string, string>;
    /** Paid placement. Always labelled "Sponsored". */
    sponsored: boolean;
    sponsoredFrom?: string;
    sponsoredUntil?: string;
    /** Chosen by editors. Can never be bought. */
    editorsPick: boolean;
    featuredOnHome: boolean;
    featuredInCategories: string[];
  };
}

export type ArticleKind = "review" | "comparison" | "guide" | "news";

export interface ArticleSection {
  heading: string;
  /** Shows an inline platform summary card before the section body. */
  platform?: string;
  body: string[];
  /** Numbered list items. */
  list?: { title: string; body: string }[];
}

export interface Article {
  slug: string;
  kind: ArticleKind;
  status: ContentStatus;
  isSample?: boolean;
  title: string;
  description: string;
  publishedOn: string;
  updatedOn: string;
  author: string;
  authorRole?: string;
  category?: string;
  /** Reviews: the platform reviewed. Comparisons: the ranked list, in order. */
  platforms?: string[];
  /** Comparisons: summary strip winners. */
  winners?: { label: string; platform: string }[];
  /** Reviews: how the review was produced. Shown on the page. */
  basis?: "hands-on" | "research";
  sponsored?: boolean;
  sections: ArticleSection[];
}
