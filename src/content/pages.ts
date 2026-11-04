/**
 * Static info and policy pages. Legal pages are starting drafts: have them
 * reviewed by a lawyer for the jurisdictions you operate in before relying on them.
 */
export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  sections: { heading?: string; body: string[] }[];
}

const EMAIL = "hello@aipornbible.com";
const ADS = "ads@aipornbible.com";

export const pages: StaticPage[] = [
  {
    slug: "about",
    title: "About AI Porn Bible",
    description: "AI Porn Bible is the directory for AI porn: generators, sex chat, AI girlfriends and NSFW AI tools, reviewed and compared.",
    sections: [
      { body: [
        "AI Porn Bible is a directory and review site for AI porn. We track the platforms that generate AI porn images and video, the sex chat and AI girlfriend apps, NSFW character platforms, voice tools and the software creators use.",
        "There are hundreds of AI porn sites and most of them look the same from the outside. We sort them into clear categories, record what each one actually does and costs, and tell you which ones are worth your time.",
      ] },
      { heading: "What we don't do", body: [
        "We don't host porn. Every listing links out to the platform itself. We don't list tools that undress or deepfake real people, and we don't list services that allow content involving minors.",
      ] },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Get in touch with AI Porn Bible: corrections, listing reports, partnerships and press.",
    sections: [
      { body: [
        `Email ${EMAIL} for general questions, corrections and press. We read everything.`,
        `For advertising and sponsored listings, email ${ADS}.`,
      ] },
      { heading: "Report a listing", body: [
        `If a listed platform breaks our content policy, has shut down, or we've got a detail wrong, email ${EMAIL} with the platform name and what's wrong. Reports about non-consensual or underage content are handled first.`,
      ] },
    ],
  },
  {
    slug: "submit",
    title: "Submit a Platform",
    description: "Run an AI porn site? Submit it for a free listing in the AI Porn Bible directory.",
    sections: [
      { body: [
        `Listings are free. Email ${EMAIL} with your platform's name, URL, category, pricing, main features and a contact for verification. If you run an affiliate programme, include the details.`,
        "We check every submission before publishing it. A free listing doesn't guarantee a rating or a review, and paying for a sponsored placement doesn't change our editorial rating.",
      ] },
      { heading: "Listing requirements", body: [
        "To be listed, a platform must prohibit content involving minors, must not offer undressing, nudifying or face-swapping of real people's photos, and must not clone real people's voices without permission. See our content policy for the full rules.",
      ] },
    ],
  },
  {
    slug: "advertising",
    title: "Advertising",
    description: "Reach people actively looking for AI porn sites. Sponsored listings, featured placements and sponsored reviews.",
    sections: [
      { body: [
        "Our visitors are actively choosing an AI porn platform. That makes them some of the highest-intent traffic in the niche.",
      ] },
      { heading: "Options", body: [
        "Featured homepage placement. Featured placement at the top of a category. Premium directory listing with extended profile. Sponsored review or editorial feature.",
        "All paid placements are labelled Sponsored. Sponsorship buys visibility, not ratings: our editorial scores are set independently.",
        `Email ${ADS} for rates and availability.`,
      ] },
    ],
  },
  {
    slug: "editorial-policy",
    title: "Editorial Policy",
    description: "How AI Porn Bible chooses, verifies and rates the platforms in its directory.",
    sections: [
      { heading: "How listings are verified", body: [
        "Every fact on a listing (features, pricing, devices, privacy terms) is either verified with a date, marked Unverified when it comes only from the platform's own marketing, or marked Not yet verified. We don't fill gaps with guesses.",
      ] },
      { heading: "Ratings and reviews", body: [
        "Ratings are out of 10 and only appear when a platform has genuinely been assessed. Every rating and review says whether it comes from hands-on testing or from research. We never claim to have tested something we haven't.",
      ] },
      { heading: "Editor's picks and popularity", body: [
        "Editor's picks are chosen by our editors and can't be bought. Until we have enough real visitor data to rank by popularity, the homepage shows editor's picks rather than invented popularity figures.",
      ] },
      { heading: "Money and independence", body: [
        "We earn money from affiliate links and sponsored placements. Sponsored placements are always labelled. Neither affects ratings, and platforms can't pay to remove a negative review.",
      ] },
    ],
  },
  {
    slug: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    description: "How AI Porn Bible makes money, and how affiliate links and sponsored placements are labelled.",
    sections: [
      { body: [
        "Some links on AI Porn Bible are affiliate links. If you click one and sign up or buy something, we may earn a commission at no extra cost to you.",
        "Some platforms pay for featured or sponsored placement. Those placements are labelled Sponsored wherever they appear.",
        "Affiliate and sponsorship arrangements never change our ratings or reviews. See our editorial policy for details.",
      ] },
    ],
  },
  {
    slug: "content-policy",
    title: "Content & Safety Policy",
    description: "Which AI porn platforms AI Porn Bible will and won't list, and how to report a listing.",
    sections: [
      { body: [
        "AI Porn Bible lists AI porn platforms for adults. We don't host explicit content; we describe and link to the platforms that make it.",
      ] },
      { heading: "What we won't list", body: [
        "Any platform that allows sexual content involving minors, or characters presented as minors.",
        "Nudify, undress and \"clothes remover\" tools, and any service that face-swaps or deepfakes real people into sexual content without their consent.",
        "Voice tools that clone a real person's voice for sexual content without their permission.",
        "Services that host or sell non-consensual intimate imagery of real people.",
      ] },
      { heading: "Reporting", body: [
        `If you believe a listed platform breaks these rules, email ${EMAIL}. We review reports quickly and remove listings that break them.`,
      ] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy & Cookies",
    description: "What data AI Porn Bible collects and how it's used.",
    sections: [
      { heading: "What we collect", body: [
        "We use privacy-friendly, cookieless analytics to count page views and clicks to listed platforms. It doesn't use cookies, doesn't build profiles of individual visitors, and doesn't track you across other sites.",
        "If you email us, we keep your email and message to reply to you.",
      ] },
      { heading: "Cookies", body: [
        "This site doesn't set advertising or tracking cookies, so there is nothing to opt out of. If that changes, a cookie settings control will appear here.",
      ] },
      { heading: "Outbound links", body: [
        "When you click through to a platform, that platform's own privacy policy applies. Affiliate links may carry a tracking parameter so the platform knows you came from us.",
      ] },
      { heading: "Your rights", body: [
        `To ask about or delete any data we hold about you, email ${EMAIL}.`,
      ] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "Terms for using the AI Porn Bible website.",
    sections: [
      { body: [
        "This site is for adults only. By using it you confirm you are 18 or older, or the age of majority where you live, and that viewing information about adult services is legal for you.",
        "We work hard to keep listings accurate, but platforms change their features and prices often. Information is provided as-is; check the platform's own site before you pay for anything.",
        "We're not responsible for the content, services or practices of the third-party sites we link to. Your use of them is governed by their terms.",
        "Content on this site is our own unless stated otherwise. Platform names and logos belong to their owners.",
      ] },
    ],
  },
  {
    slug: "how-we-review",
    title: "How We Review",
    description: "How AI Porn Bible checks, tests and rates AI porn platforms.",
    sections: [
      { body: [
        "Every listing is checked before it goes live: we confirm what the platform does, what it costs, which devices it runs on and what its privacy policy says. Anything we couldn't confirm is marked Unverified or Not yet verified on the listing.",
      ] },
      { heading: "Ratings", body: [
        "Ratings are out of 10 and only appear once a platform has been properly assessed. Sub-scores (for example memory, freedom, value and privacy) depend on the category and are shown on each profile.",
        "Every rating and review says whether it is based on hands-on testing or on research. We don't claim to have tested something we haven't.",
      ] },
      { heading: "Keeping listings current", body: [
        "Platforms change prices and features constantly. Each profile shows when it was last checked. If you spot something out of date, tell us and we'll recheck it.",
      ] },
    ],
  },
  {
    slug: "sponsored-placements",
    title: "How We Label Ads",
    description: "How sponsored placements work on AI Porn Bible, and how they are labelled.",
    sections: [
      { body: [
        "Some platforms pay for placement in the Featured row, at the top of a category, or in a sponsored editorial feature. Every paid placement carries a gold Sponsored label, or a short AD label in compact lists, and paid cards have a gold background.",
        "Editor's picks are marked with a red star. They are chosen by our editors and can never be bought.",
      ] },
      { heading: "What money can't buy", body: [
        "Sponsorship buys visibility, never a rating. Sponsored platforms are rated on the same criteria as everyone else, and a sponsor can't pay to change or remove a review.",
      ] },
    ],
  },
  {
    slug: "content-removal",
    title: "Content Removal",
    description: "How to ask AI Porn Bible to remove or correct a listing or content.",
    sections: [
      { body: [
        `To request removal or correction of a listing, a logo, or anything else on this site, email ${EMAIL} with the page URL and what you'd like changed.`,
        "Reports that a listed platform hosts non-consensual imagery of real people or content involving minors are handled first, and the listing is taken down while we investigate.",
        "Platform owners can request changes to their own listing. We'll correct factual errors; we don't remove accurate criticism.",
      ] },
    ],
  },
];

export const getPage = (slug: string) => pages.find((p) => p.slug === slug);
