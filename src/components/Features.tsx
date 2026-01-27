import { Sparkles, Clock, Target, Lightbulb, Copy, Hash } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Scroll-Stopping Hooks",
    description: "AI-generated hooks designed to capture attention in the first 2 seconds.",
  },
  {
    icon: Clock,
    title: "30-Second Generation",
    description: "Get complete video blueprints in under 30 seconds. No waiting around.",
  },
  {
    icon: Target,
    title: "Goal-Optimized",
    description: "Tell us your goal - views, followers, or sales - and get tailored content.",
  },
  {
    icon: Lightbulb,
    title: "Never Run Out of Ideas",
    description: "Unlimited creative inspiration across any niche or platform.",
  },
  {
    icon: Copy,
    title: "Ready-to-Use Prompts",
    description: "Copy-paste AI prompts for tools like Runway, Pika, and more.",
  },
  {
    icon: Hash,
    title: "SEO Hashtags",
    description: "Optimized hashtags to boost discoverability and reach.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Go <span className="text-primary">Viral</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From hook to hashtag, we've got every element of your viral video covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
