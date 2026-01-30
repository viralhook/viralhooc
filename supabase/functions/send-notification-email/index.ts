import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SEND-NOTIFICATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);

    const { type, email, displayName, data } = await req.json();
    logStep("Request data", { type, email });

    let subject = "";
    let html = "";

    switch (type) {
      case "referral":
        subject = "🎉 Someone used your referral code!";
        html = `
          <h1>Great news, ${displayName || "Creator"}!</h1>
          <p>Someone just signed up using your referral code. You've earned <strong>3 bonus credits</strong>!</p>
          <p>Keep sharing to earn more credits and help fellow creators go viral.</p>
          <p style="margin-top: 24px;">
            <a href="https://viralhooc.lovable.app" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Your Credits</a>
          </p>
          <p style="color: #666; margin-top: 24px;">Happy creating! 🚀</p>
        `;
        break;

      case "credits_low":
        subject = "⚡ Your ViralHook credits are running low";
        html = `
          <h1>Hey ${displayName || "Creator"}!</h1>
          <p>You have <strong>${data?.credits || 0} credits</strong> remaining.</p>
          <p>Don't let your viral momentum stop! Upgrade to Pro for unlimited generations or grab a credit pack.</p>
          <p style="margin-top: 24px;">
            <a href="https://viralhooc.lovable.app/#pricing" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Pricing</a>
          </p>
        `;
        break;

      case "new_feature":
        subject = "✨ New feature alert on ViralHook!";
        html = `
          <h1>Hey ${displayName || "Creator"}!</h1>
          <p>We've just launched something new that you'll love:</p>
          <h2>${data?.featureName || "New Feature"}</h2>
          <p>${data?.featureDescription || "Check it out in the app!"}</p>
          <p style="margin-top: 24px;">
            <a href="https://viralhooc.lovable.app" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Try It Now</a>
          </p>
        `;
        break;

      case "welcome":
        subject = "🎬 Welcome to ViralHook!";
        html = `
          <h1>Welcome to ViralHook, ${displayName || "Creator"}!</h1>
          <p>You've just taken the first step towards creating viral content that resonates with millions.</p>
          <p>Here's what you can do with ViralHook:</p>
          <ul>
            <li>Generate attention-grabbing hooks</li>
            <li>Create compelling storylines</li>
            <li>Get AI-powered content prompts</li>
            <li>Discover trending hashtags</li>
          </ul>
          <p style="margin-top: 24px;">
            <a href="https://viralhooc.lovable.app" style="background-color: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Start Creating</a>
          </p>
        `;
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "ViralHook <noreply@resend.dev>",
      to: [email],
      subject,
      html,
    });

    logStep("Email sent", { response: emailResponse });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
