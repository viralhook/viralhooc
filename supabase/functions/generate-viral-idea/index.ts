import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { niche, platform, goal, count = 1 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const platformName = platform === "youtube" ? "YouTube Shorts" : platform === "reels" ? "Instagram Reels" : "TikTok";
    const goalText = goal === "views" ? "maximize views and watch time" : goal === "followers" ? "grow followers and community" : "drive sales and conversions";

    const prompt = `Generate ${count} unique viral video idea(s) for ${platformName} in the "${niche}" niche. The goal is to ${goalText}.

For EACH idea, provide:
1. hook: A scroll-stopping opening line (first 2 seconds) that creates curiosity or shock
2. title: A catchy, SEO-optimized video title (under 60 chars)
3. storyline: A detailed step-by-step video storyline (3-5 sentences)
4. aiPrompt: A detailed AI video generation prompt for tools like Runway/Pika (2-3 sentences)
5. hashtags: 6-8 relevant trending hashtags for ${platformName}

Make each idea unique, creative, and designed to go viral. Use proven viral patterns like curiosity gaps, emotional triggers, and pattern interrupts.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a viral content strategist. Return ONLY valid JSON, no markdown. Return an array of idea objects.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_viral_ideas",
              description: "Return generated viral video ideas",
              parameters: {
                type: "object",
                properties: {
                  ideas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        hook: { type: "string", description: "Scroll-stopping opening line" },
                        title: { type: "string", description: "Catchy video title" },
                        storyline: { type: "string", description: "Step-by-step video storyline" },
                        aiPrompt: { type: "string", description: "AI video generation prompt" },
                        hashtags: { type: "array", items: { type: "string" }, description: "Trending hashtags" },
                      },
                      required: ["hook", "title", "storyline", "aiPrompt", "hashtags"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["ideas"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_viral_ideas" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call response from AI");
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ ideas: parsed.ideas }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
