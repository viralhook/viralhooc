import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import GeneratorForm, { GeneratorData } from "@/components/GeneratorForm";
import ResultsDisplay, { GeneratedResult } from "@/components/ResultsDisplay";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SavedIdeas from "@/components/SavedIdeas";
import ProductTour from "@/components/ProductTour";
import AIChatbot from "@/components/AIChatbot";
import ContactSection from "@/components/ContactSection";
import ReferralProgram from "@/components/ReferralProgram";
import SocialProofPopup from "@/components/SocialProofPopup";
import { generateViralIdea } from "@/lib/mockGenerator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [lastFormData, setLastFormData] = useState<GeneratorData | null>(null);
  const [showSavedIdeas, setShowSavedIdeas] = useState(false);
  const [showReferralProgram, setShowReferralProgram] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [pendingReferralCode, setPendingReferralCode] = useState<string | null>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for subscription success/cancel and referral code in URL params
  useEffect(() => {
    const subscription = searchParams.get("subscription");
    const refCode = searchParams.get("ref");
    
    if (refCode) {
      setPendingReferralCode(refCode);
      // Store in localStorage for after signup
      localStorage.setItem("viralhook-pending-referral", refCode);
      setSearchParams({});
    }
    
    if (subscription === "success") {
      toast({
        title: "🎉 Welcome to Pro!",
        description: "Your subscription is active. Enjoy unlimited generations!",
      });
      checkSubscription();
      setSearchParams({});
    } else if (subscription === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "No worries! You can upgrade anytime.",
      });
      setSearchParams({});
    }
  }, [searchParams]);

  // Apply pending referral after login
  useEffect(() => {
    const applyPendingReferral = async () => {
      const storedCode = localStorage.getItem("viralhook-pending-referral");
      if (user && storedCode && profile && !profile.referred_by) {
        try {
          const { data, error } = await supabase.functions.invoke("apply-referral", {
            body: { referralCode: storedCode },
          });
          if (!error && data?.success) {
            toast({
              title: "🎉 Referral bonus applied!",
              description: "You earned 2 bonus credits!",
            });
            await refreshProfile();
          }
        } catch (e) {
          console.error("Failed to apply referral:", e);
        } finally {
          localStorage.removeItem("viralhook-pending-referral");
        }
      }
    };
    applyPendingReferral();
  }, [user, profile]);

  // Check subscription status on load for logged-in users
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Show tour for new users
  useEffect(() => {
    const tourCompleted = localStorage.getItem("viralhook-tour-completed");
    if (!tourCompleted) {
      // Delay tour to let page load
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      await supabase.functions.invoke("check-subscription");
      await refreshProfile();
    } catch (error) {
      console.error("Check subscription error:", error);
    }
  };

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerate = async (data: GeneratorData) => {
    // Check credits for logged-in users
    if (user && profile && profile.credits_remaining <= 0 && !profile.is_premium) {
      toast({
        title: "No credits remaining",
        description: "Upgrade to Pro for unlimited generations!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLastFormData(data);
    
    try {
      const generatedResult = await generateViralIdea(data);
      setResult(generatedResult);
      
      // Deduct credit for logged-in users
      if (user && profile && !profile.is_premium) {
        await supabase
          .from("profiles")
          .update({ credits_remaining: profile.credits_remaining - 1 })
          .eq("user_id", user.id);
        await refreshProfile();
      }
      
      toast({
        title: "✨ Viral idea generated!",
        description: "Your video blueprint is ready. Start creating!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign up to save ideas",
        description: "Create a free account to save and organize your viral ideas.",
      });
      return;
    }

    if (!result || !lastFormData) return;

    const { error } = await supabase.from("saved_ideas").insert({
      user_id: user.id,
      niche: lastFormData.niche,
      platform: lastFormData.platform,
      goal: lastFormData.goal,
      hook: result.hook,
      title: result.title,
      storyline: result.storyline,
      ai_prompt: result.aiPrompt,
      hashtags: result.hashtags,
    });

    if (error) {
      toast({
        title: "Failed to save",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Idea saved! 🎉",
        description: "Find it in your saved ideas anytime.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onGetStarted={scrollToGenerator} 
        onShowSavedIdeas={() => setShowSavedIdeas(true)}
        onShowReferrals={() => setShowReferralProgram(true)}
      />
      
      {!result ? (
        <>
          <Hero onGetStarted={scrollToGenerator} />
          <Stats />
          <div ref={generatorRef}>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <Features />
          <Testimonials />
        </>
      ) : (
        <>
          <div className="pt-20" ref={generatorRef}>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <ResultsDisplay
            result={result}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </>
      )}
      
      <ContactSection />
      <Pricing />
      <FAQ />
      <CTA onGetStarted={scrollToGenerator} />
      <Footer />

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Social Proof Popup */}
      <SocialProofPopup />

      {/* Saved Ideas Dialog */}
      <Dialog open={showSavedIdeas} onOpenChange={setShowSavedIdeas}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Ideas</DialogTitle>
            <DialogDescription>
              Your collection of viral video ideas
            </DialogDescription>
          </DialogHeader>
          <SavedIdeas />
        </DialogContent>
      </Dialog>

      {/* Referral Program Dialog */}
      <Dialog open={showReferralProgram} onOpenChange={setShowReferralProgram}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Referral Program</DialogTitle>
            <DialogDescription>
              Share with friends and earn free credits
            </DialogDescription>
          </DialogHeader>
          <ReferralProgram onClose={() => setShowReferralProgram(false)} />
        </DialogContent>
      </Dialog>

      {/* Product Tour */}
      <ProductTour 
        isOpen={showTour} 
        onComplete={() => setShowTour(false)} 
      />
    </div>
  );
};

export default Index;
