import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  issues: string[];
  hooks: string[];
  tips: string[];
  score: number;
}

const VideoAnalyzer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast({ title: "Enter a video link", description: "Paste your TikTok, YouTube, or Instagram video URL.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-video", {
        body: { videoUrl: videoUrl.trim() },
      });

      if (error) throw error;
      if (!data) throw new Error("No analysis returned");

      setAnalysis(data);
      toast({ title: "🔍 Analysis complete!", description: "Check out your personalized improvement suggestions." });
    } catch (e) {
      console.error("Analysis failed:", e);
      toast({ title: "Analysis failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-16 px-4" id="analyzer">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Search className="w-4 h-4 mr-2" />
            Video Analyzer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Isn't Your Video Going <span className="text-primary">Viral</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste your video link and our AI will analyze what's holding it back — plus give you scroll-stopping hooks to boost performance.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Paste your TikTok, YouTube, or Instagram video link..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="shadow-lg shadow-primary/20">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Video
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
            {/* Virality Score */}
            <Card className="md:col-span-3">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Virality Score</p>
                  <p className="text-4xl font-bold text-primary">{analysis.score}/10</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary opacity-50" />
              </CardContent>
            </Card>

            {/* Issues */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Better Hooks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Better Hooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.hooks.map((hook, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {hook}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoAnalyzer;
