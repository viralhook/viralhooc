import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface CTAProps {
  onGetStarted: () => void;
}

const CTA = ({ onGetStarted }: CTAProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Start Creating Today</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Create Your First{" "}
            <span className="text-primary">Viral Video</span>?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join 10,000+ creators who are using ViralHook to generate scroll-stopping content. 
            Get your first 3 ideas free – no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="gap-2 text-lg px-8">
              Generate Your First Idea
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={onGetStarted}>
              See Examples
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            ✓ No credit card required &nbsp;&nbsp; ✓ 3 free generations &nbsp;&nbsp; ✓ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
