import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Users } from "lucide-react";

interface ActivityEvent {
  id: string;
  user_display_name: string;
  action_type: string;
  platform: string | null;
  niche: string | null;
  created_at: string;
}

const SocialProofPopup = () => {
  const [currentEvent, setCurrentEvent] = useState<ActivityEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch recent activity on mount
    const fetchRecentActivity = async () => {
      const { data } = await supabase
        .from("activity_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        // Show random activity after a delay
        const showRandomActivity = () => {
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentEvent(data[randomIndex] as ActivityEvent);
          setIsVisible(true);

          // Hide after 5 seconds
          setTimeout(() => setIsVisible(false), 5000);
        };

        // Initial delay
        setTimeout(showRandomActivity, 8000);

        // Show activity periodically
        const interval = setInterval(() => {
          showRandomActivity();
        }, 30000);

        return () => clearInterval(interval);
      }
    };

    fetchRecentActivity();

    // Subscribe to real-time activity
    const channel = supabase
      .channel("activity_feed_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_feed",
        },
        (payload) => {
          const newEvent = payload.new as ActivityEvent;
          setCurrentEvent(newEvent);
          setIsVisible(true);
          setTimeout(() => setIsVisible(false), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!currentEvent || !isVisible) return null;

  const getActionText = () => {
    switch (currentEvent.action_type) {
      case "generated":
        return `just generated a viral idea${currentEvent.niche ? ` for ${currentEvent.niche}` : ""}`;
      case "saved":
        return `just saved an idea${currentEvent.platform ? ` for ${currentEvent.platform}` : ""}`;
      case "subscribed":
        return "just upgraded to Pro! 🎉";
      default:
        return "just joined ViralHook!";
    }
  };

  const getTimeAgo = () => {
    const seconds = Math.floor(
      (Date.now() - new Date(currentEvent.created_at).getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-sm transition-all duration-500 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {currentEvent.action_type === "subscribed" ? (
            <Sparkles className="w-5 h-5 text-primary" />
          ) : (
            <Users className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {currentEvent.user_display_name}
          </p>
          <p className="text-sm text-muted-foreground">{getActionText()}</p>
          <p className="text-xs text-muted-foreground mt-1">{getTimeAgo()}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SocialProofPopup;
