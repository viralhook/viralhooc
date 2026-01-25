import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Loader2, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading("pro");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast({
        title: "Could not open portal",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      await supabase.functions.invoke("check-subscription");
      await refreshProfile();
    } catch (error) {
      console.error("Check subscription error:", error);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out ViralHook",
      icon: Zap,
      features: [
        "3 generations per day",
        "All platforms supported",
        "Basic hooks & storylines",
        "Copy to clipboard",
        "Community support",
      ],
      buttonText: user ? "Current Plan" : "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false,
      isCurrent: user && !profile?.is_premium,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For serious content creators",
      icon: Crown,
      features: [
        "Unlimited generations",
        "Priority AI processing",
        "Advanced viral formulas",
        "Save & organize ideas",
        "Trending niche alerts",
        "Export to CSV",
        "Priority support",
      ],
      buttonText: profile?.is_premium ? "Manage Subscription" : "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true,
      isCurrent: profile?.is_premium,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Creator-Friendly Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start for free, upgrade when you're ready to go viral
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-105"
                  : "border-border"
              } ${plan.isCurrent ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              {plan.isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="px-4 py-1 bg-primary/20">Your Plan</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                {plan.name === "Pro" ? (
                  profile?.is_premium ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={handleManageSubscription}
                      disabled={isLoading === "manage"}
                    >
                      {isLoading === "manage" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Settings className="w-4 h-4 mr-2" />
                      )}
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isLoading === "pro"}
                    >
                      {isLoading === "pro" && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {plan.buttonText}
                    </Button>
                  )
                ) : (
                  <Button
                    variant={plan.buttonVariant}
                    size="lg"
                    className="w-full"
                    disabled={plan.isCurrent}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Cancel anytime. No questions asked.
        </p>

        {user && (
          <div className="text-center mt-4">
            <Button variant="ghost" size="sm" onClick={checkSubscription}>
              Refresh subscription status
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
