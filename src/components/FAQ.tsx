import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does ViralHook generate viral video ideas?",
    answer: "ViralHook uses advanced AI trained on millions of viral videos to understand what makes content go viral. It analyzes trends, engagement patterns, and platform algorithms to generate ideas optimized for your specific niche and goals.",
  },
  {
    question: "What platforms does ViralHook support?",
    answer: "ViralHook currently supports TikTok, YouTube Shorts, and Instagram Reels. Each platform has different algorithms and best practices, and our AI tailors recommendations accordingly.",
  },
  {
    question: "How many free generations do I get?",
    answer: "Free users get 3 video idea generations. This is perfect for trying out the platform and seeing the quality of our AI-generated content. Upgrade to Pro for unlimited generations.",
  },
  {
    question: "Can I use the AI prompts with any video generator?",
    answer: "Yes! Our AI prompts are designed to work with popular AI video tools like Runway, Pika, Kling, and more. Simply copy the prompt and paste it into your preferred tool.",
  },
  {
    question: "Is there a mobile app?",
    answer: "ViralHook is a web-first application that works great on mobile browsers. We're building native apps for iOS and Android that will be available soon!",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period with no hidden fees or penalties.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ViralHook
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
