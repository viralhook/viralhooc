import { TrendingUp, Users, Video, Zap } from "lucide-react";

const stats = [
  {
    icon: Video,
    value: "50K+",
    label: "Ideas Generated",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Active Creators",
  },
  {
    icon: TrendingUp,
    value: "2.5M+",
    label: "Views Generated",
  },
  {
    icon: Zap,
    value: "<30s",
    label: "Generation Time",
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
