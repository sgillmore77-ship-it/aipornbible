import type { FilterFeature, PlatformType, PricingModel } from "./types";

export const PRICING_LABELS: Record<PricingModel, string> = {
  free: "Free",
  freemium: "Freemium",
  subscription: "Subscription",
  credits: "Credits",
  paid: "Paid",
};

export const TYPE_LABELS: Record<PlatformType, string> = {
  web: "Web app",
  mobile: "Mobile app",
  desktop: "Desktop software",
  discord: "Discord",
};

export const FEATURE_LABELS: Record<FilterFeature, string> = {
  "free-tier": "Free tier",
  "no-signup": "No signup",
  unfiltered: "Unfiltered",
  memory: "Memory",
  voice: "Voice",
  "native-app": "Native app",
  crypto: "Crypto payments",
};

export const FILTER_FEATURES = Object.keys(FEATURE_LABELS) as FilterFeature[];

export type SortKey = "featured" | "az" | "added" | "updated";
export const SORTS: [SortKey, string][] = [
  ["featured", "Featured"],
  ["az", "A–Z"],
  ["added", "Recently added"],
  ["updated", "Recently updated"],
];

export const verdictWord = (r: number) =>
  r >= 9 ? "Outstanding" : r >= 8 ? "Excellent" : r >= 7 ? "Good" : r >= 6 ? "Decent" : "Mixed";
