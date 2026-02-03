import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sendNotificationEmail = async (
  type: string,
  email: string,
  displayName: string | null,
  data?: Record<string, unknown>
) => {
  try {
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ type, email, displayName, data }),
      }
    );
    const result = await response.json();
    console.log(`[APPLY-REFERRAL] Email notification sent:`, { type, result });
  } catch (error) {
    console.error(`[APPLY-REFERRAL] Failed to send email:`, error);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { referralCode } = await req.json();
    
    if (!referralCode) {
      return new Response(
        JSON.stringify({ error: "Referral code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for updates
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already has a referrer
    const { data: currentProfile } = await supabaseAdmin
      .from("profiles")
      .select("referred_by, display_name, credits_remaining")
      .eq("user_id", user.id)
      .single();

    if (currentProfile?.referred_by) {
      return new Response(
        JSON.stringify({ error: "You have already used a referral code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the referrer by code
    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from("profiles")
      .select("user_id, referral_count, credits_remaining, display_name, email_notifications_referrals")
      .eq("referral_code", referralCode.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Make sure user isn't referring themselves
    if (referrer.user_id === user.id) {
      return new Response(
        JSON.stringify({ error: "You cannot use your own referral code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate new credits for referred user
    const newReferredCredits = (currentProfile?.credits_remaining || 3) + 2;

    // Update referred user: set referred_by and add 2 bonus credits
    await supabaseAdmin
      .from("profiles")
      .update({ 
        referred_by: referralCode.toUpperCase(),
        credits_remaining: newReferredCredits
      })
      .eq("user_id", user.id);

    // Update referrer: increment count and add 3 bonus credits
    const newReferrerCredits = referrer.credits_remaining + 3;
    await supabaseAdmin
      .from("profiles")
      .update({
        referral_count: referrer.referral_count + 1,
        credits_remaining: newReferrerCredits,
      })
      .eq("user_id", referrer.user_id);

    // Send email notification to referrer if they have notifications enabled
    if (referrer.email_notifications_referrals !== false) {
      // Get referrer's email from auth
      const { data: referrerAuth } = await supabaseAdmin.auth.admin.getUserById(referrer.user_id);
      if (referrerAuth?.user?.email) {
        await sendNotificationEmail(
          "referral",
          referrerAuth.user.email,
          referrer.display_name
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Referral applied! You earned 2 bonus credits!" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Apply referral error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
