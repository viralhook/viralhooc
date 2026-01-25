import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Play, TrendingUp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import demoVideo from "@/assets/demo-video.mp4";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
    <section className="pt-24 pb-16 px-4 min-h-[90vh] flex items-center">
      <div className="container mx-auto text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Video Ideas in 30 Seconds
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Viral</span> Video Ideas
          <br />
          <span className="text-muted-foreground">That Actually Work</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Get scroll-stopping hooks, storylines, and hashtags for TikTok, YouTube Shorts & Reels. 
          Built for creators who want to grow fast.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
            Start Creating Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => setShowDemo(true)}>
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>10K+ Ideas Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span>500+ Active Creators</span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            <span>All Platforms Supported</span>
          </div>
        </div>
        
        {/* Platform badges */}
        <div className="mt-12 flex justify-center gap-4 flex-wrap">
          {["TikTok", "YouTube Shorts", "Instagram Reels"].map((platform) => (
            <div
              key={platform}
              className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm font-medium"
            >
              {platform}
            </div>
          ))}
        </div>
      </div>

      {/* Demo Video Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>See ViralHook in Action</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <video
              src={demoVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
              poster="/placeholder.svg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
    </>
  );
};

export default Hero;
