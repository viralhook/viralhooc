import { GeneratorData } from "@/components/GeneratorForm";
import { GeneratedResult } from "@/components/ResultsDisplay";

const hooks: Record<string, string[]> = {
  "Animals & Pets": [
    "This golden retriever did something that made everyone cry...",
    "Wait for it... this cat's reaction is PRICELESS",
    "Nobody believed me when I said my dog could do this",
    "The vet said this was impossible, but watch what happened",
  ],
  "Motivation": [
    "I was broke 2 years ago. Here's the ONE thing that changed everything",
    "Stop scrolling. This will change your life in 60 seconds",
    "The brutal truth nobody tells you about success",
    "I lost everything at 25. Here's how I came back stronger",
  ],
  "Gaming": [
    "This glitch broke the entire game...",
    "1 in a million gaming moment caught on camera",
    "The devs didn't want you to know this trick",
    "I found a secret that changes EVERYTHING",
  ],
  "AI Stories": [
    "AI just predicted something terrifying for 2025...",
    "I asked AI to write my future. What it said gave me chills",
    "This AI-generated story will haunt your dreams",
    "The AI saw something in this photo that humans can't",
  ],
  default: [
    "You won't believe what happens next...",
    "This changed everything I thought I knew",
    "Nobody is talking about this, but they should be",
    "I discovered something that will blow your mind",
  ],
};

const storylines: Record<string, string[]> = {
  "Animals & Pets": [
    "Start with the hook showing the pet's face. Build tension with slow-mo. Reveal the heartwarming moment. End with the reaction shot.",
    "Open with the 'before' scene. Show the transformation journey. Hit them with the emotional payoff. Close with a call to action.",
  ],
  "Motivation": [
    "Hook with your lowest point. Show 3 rapid-fire lessons learned. Transition to the breakthrough moment. End with powerful advice.",
    "Start controversial. Back it up with your story. Provide actionable steps. Close with motivation.",
  ],
  default: [
    "Open with the hook that stops the scroll. Build curiosity in the middle. Deliver the payoff. End with engagement bait.",
    "Start with tension or mystery. Reveal information progressively. Hit the climax at 80%. Close strong with CTA.",
  ],
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateViralIdea = async (data: GeneratorData): Promise<GeneratedResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const nicheHooks = hooks[data.niche] || hooks.default;
  const nicheStorylines = storylines[data.niche] || storylines.default;

  const platformHashtags: Record<string, string[]> = {
    tiktok: ["#fyp", "#foryou", "#viral", "#tiktok"],
    youtube: ["#shorts", "#youtubeshorts", "#viral", "#trending"],
    reels: ["#reels", "#reelsinstagram", "#viral", "#explore"],
  };

  const goalHashtags: Record<string, string[]> = {
    views: ["#viralvideo", "#mustwatch", "#trending"],
    followers: ["#followme", "#newcreator", "#supportsmallcreators"],
    sales: ["#shopnow", "#linkinbio", "#musthave"],
  };

  const nicheHashtags = [
    `#${data.niche.toLowerCase().replace(/\s+/g, "")}`,
    `#${data.niche.toLowerCase().replace(/\s+/g, "")}content`,
  ];

  const hook = getRandomItem(nicheHooks);
  const storyline = getRandomItem(nicheStorylines);

  return {
    hook,
    storyline,
    title: `${hook.slice(0, 50)}... | ${data.niche} Content`,
    aiPrompt: `Create a ${data.platform === "youtube" ? "YouTube Shorts" : data.platform === "reels" ? "Instagram Reels" : "TikTok"} video about ${data.niche.toLowerCase()}. Start with: "${hook}" Then follow this storyline: ${storyline} The goal is to ${data.goal === "views" ? "maximize views" : data.goal === "followers" ? "grow followers" : "drive sales"}. Make it emotional, fast-paced, and scroll-stopping. Use trending sounds and quick cuts.`,
    hashtags: [
      ...platformHashtags[data.platform] || [],
      ...goalHashtags[data.goal] || [],
      ...nicheHashtags,
    ],
  };
};
