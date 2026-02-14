import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-PAYPAL-CHECKOUT] ${step}${detailsStr}`);
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secretKey = Deno.env.get("PAYPAL_SECRET_KEY");
  if (!clientId || !secretKey) throw new Error("PayPal credentials not configured");

  const baseUrl = "https://api-m.paypal.com";
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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planId, productType, price, productName } = await req.json();
    logStep("Request data", { planId, productType, price, productName });

    const accessToken = await getPayPalAccessToken();
    const baseUrl = "https://api-m.paypal.com";
    const origin = req.headers.get("origin") || "https://viralhooc.lovable.app";

    let approvalUrl: string;

    if (productType === "subscription" && planId) {
      // Create a PayPal subscription
      const subRes = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          subscriber: {
            email_address: user.email,
          },
          application_context: {
            brand_name: "ViralHook",
            return_url: `${origin}/?purchase=success&type=subscription`,
            cancel_url: `${origin}/?purchase=canceled`,
            user_action: "SUBSCRIBE_NOW",
          },
          custom_id: user.id,
        }),
      });

      if (!subRes.ok) {
        const err = await subRes.text();
        throw new Error(`PayPal subscription creation failed [${subRes.status}]: ${err}`);
      }

      const subData = await subRes.json();
      const approveLink = subData.links?.find((l: any) => l.rel === "approve");
      if (!approveLink) throw new Error("No approval URL returned from PayPal");
      approvalUrl = approveLink.href;
      logStep("Subscription created", { subscriptionId: subData.id });
    } else {
      // Create a one-time PayPal order
      const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: String(price),
              },
              description: productName || "ViralHook Purchase",
              custom_id: user.id,
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                brand_name: "ViralHook",
                return_url: `${origin}/?purchase=success&type=${productType}`,
                cancel_url: `${origin}/?purchase=canceled`,
                user_action: "PAY_NOW",
              },
            },
          },
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.text();
        throw new Error(`PayPal order creation failed [${orderRes.status}]: ${err}`);
      }

      const orderData = await orderRes.json();
      const approveLink = orderData.links?.find((l: any) => l.rel === "payer-action");
      if (!approveLink) throw new Error("No approval URL returned from PayPal");
      approvalUrl = approveLink.href;
      logStep("Order created", { orderId: orderData.id });
    }

    return new Response(JSON.stringify({ url: approvalUrl }), {
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
