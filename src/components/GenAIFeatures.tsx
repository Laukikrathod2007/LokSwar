import { FileText, Languages, Mic, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenAIFeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
  gradient: string;
}

function GenAIFeatureCard({ icon: Icon, title, description, tag, gradient }: GenAIFeatureProps) {
  return (
    <div className="group glass-card rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
          gradient
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <span className="genai-badge text-xs py-1 px-2">
              <Sparkles className="w-3 h-3" />
              {tag}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

const features: GenAIFeatureProps[] = [
  {
    icon: FileText,
    title: "Policy Simplification",
    description: "Complex government documents converted to simple, citizen-friendly language while preserving legal accuracy.",
    tag: "AI Core",
    gradient: "bg-gradient-to-br from-blue-600 to-blue-800"
  },
  {
    icon: Languages,
    title: "Multilingual Reasoning",
    description: "Contextual translation to Hindi, Telugu, Tamil & more — maintaining policy accuracy across regional dialects.",
    tag: "Translation",
    gradient: "bg-gradient-to-br from-emerald-600 to-emerald-800"
  },
  {
    icon: Mic,
    title: "Voice Query Understanding",
    description: "Speak in your regional language — AI converts speech to structured eligibility parameters automatically.",
    tag: "Speech AI",
    gradient: "bg-gradient-to-br from-violet-600 to-violet-800"
  },
  {
    icon: Lightbulb,
    title: "Guided Assistance",
    description: "Personalized next steps and alternative scheme suggestions based on your unique eligibility profile.",
    tag: "Advisory",
    gradient: "bg-gradient-to-br from-amber-600 to-amber-800"
  }
];

export function GenAIFeatures() {
  return (
    <section className="py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 genai-badge mb-4">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-foreground font-medium">Powered by Advanced AI</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Intelligent Eligibility Assessment
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI transforms complex government policies into clear, actionable guidance — 
          in your language, at your convenience.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <GenAIFeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
