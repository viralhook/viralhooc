import { useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GeneratorForm, { GeneratorData } from "@/components/GeneratorForm";
import ResultsDisplay, { GeneratedResult } from "@/components/ResultsDisplay";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { generateViralIdea } from "@/lib/mockGenerator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [lastFormData, setLastFormData] = useState<GeneratorData | null>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerate = async (data: GeneratorData) => {
    setIsLoading(true);
    setLastFormData(data);
    
    try {
      const generatedResult = await generateViralIdea(data);
      setResult(generatedResult);
      
      toast({
        title: "✨ Viral idea generated!",
        description: "Your video blueprint is ready. Start creating!",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleSave = () => {
    toast({
      title: "Sign up to save ideas",
      description: "Create a free account to save and organize your viral ideas.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onGetStarted={scrollToGenerator} />
      
      {!result ? (
        <>
          <Hero onGetStarted={scrollToGenerator} />
          <div ref={generatorRef}>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        </>
      ) : (
        <>
          <div className="pt-20" ref={generatorRef}>
            <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <ResultsDisplay
            result={result}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </>
      )}
      
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
