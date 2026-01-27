import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Zap, LogOut, User, Crown, Bookmark, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onGetStarted?: () => void;
  onShowSavedIdeas?: () => void;
  onShowReferrals?: () => void;
}

const Header = ({ onGetStarted, onShowSavedIdeas, onShowReferrals }: HeaderProps) => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">ViralHook</span>
          {profile?.is_premium && (
            <Crown className="w-4 h-4 text-accent" />
          )}
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
            Generator
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              {/* Credits display */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{profile?.credits_remaining ?? 3}</span>
                <span className="text-muted-foreground">credits</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name || "Creator"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShowSavedIdeas} className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    Saved Ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowReferrals} className="gap-2">
                    <Gift className="w-4 h-4" />
                    Referrals
                    {(profile?.referral_count ?? 0) > 0 && (
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {profile?.referral_count}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  {!profile?.is_premium && (
                    <DropdownMenuItem className="gap-2 text-primary">
                      <Crown className="w-4 h-4" />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button size="sm" onClick={onGetStarted}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
