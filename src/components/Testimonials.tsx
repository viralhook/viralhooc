import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "TikTok Creator",
    followers: "500K followers",
    content: "ViralHook completely changed my content game. I went from struggling to find ideas to posting consistently viral content. My engagement tripled in just 2 weeks!",
    rating: 5,
    initials: "AC",
  },
  {
    name: "Sarah Martinez",
    role: "YouTube Shorts Creator",
    followers: "250K subscribers",
    content: "The AI prompts are incredible. I use them with my video editing tools and the results speak for themselves. 3 of my videos hit 1M+ views last month!",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Jordan Taylor",
    role: "Instagram Reels Creator",
    followers: "100K followers",
    content: "As a faceless channel owner, finding consistent ideas was my biggest challenge. ViralHook solved that completely. Best investment for my content business.",
    rating: 5,
    initials: "JT",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-primary">10,000+</span> Creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what content creators are saying about ViralHook
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.followers}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
