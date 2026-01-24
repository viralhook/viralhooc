import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, Copy, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedIdea {
  id: string;
  niche: string;
  platform: string;
  goal: string;
  hook: string;
  title: string;
  storyline: string;
  ai_prompt: string;
  hashtags: string[];
  created_at: string;
}

const SavedIdeas = () => {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    const { data, error } = await supabase
      .from("saved_ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setIdeas(data);
    }
    setIsLoading(false);
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase
      .from("saved_ideas")
      .delete()
      .eq("id", id);

    if (!error) {
      setIdeas(ideas.filter((idea) => idea.id !== id));
      toast({
        title: "Idea deleted",
        description: "The saved idea has been removed.",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied!`,
      description: "Ready to paste anywhere.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved ideas yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Generate your first viral video idea and save it to build your content library.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <Card key={idea.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-1">{idea.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{idea.platform}</Badge>
                  <Badge variant="outline">{idea.niche}</Badge>
                  <Badge variant="outline">{idea.goal}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteIdea(idea.id)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-1 shrink-0" />
              <p className="text-sm font-medium">{idea.hook}</p>
            </div>
            
            {expandedId === idea.id ? (
              <div className="space-y-4 pt-2 border-t">
                <div>
                  <h4 className="text-sm font-medium mb-1">Storyline</h4>
                  <p className="text-sm text-muted-foreground">{idea.storyline}</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">AI Prompt</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(idea.ai_prompt, "AI Prompt")}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {idea.ai_prompt}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium">Hashtags</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(idea.hashtags.join(" "), "Hashtags")}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {idea.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
              className="w-full"
            >
              {expandedId === idea.id ? "Show less" : "Show more"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedIdeas;
