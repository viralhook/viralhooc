import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOW_CREDITS_THRESHOLD = 2;

export const useLowCreditsNotification = () => {
  const { user, profile } = useAuth();
  const lastNotifiedCredits = useRef<number | null>(null);

  useEffect(() => {
    const checkAndNotifyLowCredits = async () => {
      if (!user || !profile) return;
      
      // Don't notify premium users
      if (profile.is_premium) return;
      
      // Only notify when credits drop to or below threshold
      // and we haven't already notified for this credit level
      if (
        profile.credits_remaining <= LOW_CREDITS_THRESHOLD &&
        (lastNotifiedCredits.current === null || 
         profile.credits_remaining < lastNotifiedCredits.current)
      ) {
        lastNotifiedCredits.current = profile.credits_remaining;
        
        try {
          await supabase.functions.invoke("send-notification-email", {
            body: {
              type: "credits_low",
              email: user.email,
              displayName: profile.display_name,
              data: { credits: profile.credits_remaining },
            },
          });
          console.log("Low credits notification sent");
        } catch (error) {
          console.error("Failed to send low credits notification:", error);
        }
      }
    };

    checkAndNotifyLowCredits();
  }, [user, profile?.credits_remaining, profile?.is_premium, profile?.display_name]);
};
