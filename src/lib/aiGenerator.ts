import { GeneratorData } from "@/components/GeneratorForm";
import { GeneratedResult } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";

export const generateWithAI = async (
  data: GeneratorData,
  count: number = 1
): Promise<GeneratedResult[]> => {
  const { data: result, error } = await supabase.functions.invoke("generate-viral-idea", {
    body: { niche: data.niche, platform: data.platform, goal: data.goal, count },
  });

  if (error) throw error;
  if (!result?.ideas?.length) throw new Error("No ideas generated");

  return result.ideas.map((idea: any) => ({
    hook: idea.hook,
    title: idea.title,
    storyline: idea.storyline,
    aiPrompt: idea.aiPrompt,
    hashtags: idea.hashtags,
  }));
};
