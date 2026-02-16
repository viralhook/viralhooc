import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Zap, Crown, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PAYPAL_PRODUCTS } from "@/lib/paypal-products";

const Pricing = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (productKey: string, productType: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading(productKey);
    try {
      const product = PAYPAL_PRODUCTS[productKey as keyof typeof PAYPAL_PRODUCTS];
      const body: Record<string, unknown> = {
        productType,
        price: product.price,
        productName: product.name,
      };
      if ("plan_id" in product) {
        body.planId = product.plan_id;
      }

      const { data, error } = await supabase.functions.invoke("create-paypal-checkout", { body });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const creditPacks = [
    { key: "credits_10", label: "10 Credits", desc: "Best for trying out", popular: false, price: PAYPAL_PRODUCTS.credits_10.price },
    { key: "credits_50", label: "50 Credits", desc: "Most popular", popular: true, price: PAYPAL_PRODUCTS.credits_50.price },
    { key: "credits_100", label: "100 Credits", desc: "Best value", popular: false, price: PAYPAL_PRODUCTS.credits_100.price },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Creator-Friendly Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Start for free, upgrade when you're ready to go viral</p>
        </div>

        <Tabs defaultValue="subscription" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="credits">Credit Packs</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Free */}
              <Card className={profile && !profile.is_premium ? "ring-2 ring-primary" : ""}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Try it out</CardDescription>
                  <div className="pt-4"><span className="text-4xl font-bold">$0</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {["3 credits", "All platforms", "Basic hooks", "Limited templates"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />{f}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled={!!user}>
                    {user ? "Current Plan" : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Monthly */}
              <Card className="border-primary shadow-xl scale-105 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="px-4">Popular</Badge></div>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Pro Monthly</CardTitle>
                  <CardDescription>Unlimited power</CardDescription>
                  <div className="pt-4"><span className="text-4xl font-bold">${PAYPAL_PRODUCTS.pro_monthly.price}</span><span className="text-muted-foreground">/mo</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {["Unlimited generations", "AI-powered ideas", "Batch generation (5x)", "Template library", "Save ideas & export CSV", "Priority support"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />{f}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleCheckout("pro_monthly", "subscription")} disabled={isLoading === "pro_monthly"}>
                    {isLoading === "pro_monthly" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {profile?.is_premium ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Annual */}
              <Card className="relative">
                <div className="absolute -top-3 right-4"><Badge variant="secondary">Save 20%</Badge></div>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Pro Annual</CardTitle>
                  <CardDescription>Best value</CardDescription>
                  <div className="pt-4"><span className="text-4xl font-bold">${PAYPAL_PRODUCTS.pro_annual.price}</span><span className="text-muted-foreground">/yr</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {["Everything in Pro", "AI + batch generation", "2 months free", "Template library", "Priority support"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />{f}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleCheckout("pro_annual", "subscription")} disabled={isLoading === "pro_annual"}>
                    {isLoading === "pro_annual" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Get Annual
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="credits" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {creditPacks.map((pack) => (
                <Card key={pack.key} className={pack.popular ? "border-primary shadow-lg" : ""}>
                  {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge>Best Value</Badge></div>}
                  <CardHeader className="text-center">
                    <CardTitle>{pack.label}</CardTitle>
                    <CardDescription>{pack.desc}</CardDescription>
                    <div className="pt-4"><span className="text-4xl font-bold">${pack.price}</span></div>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" variant={pack.popular ? "default" : "outline"} onClick={() => handleCheckout(pack.key, "credits")} disabled={isLoading === pack.key}>
                      {isLoading === pack.key && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Buy Credits
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lifetime" className="mt-8">
            <Card className="max-w-md mx-auto border-primary shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Lifetime Access</CardTitle>
                <CardDescription>One payment, unlimited forever</CardDescription>
                <div className="pt-4"><span className="text-5xl font-bold">${PAYPAL_PRODUCTS.lifetime.price}</span><span className="text-muted-foreground"> one-time</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {["Unlimited AI-powered generations", "Batch generation (5x)", "Full template library", "All future features", "Priority support", "No recurring fees"].map((f) => (
                    <li key={f} className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" />{f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" onClick={() => handleCheckout("lifetime", "lifetime")} disabled={isLoading === "lifetime"}>
                  {isLoading === "lifetime" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Get Lifetime Access
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">Cancel anytime. No questions asked.</p>
      </div>
    </section>
  );
};

export default Pricing;
