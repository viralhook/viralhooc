import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
      .select("referred_by")
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
      .select("user_id, referral_count, credits_remaining")
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

    // Update referred user: set referred_by and add 2 bonus credits
    await supabaseAdmin
      .from("profiles")
      .update({ 
        referred_by: referralCode.toUpperCase(),
        credits_remaining: currentProfile ? 5 : 5 // 3 default + 2 bonus
      })
      .eq("user_id", user.id);

    // Update referrer: increment count and add 3 bonus credits
    await supabaseAdmin
      .from("profiles")
      .update({
        referral_count: referrer.referral_count + 1,
        credits_remaining: referrer.credits_remaining + 3,
      })
      .eq("user_id", referrer.user_id);

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
