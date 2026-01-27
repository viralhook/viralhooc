import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Check, Gift, Users, Zap, Share2 } from "lucide-react";

interface ReferralProgramProps {
  onClose?: () => void;
}

const ReferralProgram = ({ onClose }: ReferralProgramProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [referralInput, setReferralInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const referralCode = profile?.referral_code || "";
  const referralCount = profile?.referral_count || 0;
  const hasUsedReferral = !!profile?.referred_by;

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link copied! 🎉",
        description: "Share it with friends to earn credits.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const applyReferralCode = async () => {
    if (!referralInput.trim()) return;
    
    setIsApplying(true);
    try {
      const { data, error } = await supabase.functions.invoke("apply-referral", {
        body: { referralCode: referralInput.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Couldn't apply code",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "🎉 Referral applied!",
          description: "You earned 2 bonus credits!",
        });
        await refreshProfile();
        setReferralInput("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `🚀 I'm using ViralHook to generate viral video ideas with AI! Get 2 bonus credits when you sign up with my link:`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Sign up to get your unique referral code and earn free credits!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{referralCount}</p>
                <p className="text-sm text-muted-foreground">Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{referralCount * 3}</p>
                <p className="text-sm text-muted-foreground">Credits Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Referral Link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link and earn <Badge variant="secondary">+3 credits</Badge> for each friend who signs up!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={shareOnTwitter} variant="secondary" className="flex-1">
              Share on X
            </Button>
            <Button onClick={copyToClipboard} className="flex-1">
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enter Referral Code */}
      {!hasUsedReferral && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Have a Referral Code?
            </CardTitle>
            <CardDescription>
              Enter a friend's code to get <Badge variant="secondary">+2 bonus credits</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. ABC12345)"
                className="uppercase font-mono"
                maxLength={8}
              />
              <Button
                onClick={applyReferralCode}
                disabled={isApplying || !referralInput.trim()}
              >
                {isApplying ? "Applying..." : "Apply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Share your unique referral link with friends</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>They sign up and get +2 bonus credits</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>You earn +3 credits for each referral!</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgram;
