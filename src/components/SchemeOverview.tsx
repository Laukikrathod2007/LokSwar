import { ArrowLeft, ArrowRight, FileText, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEligibility } from '@/context/EligibilityContext';
import { schemeCategories } from '@/data/schemes';

export function SchemeOverview() {
  const { selectedScheme, startProfileValidation, reset } = useEligibility();

  if (!selectedScheme) return null;

  const category = schemeCategories[selectedScheme.category];
  const IconComponent = (LucideIcons as any)[selectedScheme.iconName] || LucideIcons.FileText;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={reset}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Schemes
      </Button>

      {/* Scheme header */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-5 mb-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${category.color}25, ${category.color}10)`,
              boxShadow: `0 8px 24px ${category.color}15`
            }}
          >
            <IconComponent 
              className="w-10 h-10" 
              style={{ color: category.color }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {selectedScheme.name}
              </h2>
            </div>
            {selectedScheme.nameHindi && (
              <p className="text-lg text-muted-foreground font-medium">
                {selectedScheme.nameHindi}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {selectedScheme.ministry}
              </span>
              <span className="genai-badge text-xs py-1 px-2">
                <Sparkles className="w-3 h-3" />
                AI Simplified
              </span>
            </div>
          </div>
        </div>

        {/* AI Simplified Description */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
            <Sparkles className="w-4 h-4" />
            AI-Simplified Policy Overview
          </div>
          <p className="text-foreground leading-relaxed">
            {selectedScheme.description}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Key Benefits
          </h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {selectedScheme.benefits.map((benefit, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/10"
              >
                <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </span>
                <span className="text-foreground text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Required Documents
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedScheme.requiredDocuments.map((doc, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 glass-card rounded-xl text-sm text-muted-foreground"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria Preview */}
        <div className="glass-card rounded-xl p-5 mb-6 bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Eligibility Assessment
            </h3>
            <span className="text-sm text-primary font-medium">
              {selectedScheme.eligibilityCriteria.length} criteria to verify
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI will evaluate your profile against official eligibility rules and provide 
            a detailed explanation in simple, easy-to-understand language.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="w-full gap-3 h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
          onClick={startProfileValidation}
        >
          Begin Eligibility Assessment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
