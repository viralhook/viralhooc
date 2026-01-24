import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface HeaderProps {
  onGetStarted?: () => void;
}

const Header = ({ onGetStarted }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ViralHook</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
            Generator
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
