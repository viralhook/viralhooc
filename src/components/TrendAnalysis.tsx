import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Hash, Flame, RefreshCw } from "lucide-react";

// Mock trending data - in production this would come from an API
const trendingTopics = {
  TikTok: [
    { topic: "AI Generated Content", growth: "+245%", hashtags: ["#AIart", "#AIgenerated"] },
    { topic: "Day in My Life", growth: "+180%", hashtags: ["#dayinmylife", "#vlog"] },
    { topic: "Get Ready With Me", growth: "+156%", hashtags: ["#grwm", "#makeup"] },
    { topic: "Productivity Tips", growth: "+134%", hashtags: ["#productivity", "#lifehacks"] },
    { topic: "Recipe Hacks", growth: "+98%", hashtags: ["#foodtok", "#recipe"] },
  ],
  Instagram: [
    { topic: "Behind The Scenes", growth: "+189%", hashtags: ["#bts", "#behindthescenes"] },
    { topic: "Minimalist Living", growth: "+167%", hashtags: ["#minimalist", "#simplifying"] },
    { topic: "Sustainable Fashion", growth: "+145%", hashtags: ["#sustainablefashion", "#ecofriendly"] },
    { topic: "Home Office Setup", growth: "+112%", hashtags: ["#homeoffice", "#wfh"] },
    { topic: "Travel Reels", growth: "+89%", hashtags: ["#travel", "#wanderlust"] },
  ],
  YouTube: [
    { topic: "Long-form Tutorials", growth: "+234%", hashtags: ["#tutorial", "#howto"] },
    { topic: "Commentary Videos", growth: "+198%", hashtags: ["#commentary", "#reaction"] },
    { topic: "Podcast Clips", growth: "+156%", hashtags: ["#podcast", "#interview"] },
    { topic: "Tech Reviews", growth: "+134%", hashtags: ["#tech", "#review"] },
    { topic: "Finance Education", growth: "+121%", hashtags: ["#finance", "#investing"] },
  ],
  Twitter: [
    { topic: "Thread Stories", growth: "+212%", hashtags: ["#thread", "#storytime"] },
    { topic: "Hot Takes", growth: "+189%", hashtags: ["#hottake", "#unpopularopinion"] },
    { topic: "Industry News", growth: "+145%", hashtags: ["#breakingnews", "#trending"] },
    { topic: "Memes", growth: "+134%", hashtags: ["#meme", "#funny"] },
    { topic: "Tips & Tricks", growth: "+98%", hashtags: ["#tips", "#lifehack"] },
  ],
};

const trendingHashtags = [
  { tag: "#fyp", uses: "2.4B" },
  { tag: "#viral", uses: "1.8B" },
  { tag: "#trending", uses: "1.2B" },
  { tag: "#explore", uses: "980M" },
  { tag: "#content", uses: "756M" },
  { tag: "#creator", uses: "654M" },
  { tag: "#lifestyle", uses: "543M" },
  { tag: "#motivation", uses: "487M" },
];

const TrendAnalysis = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof trendingTopics>("TikTok");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>
              Discover what's hot right now
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedPlatform}
              onValueChange={(value) => setSelectedPlatform(value as keyof typeof trendingTopics)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingTopics[selectedPlatform].map((topic, index) => (
              <div
                key={topic.topic}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{topic.topic}</p>
                    <div className="flex gap-1 mt-1">
                      {topic.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-primary border-primary/30"
                >
                  <Flame className="w-3 h-3 mr-1" />
                  {topic.growth}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Top Hashtags
          </CardTitle>
          <CardDescription>
            Most used hashtags across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((hashtag) => (
              <div
                key={hashtag.tag}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-full hover:bg-muted/80 cursor-pointer transition-colors"
              >
                <span className="font-medium">{hashtag.tag}</span>
                <span className="text-xs text-muted-foreground">{hashtag.uses}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
