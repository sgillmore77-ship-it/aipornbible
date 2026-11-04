import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    slug: "how-ai-porn-generators-work",
    kind: "guide",
    status: "published",
    title: "How AI porn generators work",
    description: "A plain-English explanation of diffusion models, prompts, seeds and why the same prompt gives different results.",
    publishedOn: "2026-11-01",
    updatedOn: "2026-11-01",
    author: "AI Porn Bible Editorial",
    category: "ai-porn-generators",
    sections: [
      {
        heading: "The short version",
        body: [
          "Most AI image generators use diffusion models. During training, a model is shown millions of images with noise gradually added, and learns to reverse that process. When you generate an image, it starts from pure random noise and removes it step by step, steered towards whatever your prompt describes.",
        ],
      },
      {
        heading: "Prompts, seeds and steps",
        body: [
          "Your prompt is converted into a numerical representation that guides each denoising step. The seed decides the starting noise, which is why the same prompt with a different seed produces a different image, and the same prompt with the same seed reproduces it.",
          "Steps control how many denoising passes the model makes. More steps can add detail but take longer and cost more. Guidance (sometimes called CFG) controls how strictly the model follows the prompt versus producing something more natural-looking.",
        ],
      },
      {
        heading: "Why platforms differ",
        body: [
          "Platforms differ in the base model they run, any fine-tuning on top of it, and the tools around it: character consistency, inpainting to fix parts of an image, upscaling, and saved styles. Two services built on similar models can feel very different because of those tools and their default settings.",
          "AI porn platforms usually fine-tune open models or train their own. That is why quality, anatomy accuracy and style range vary so much across the directory.",
        ],
      },
      {
        heading: "What to check before you pay",
        body: [
          "Look at whether failed or unwanted generations still use credits, whether you can keep a character consistent across images, who owns the output, and what happens to your prompts and images after you create them. Our platform profiles record these details where we have been able to verify them.",
        ],
      },
    ],
  },
  {
    slug: "ai-porn-privacy",
    kind: "guide",
    status: "published",
    title: "Staying private on AI porn and sex chat sites",
    description: "What these platforms can know about you, and the practical steps that reduce your exposure.",
    publishedOn: "2026-11-02",
    updatedOn: "2026-11-02",
    author: "AI Porn Bible Editorial",
    category: "ai-sex-chat",
    sections: [
      {
        heading: "What a platform can see",
        body: [
          "An AI platform sees everything you type and generate. Companion apps in particular store long conversation histories, which can be among the most personal data you hand to any service. Payment details, email addresses and device information add to that picture.",
        ],
      },
      {
        heading: "Questions to ask",
        body: [
          "Does the platform say whether your chats or images are used to train its models? Can you delete your history, and does deletion actually remove it? Where is the company based, and which data protection law applies? How does the charge appear on your bank statement?",
          "If a privacy policy doesn't answer these questions clearly, treat that as an answer in itself.",
        ],
      },
      {
        heading: "Practical steps",
        body: [
          "Use a separate email address. Avoid sharing identifying details about yourself or anyone else in chats. Turn on two-factor authentication where offered. Check whether a platform offers a discreet billing descriptor, and periodically delete history you don't need to keep.",
          "Never upload photos of real people to generate sexual imagery. Beyond being harmful, creating sexually explicit deepfakes of real people is a criminal offence in the UK and many other places.",
        ],
      },
    ],
  },
  {
    slug: "nocturne",
    kind: "review",
    status: "published",
    isSample: true,
    title: "Nocturne Review: Still the Roleplay Benchmark",
    description: "Three weeks with Nocturne: memory that holds across sessions, a huge scenario library, and a privacy policy that needs work.",
    publishedOn: "2026-10-29",
    updatedOn: "2026-10-29",
    author: "Mara Quill",
    authorRole: "senior reviewer",
    category: "ai-sex-chat",
    platforms: ["nocturne"],
    basis: "hands-on",
    sections: [
      { heading: "Overview", body: ["This is a sample review showing the review template. Every real review says whether it is based on hands-on testing or research."] },
      { heading: "What it does", body: ["Nocturne is a browser-based AI sex chat platform built around long-form roleplay, with a library of community-written scenarios and a character builder."] },
      { heading: "Memory and roleplay", body: ["Characters recall names, preferences and past scenes across weeks, not just within a session."] },
      { heading: "Pricing", body: ["A usable free tier of 50 messages a day. Premium removes the cap; Ultra adds priority and image credits."] },
      { heading: "Privacy", body: ["Chat deletion works, but the policy doesn't say whether conversations are used for training."] },
      { heading: "Verdict", body: ["The best place to start if you want long, coherent roleplay. Pay for Premium only once you hit the daily cap."] },
    ],
  },
  {
    slug: "best-ai-sex-chat-sites",
    kind: "comparison",
    status: "published",
    isSample: true,
    title: "Best AI Sex Chat Sites in 2026: 6 Platforms Tested",
    description: "We paid for every plan, ran the same 40 scenarios on each, and scored memory, freedom, value and privacy.",
    publishedOn: "2026-11-01",
    updatedOn: "2026-11-01",
    author: "Mara Quill",
    authorRole: "senior reviewer",
    category: "ai-sex-chat",
    platforms: ["nocturne", "whisperline", "candlelight", "velour-chat", "midnight-ink", "the-parlour"],
    winners: [
      { label: "Best overall", platform: "nocturne" },
      { label: "Best free", platform: "midnight-ink" },
      { label: "Best for characters", platform: "candlelight" },
    ],
    sections: [
      {
        heading: "How we tested",
        body: [
          "Each platform got a paid account bought with our own money and the same battery of 40 scenarios: short scenes, multi-day storylines, group roleplay and deliberate attempts to make the character forget. We logged every refusal, every lapse in memory and every upsell prompt.",
          "Scores are weighted: memory 30%, freedom 25%, writing quality 20%, value 15%, privacy 10%. Sponsored platforms go through the identical process and receive no adjustment.",
        ],
      },
      {
        heading: "1. Nocturne: best overall",
        platform: "nocturne",
        body: [
          "Nocturne held a four-character storyline across 40+ sessions with only minor slips, the best memory result in this test by a wide margin. It almost never breaks character to moralise, and its community scenario library means you rarely start from a blank page.",
          "It loses points on privacy: the policy doesn't say whether chats are used for training, and support didn't answer when we asked. Voice is absent entirely.",
        ],
      },
      {
        heading: "2. Whisperline: best for chat with images",
        platform: "whisperline",
        body: ["Whisperline is the most polished interface here, and the only one where generated images arrive mid-conversation without breaking the flow. Memory is good for a week or so, then starts to blur details."],
      },
      {
        heading: "3. Candlelight: best for characters",
        platform: "candlelight",
        body: ["Sample section. Candlelight's character builder and 40,000+ community personas make it the best pick if you'd rather choose a character than write one."],
      },
      {
        heading: "What to look for",
        body: [],
        list: [
          { title: "Real memory, not a long context window.", body: "Ask about something from three days ago." },
          { title: "Cost per message after the free tier.", body: "Credit systems hide this; we calculate it for you." },
          { title: "A deletion button that actually deletes.", body: "Check the policy, not the marketing page." },
        ],
      },
    ],
  },
  {
    slug: "welcome-to-ai-porn-bible",
    kind: "news",
    status: "published",
    title: "Welcome to AI Porn Bible",
    description: "What this directory is, how listings are chosen, and how we keep editorial and commercial decisions separate.",
    publishedOn: "2026-11-03",
    updatedOn: "2026-11-03",
    author: "AI Porn Bible Editorial",
    sections: [
      {
        heading: "What we're building",
        body: [
          "AI Porn Bible is the directory for AI porn: generators, AI porn video, sex chat, AI girlfriends, NSFW characters, voice and creator tools. We don't host porn ourselves. We review, compare and link to the platforms that make it, so you can find the good ones fast.",
        ],
      },
      {
        heading: "How listings work",
        body: [
          "Every listing is checked before it goes live. We don't list tools that undress or deepfake real people, or any service that allows content involving minors. Where we haven't been able to verify a detail, the listing says so.",
          "Some listings are sponsored or include affiliate links. These are always labelled, and payment never decides an editorial rating.",
        ],
      },
    ],
  },
];
