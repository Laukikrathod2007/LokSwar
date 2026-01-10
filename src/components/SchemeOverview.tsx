import { ArrowLeft, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <IconComponent 
              className="w-8 h-8" 
              style={{ color: category.color }}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {selectedScheme.name}
            </h2>
            {selectedScheme.nameHindi && (
              <p className="text-lg text-muted-foreground">
                {selectedScheme.nameHindi}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {selectedScheme.ministry}
            </p>
          </div>
        </div>

        <p className="text-foreground mb-6">
          {selectedScheme.description}
        </p>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Key Benefits
          </h3>
          <ul className="space-y-2">
            {selectedScheme.benefits.map((benefit, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Required Documents
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedScheme.requiredDocuments.map((doc, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria Preview */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-2">
            Eligibility Criteria Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            This scheme has {selectedScheme.eligibilityCriteria.length} eligibility requirements. 
            Click below to start the assessment process.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="w-full gap-2"
          onClick={startProfileValidation}
        >
          Begin Eligibility Assessment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
