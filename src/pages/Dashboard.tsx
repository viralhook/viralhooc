import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Bookmark,
  Settings,
  Zap,
  Crown,
  ArrowLeft,
  Trash2,
  Download,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import ContentCalendar from "@/components/ContentCalendar";
import TrendAnalysis from "@/components/TrendAnalysis";

interface SavedIdea {
  id: string;
  title: string;
  hook: string;
  platform: string;
  niche: string;
  created_at: string;
  storyline: string;
  ai_prompt: string;
  hashtags: string[];
}

const Dashboard = () => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState({
    referrals: true,
    credits: true,
    features: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setEmailNotifications({
        referrals: true,
        credits: true,
        features: true,
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("saved_ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setSavedIdeas(data);
    };
    fetchSavedIdeas();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        email_notifications_referrals: emailNotifications.referrals,
        email_notifications_credits: emailNotifications.credits,
        email_notifications_features: emailNotifications.features,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Failed to save",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile saved!",
        description: "Your changes have been saved.",
      });
      await refreshProfile();
    }
    setIsSaving(false);
  };

  const handleDeleteIdea = async (ideaId: string) => {
    const { error } = await supabase
      .from("saved_ideas")
      .delete()
      .eq("id", ideaId);

    if (error) {
      toast({
        title: "Failed to delete",
        variant: "destructive",
      });
    } else {
      setSavedIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
      toast({ title: "Idea deleted" });
    }
  };

  const handleExportIdeas = () => {
    const csv = savedIdeas
      .map(
        (idea) =>
          `"${idea.title}","${idea.hook}","${idea.platform}","${idea.niche}","${idea.storyline}","${idea.hashtags.join(" ")}"`
      )
      .join("\n");
    const header = "Title,Hook,Platform,Niche,Storyline,Hashtags\n";
    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "viralhook-ideas.csv";
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.display_name || "Creator"}!
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.credits_remaining ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Credits Left</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedIdeas.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Ideas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.referral_count ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {profile?.is_premium ? "Pro" : "Free"}
                  </p>
                  <p className="text-sm text-muted-foreground">Plan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ideas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="ideas" className="gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Saved Ideas</CardTitle>
                  <CardDescription>
                    Your collection of viral video ideas
                  </CardDescription>
                </div>
                {savedIdeas.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleExportIdeas}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {savedIdeas.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No saved ideas yet.</p>
                    <p className="text-sm">
                      Generate and save ideas to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{idea.platform}</Badge>
                              <Badge variant="outline">{idea.niche}</Badge>
                            </div>
                            <h3 className="font-semibold truncate">{idea.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {idea.hook}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(idea.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteIdea(idea.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <ContentCalendar savedIdeas={savedIdeas} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Track your content generation activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Ideas by Platform</h4>
                    {["TikTok", "Instagram", "YouTube", "Twitter"].map((platform) => {
                      const count = savedIdeas.filter(
                        (i) => i.platform === platform
                      ).length;
                      const percentage =
                        savedIdeas.length > 0
                          ? (count / savedIdeas.length) * 100
                          : 0;
                      return (
                        <div key={platform} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{platform}</span>
                            <span className="text-muted-foreground">{count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Top Niches</h4>
                    {Array.from(new Set(savedIdeas.map((i) => i.niche)))
                      .slice(0, 5)
                      .map((niche) => {
                        const count = savedIdeas.filter(
                          (i) => i.niche === niche
                        ).length;
                        return (
                          <div
                            key={niche}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded"
                          >
                            <span className="truncate">{niche}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        );
                      })}
                    {savedIdeas.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No data yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Email Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Referral Alerts</p>
                        <p className="text-xs text-muted-foreground">
                          Get notified when someone uses your referral code
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications.referrals}
                        onCheckedChange={(checked) =>
                          setEmailNotifications((prev) => ({
                            ...prev,
                            referrals: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Credit Updates</p>
                        <p className="text-xs text-muted-foreground">
                          Weekly summary of your credit usage
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications.credits}
                        onCheckedChange={(checked) =>
                          setEmailNotifications((prev) => ({
                            ...prev,
                            credits: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">New Features</p>
                        <p className="text-xs text-muted-foreground">
                          Be the first to know about new features
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications.features}
                        onCheckedChange={(checked) =>
                          setEmailNotifications((prev) => ({
                            ...prev,
                            features: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
