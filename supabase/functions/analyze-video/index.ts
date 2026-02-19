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
    const { videoUrl } = await req.json();

    if (!videoUrl || typeof videoUrl !== "string") {
      return new Response(
        JSON.stringify({ error: "A valid video URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
            content: `You are a viral video expert analyst. Given a video URL, analyze why it might not be going viral and provide actionable feedback.

You must respond with a JSON object using the tool call provided. Base your analysis on the URL context (platform, potential niche from the URL slug/path) and general viral video best practices.

Provide:
- issues: 3-4 specific reasons the video likely isn't performing well
- hooks: 3-4 scroll-stopping hook alternatives that would make the video more engaging
- tips: 3-4 actionable pro tips to improve virality
- score: a virality score from 1-10 based on likely performance

Be specific, creative, and actionable. Reference the platform (TikTok, YouTube, Instagram) when relevant.`,
          },
          {
            role: "user",
            content: `Analyze this video and tell me why it's not going viral: ${videoUrl}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide the video analysis results",
              parameters: {
                type: "object",
                properties: {
                  issues: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 reasons the video isn't going viral",
                  },
                  hooks: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 better scroll-stopping hooks",
                  },
                  tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-4 actionable pro tips",
                  },
                  score: {
                    type: "number",
                    description: "Virality score from 1 to 10",
                  },
                },
                required: ["issues", "hooks", "tips", "score"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis generated");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analyze video error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
