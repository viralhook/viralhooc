import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Bookmark, RefreshCw, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface GeneratedResult {
  hook: string;
  storyline: string;
  aiPrompt: string;
  title: string;
  hashtags: string[];
}

interface ResultsDisplayProps {
  results: GeneratedResult[];
  onRegenerate: () => void;
  onSave: (index: number) => void;
  isLoading: boolean;
  isAI?: boolean;
}

const ResultsDisplay = ({ results, onRegenerate, onSave, isLoading, isAI }: ResultsDisplayProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const result = results[currentIndex];
  if (!result) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(text, field)} className="h-8 px-2">
      {copiedField === field ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
    </Button>
  );

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Viral Blueprint
            {isAI && <Badge className="text-xs">AI-Powered</Badge>}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onSave(currentIndex)}>
              <Bookmark className="w-4 h-4 mr-2" />Save
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Regenerate
            </Button>
          </div>
        </div>

        {/* Batch navigation */}
        {results.length > 1 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {results.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    i === currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex((prev) => Math.min(results.length - 1, prev + 1))}
              disabled={currentIndex === results.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {/* Hook */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  🎣 Scroll-Stopping Hook
                  <Badge variant="secondary" className="text-xs">First 2 seconds</Badge>
                </CardTitle>
                <CopyButton text={result.hook} field="hook" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground leading-relaxed">"{result.hook}"</p>
            </CardContent>
          </Card>

          {/* Title */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">📝 Catchy Title</CardTitle>
                <CopyButton text={result.title} field="title" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{result.title}</p>
            </CardContent>
          </Card>

          {/* Storyline */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">📖 Video Storyline</CardTitle>
                <CopyButton text={result.storyline} field="storyline" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{result.storyline}</p>
            </CardContent>
          </Card>

          {/* AI Prompt */}
          <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  🤖 AI Video Prompt
                  <Badge className="text-xs">Ready to copy</Badge>
                </CardTitle>
                <CopyButton text={result.aiPrompt} field="aiPrompt" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">{result.aiPrompt}</div>
            </CardContent>
          </Card>

          {/* Hashtags */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">#️⃣ SEO Hashtags</CardTitle>
                <CopyButton text={result.hashtags.join(" ")} field="hashtags" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-3">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
