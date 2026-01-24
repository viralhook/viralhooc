import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface GeneratorFormProps {
  onGenerate: (data: GeneratorData) => void;
  isLoading: boolean;
}

export interface GeneratorData {
  niche: string;
  platform: string;
  goal: string;
}

const niches = [
  "Animals & Pets",
  "Motivation",
  "Gaming",
  "AI Stories",
  "Rescue Videos",
  "Cooking",
  "Fitness",
  "Travel",
  "Comedy",
  "Tech",
  "Fashion",
  "Finance",
];

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "youtube", name: "YouTube Shorts", icon: "▶️" },
  { id: "reels", name: "Instagram Reels", icon: "📸" },
];

const goals = [
  { id: "views", name: "Get More Views", icon: "👁️" },
  { id: "followers", name: "Grow Followers", icon: "👥" },
  { id: "sales", name: "Drive Sales", icon: "💰" },
];

const GeneratorForm = ({ onGenerate, isLoading }: GeneratorFormProps) => {
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = () => {
    const selectedNiche = niche === "custom" ? customNiche : niche;
    if (selectedNiche && platform && goal) {
      onGenerate({ niche: selectedNiche, platform, goal });
    }
  };

  const isValid = (niche || customNiche) && platform && goal;

  return (
    <section id="generator" className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Generate Your Viral Idea
            </CardTitle>
            <CardDescription className="text-base">
              Answer 3 quick questions and get your viral video blueprint
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-6">
            {/* Step 1: Niche */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  1
                </span>
                What's your niche?
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {niches.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      niche === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setNiche("custom")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    niche === "custom"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  Other...
                </button>
              </div>
              {niche === "custom" && (
                <Input
                  placeholder="Enter your niche..."
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Step 2: Platform */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  2
                </span>
                Choose your platform
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      platform === p.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{p.icon}</span>
                    <span className="font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Goal */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  3
                </span>
                What's your goal?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      goal === g.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{g.icon}</span>
                    <span className="font-semibold">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Generate Viral Idea
                </>
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              ✨ Free tier: 3 generations per day
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GeneratorForm;
