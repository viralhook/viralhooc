import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Bookmark, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

export interface GeneratedResult {
  hook: string;
  storyline: string;
  aiPrompt: string;
  title: string;
  hashtags: string[];
}

interface ResultsDisplayProps {
  result: GeneratedResult;
  onRegenerate: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const ResultsDisplay = ({ result, onRegenerate, onSave, isLoading }: ResultsDisplayProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => copyToClipboard(text, field)}
      className="h-8 px-2"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Viral Blueprint
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onSave}>
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          </div>
        </div>

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
              <p className="text-xl font-semibold text-foreground leading-relaxed">
                "{result.hook}"
              </p>
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
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                {result.aiPrompt}
              </div>
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
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                    {tag}
                  </Badge>
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
