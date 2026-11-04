import type { Category } from "@/lib/types";

/**
 * Category names and slugs follow what people actually search for
 * ("ai porn generator", "ai sex chat", "ai girlfriend", "nsfw ai" ...).
 */
export const categories: Category[] = [
  {
    slug: "ai-porn-generators",
    name: "AI Porn Generators",
    short: "Text-to-image tools for explicit stills in any style.",
    status: "published",
    related: ["ai-porn-video-generators", "nsfw-ai-characters", "ai-porn-creator-tools"],
    intro: [
      "AI porn generators turn a written prompt into an explicit image in seconds. They're the biggest category in AI porn, and the gap between the best and worst tools is huge: realism, anatomy, art styles, how well a character stays consistent from one image to the next, and how much control you get over poses and composition.",
      "Pricing varies just as much. Some generators give you a handful of free images a day, others sell credit packs or monthly subscriptions with unlimited generations. We note whether failed generations eat your credits, because on some platforms that's where most of the money goes.",
      "We list every generator we can verify, with one exception: tools that undress or deepfake photos of real people. Those aren't listed here.",
    ],
  },
  {
    slug: "ai-porn-video-generators",
    name: "AI Porn Video Generators",
    short: "Turn prompts or images into explicit clips.",
    status: "published",
    related: ["ai-porn-generators", "ai-porn-creator-tools", "ai-sex-voice-audio"],
    intro: [
      "AI porn video is the fastest-moving part of the industry. Most tools produce short clips of a few seconds, either from a text prompt or by animating an image you've already generated, and quality swings a lot between platforms.",
      "Video costs far more to generate than images, so almost every platform uses credits. When comparing them, look at clip length, resolution, credits per clip, and whether you get credits back when a generation comes out broken.",
    ],
  },
  {
    slug: "ai-sex-chat",
    name: "AI Sex Chat",
    short: "Uncensored erotic roleplay and text chat.",
    status: "published",
    related: ["ai-girlfriends", "nsfw-ai-characters", "ai-sex-voice-audio"],
    intro: [
      "AI sex chat sites let you hold explicit, open-ended conversations with an AI character. Some are blank-slate roleplay engines where you write the scenario; others give you a ready-made persona with a backstory, a voice and a memory of what you talked about last week.",
      "The differences that matter are memory (does it remember yesterday?), freedom (what does the filter actually block?), and cost per message once the free tier runs out. We score each platform on those three, plus privacy.",
      "If you want a persistent partner rather than scenes, see AI Girlfriends. For building your own characters, see NSFW AI Characters.",
    ],
  },
  {
    slug: "ai-girlfriends",
    name: "AI Girlfriends",
    short: "Companions with memory, selfies and personality.",
    status: "published",
    related: ["ai-sex-chat", "ai-porn-models", "ai-sex-voice-audio"],
    intro: [
      "AI girlfriend apps give you an ongoing relationship with an AI partner: a consistent personality, memory of what you've told them, and usually pictures, selfies and voice messages on request. Most let you design your partner's look and personality, or pick from ready-made characters.",
      "Memory is what separates good apps from bad ones, followed by image quality and pricing. These are personal conversations, so we also note what each app says about storing and deleting your chats.",
    ],
  },
  {
    slug: "nsfw-ai-characters",
    name: "NSFW AI Characters",
    short: "Persona libraries and custom character builders.",
    status: "published",
    related: ["ai-sex-chat", "ai-porn-generators", "ai-porn-communities"],
    intro: [
      "NSFW character platforms are built around personas: appearance, personality, backstory and kinks. Some are mainly creation tools, others are huge libraries of user-made characters you can chat with straight away.",
      "Look at how much control you get over a character, whether their look stays consistent across images, and how good the library is if you'd rather not build your own.",
    ],
  },
  {
    slug: "ai-sex-voice-audio",
    name: "AI Sex Voice & Audio",
    short: "Voice calls, erotic TTS and audio stories.",
    status: "published",
    related: ["ai-sex-chat", "ai-girlfriends", "ai-porn-video-generators"],
    intro: [
      "AI voice platforms generate spoken audio, from voice notes in a sex chat app to full erotic audio stories and real-time AI phone sex. Quality comes down to how natural the voice sounds, its range, and how fast it responds in live calls.",
      "We don't list services that clone a real person's voice without their permission.",
    ],
  },
  {
    slug: "ai-porn-creator-tools",
    name: "AI Porn Creator Tools",
    short: "Upscaling, inpainting, editing and workflows.",
    status: "published",
    related: ["ai-porn-generators", "ai-porn-video-generators", "ai-porn-models"],
    intro: [
      "Creator tools are for people making adult content to sell: upscalers, editors, batch generators, model-training services and tools that build an AI version of a creator's own likeness.",
      "The questions here are commercial: who owns the output, whether you can sell it, how well the tool fits into a publishing workflow, and whether likeness training requires proof that the creator agreed to it.",
    ],
  },
  {
    slug: "ai-porn-communities",
    name: "AI Porn Communities",
    short: "Prompt sharing, galleries, forums and Discords.",
    status: "published",
    related: ["ai-porn-generators", "nsfw-ai-characters", "ai-porn-creator-tools"],
    intro: [
      "AI porn communities are where people share their generations, prompts, models and techniques. They range from galleries attached to a generator to independent forums and model-sharing hubs with thousands of NSFW checkpoints and LoRAs.",
      "We rate communities on what's there and how well they're run: active moderation and a working way to report illegal material.",
    ],
  },
  {
    slug: "ai-porn-models",
    name: "AI Models & Influencers",
    short: "Virtual creators with subscription feeds.",
    status: "published",
    related: ["ai-girlfriends", "ai-porn-creator-tools", "ai-sex-chat"],
    intro: [
      "AI models and influencers are fully AI-generated personas that post NSFW content, build followings and sell subscriptions, often with a chat feature where fans can talk to them directly. This category covers the platforms that host them and the agencies that build them.",
      "We list synthetic personas only. Accounts that use a real, identifiable person's face without consent aren't listed.",
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
