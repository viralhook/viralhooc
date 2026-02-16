import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Copy, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  niche: string;
  platform: string;
  hook: string;
  storyline: string;
  hashtags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const templates: Template[] = [
  {
    id: "1",
    name: "The Transformation Reveal",
    niche: "Fitness",
    platform: "tiktok",
    hook: "Day 1 vs Day 90. Nobody believed the results...",
    storyline: "Start with a 'before' clip. Quick montage of the journey with trending audio. Dramatic reveal with slow-mo. End with a motivational CTA asking viewers to start their journey.",
    hashtags: ["#transformation", "#fitness", "#beforeandafter", "#fyp", "#motivation", "#glow up"],
    difficulty: "beginner",
  },
  {
    id: "2",
    name: "The Secret Exposed",
    niche: "Tech",
    platform: "youtube",
    hook: "Your phone has a hidden feature that changes everything...",
    storyline: "Open with shock value statement. Demonstrate the hidden feature step-by-step. Show the 'wow' moment when it works. Ask viewers what features they want to see next.",
    hashtags: ["#shorts", "#tech", "#hiddenfeature", "#iphone", "#android", "#techtips"],
    difficulty: "beginner",
  },
  {
    id: "3",
    name: "The Emotional Story Arc",
    niche: "Animals & Pets",
    platform: "reels",
    hook: "We found this kitten in a dumpster. Wait until you see her now...",
    storyline: "Sad opening with rescue footage. Middle section showing recovery and care. Heartwarming transformation reveal. Close with adoption message and happy ending.",
    hashtags: ["#rescue", "#kitten", "#transformation", "#animalrescue", "#heartwarming", "#reels"],
    difficulty: "intermediate",
  },
  {
    id: "4",
    name: "The Controversial Take",
    niche: "Finance",
    platform: "tiktok",
    hook: "Stop saving money. Here's what rich people actually do...",
    storyline: "Open with a bold, controversial statement. Back it up with 3 rapid facts. Provide an actionable alternative strategy. End with 'Follow for more' CTA.",
    hashtags: ["#money", "#finance", "#investing", "#richmindset", "#fyp", "#financetips"],
    difficulty: "intermediate",
  },
  {
    id: "5",
    name: "The Recipe Hack",
    niche: "Cooking",
    platform: "reels",
    hook: "5-star restaurant meal for $3. The chef was SHOCKED...",
    storyline: "Show cheap ingredients with price tags. Speed-up cooking process with ASMR sounds. Dramatic plating reveal. Taste test reaction with comparison to restaurant version.",
    hashtags: ["#cooking", "#foodhack", "#cheapmeals", "#recipe", "#foodtiktok", "#budgetmeals"],
    difficulty: "beginner",
  },
  {
    id: "6",
    name: "The POV Story",
    niche: "Comedy",
    platform: "tiktok",
    hook: "POV: You're the only one who noticed the glitch in the matrix...",
    storyline: "First-person camera angle throughout. Build tension with subtle oddities. Escalate to absurd/comedic climax. Punchline ending with replay value.",
    hashtags: ["#pov", "#comedy", "#fyp", "#funny", "#glitchinthematrix", "#relatable"],
    difficulty: "advanced",
  },
  {
    id: "7",
    name: "The AI Art Showcase",
    niche: "AI Stories",
    platform: "youtube",
    hook: "I asked AI to show what humans look like in 1000 years...",
    storyline: "Set up the concept with text overlay. Show AI generation process. Reveal results one by one with dramatic music. End with thought-provoking question.",
    hashtags: ["#ai", "#aiart", "#future", "#shorts", "#technology", "#mindblowing"],
    difficulty: "beginner",
  },
  {
    id: "8",
    name: "The Travel Cinematic",
    niche: "Travel",
    platform: "reels",
    hook: "I found a place that looks like another planet. And it's free to visit...",
    storyline: "Drone shot opener of stunning location. Quick cuts of activities and experiences. Include a 'how to get there' segment. Close with sunset shot and location tag.",
    hashtags: ["#travel", "#hiddengeom", "#bucketlist", "#reels", "#wanderlust", "#travelgram"],
    difficulty: "advanced",
  },
];

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const TemplateLibrary = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isPro = profile?.is_premium;

  const copyTemplate = (template: Template) => {
    const text = `Hook: ${template.hook}\n\nStoryline: ${template.storyline}\n\nHashtags: ${template.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Pro Feature
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Viral Template Library
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proven viral video blueprints you can use instantly. New templates added weekly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card
              key={template.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                !isPro && index > 2 ? "opacity-60" : ""
              }`}
            >
              {!isPro && index > 2 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Pro Only</p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const el = document.getElementById("pricing");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {template.platform === "tiktok" ? "🎵 TikTok" : template.platform === "youtube" ? "▶️ YouTube" : "📸 Reels"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{template.niche}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[template.difficulty]}`}>
                    {template.difficulty}
                  </span>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hook</p>
                  <p className="text-sm font-medium">"{template.hook}"</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Storyline</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{template.storyline}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.hashtags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                  {template.hashtags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">+{template.hashtags.length - 4}</Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => copyTemplate(template)}
                  disabled={!isPro && index > 2}
                >
                  {copiedId === template.id ? (
                    <><Check className="w-3 h-3 mr-1" /> Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3 mr-1" /> Copy Template</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateLibrary;
