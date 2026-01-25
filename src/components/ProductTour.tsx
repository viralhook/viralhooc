import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Zap, Save, Share2 } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to ViralHook! 🎉",
    description: "Let's take a quick tour to show you how to generate viral video ideas in seconds.",
    icon: Sparkles,
  },
  {
    id: "niche",
    title: "Choose Your Niche",
    description: "Select from popular niches like fitness, cooking, tech, or enter your own custom niche.",
    icon: Target,
    highlight: "niche-select",
  },
  {
    id: "platform",
    title: "Pick Your Platform",
    description: "Choose TikTok, YouTube Shorts, or Instagram Reels - each has optimized content strategies.",
    icon: Zap,
    highlight: "platform-select",
  },
  {
    id: "generate",
    title: "Generate Viral Ideas",
    description: "Click generate to get AI-powered hooks, storylines, hashtags, and filming tips instantly!",
    icon: Sparkles,
    highlight: "generate-btn",
  },
  {
    id: "save",
    title: "Save Your Favorites",
    description: "Love an idea? Save it to your collection to use later. Pro users get unlimited saves!",
    icon: Save,
  },
  {
    id: "share",
    title: "Share with Friends",
    description: "Invite friends and help them create viral content too! Ready to start?",
    icon: Share2,
  },
];

interface ProductTourProps {
  onComplete: () => void;
  isOpen: boolean;
}

const ProductTour = ({ onComplete, isOpen }: ProductTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("viralhook-tour-completed", "true");
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-primary/20">
        <CardContent className="pt-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {tourSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-primary w-6"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={isFirstStep ? "w-full" : "flex-1"}
            >
              {isLastStep ? "Get Started!" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>

          {isFirstStep && (
            <Button
              variant="link"
              onClick={handleSkip}
              className="w-full mt-2 text-muted-foreground"
            >
              Skip tour
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTour;
