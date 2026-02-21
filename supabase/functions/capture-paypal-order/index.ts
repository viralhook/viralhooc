import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CAPTURE-PAYPAL-ORDER] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secretKey = Deno.env.get("PAYPAL_SECRET_KEY");
  if (!clientId || !secretKey) throw new Error("PayPal credentials not configured");

  const baseUrl = "https://api-m.sandbox.paypal.com";
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${clientId}:${secretKey}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed [${res.status}]: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { orderId } = await req.json();
    if (!orderId) throw new Error("No orderId provided");
    logStep("Capturing order", { orderId });

    const accessToken = await getPayPalAccessToken();
    const baseUrl = "https://api-m.sandbox.paypal.com";

    // Capture the order
    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!captureRes.ok) {
      const err = await captureRes.text();
      throw new Error(`PayPal capture failed [${captureRes.status}]: ${err}`);
    }

    const captureData = await captureRes.json();
    logStep("Capture response", { status: captureData.status });

    if (captureData.status !== "COMPLETED") {
      throw new Error(`Order not completed, status: ${captureData.status}`);
    }

    // Extract custom_id which contains "userId|productType"
    const purchaseUnit = captureData.purchase_units?.[0];
    const customId = purchaseUnit?.payments?.captures?.[0]?.custom_id || purchaseUnit?.custom_id || "";
    const [, productType] = customId.split("|");
    const amountPaid = parseFloat(purchaseUnit?.payments?.captures?.[0]?.amount?.value || "0");

    logStep("Payment captured", { productType, amountPaid, customId });

    // Update user profile based on product type
    if (productType === "subscription") {
      await supabaseClient
        .from("profiles")
        .update({ is_premium: true })
        .eq("user_id", user.id);
      logStep("User upgraded to premium");
    } else if (productType === "lifetime") {
      await supabaseClient
        .from("profiles")
        .update({ is_premium: true, lifetime_access: true })
        .eq("user_id", user.id);
      logStep("User granted lifetime access");
    } else if (productType === "credits") {
      // Determine credits from amount
      let creditsToAdd = 0;
      if (amountPaid <= 10) creditsToAdd = 10;
      else if (amountPaid <= 50) creditsToAdd = 50;
      else creditsToAdd = 100;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("credits_remaining")
        .eq("user_id", user.id)
        .single();

      const currentCredits = profile?.credits_remaining || 0;
      await supabaseClient
        .from("profiles")
        .update({ credits_remaining: currentCredits + creditsToAdd })
        .eq("user_id", user.id);

      // Record the purchase
      await supabaseClient.from("credit_purchases").insert({
        user_id: user.id,
        credits: creditsToAdd,
        amount_paid: Math.round(amountPaid * 100),
        stripe_session_id: orderId,
      });

      logStep("Credits added", { creditsToAdd, newTotal: currentCredits + creditsToAdd });
    }

    return new Response(JSON.stringify({ success: true, productType }), {
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
