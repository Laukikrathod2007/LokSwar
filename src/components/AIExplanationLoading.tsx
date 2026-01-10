import { useEffect, useState } from 'react';
import { Sparkles, Brain, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEligibility } from '@/context/EligibilityContext';
import { EligibilityResult } from '@/types/eligibility';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const loadingSteps = [
  { icon: Brain, text: "Analyzing eligibility criteria..." },
  { icon: FileText, text: "Reviewing government guidelines..." },
  { icon: Sparkles, text: "Generating official explanation..." },
  { icon: CheckCircle, text: "Finalizing assessment report..." },
];

export function AIExplanationLoading() {
  const { 
    selectedScheme, 
    userProfile, 
    ruleResults,
    completeAIExplanation,
    setError 
  } = useEligibility();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progress through loading steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, loadingSteps.length - 1));
    }, 1500);
    return () => clearInterval(stepInterval);
  }, []);

  // Call AI edge function to generate explanation
  useEffect(() => {
    if (!selectedScheme) return;

    const generateExplanation = async () => {
      try {
        console.log("Calling AI edge function for eligibility explanation...");
        
        const { data, error: functionError } = await supabase.functions.invoke(
          'generate-eligibility-explanation',
          {
            body: {
              schemeName: selectedScheme.name,
              schemeDescription: selectedScheme.description,
              ministry: selectedScheme.ministry,
              benefits: selectedScheme.benefits,
              userProfile,
              ruleResults,
            }
          }
        );

        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(functionError.message || "Failed to generate explanation");
        }

        if (!data?.success) {
          // Handle specific error codes
          if (data?.code === 'RATE_LIMIT') {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please wait a moment and try again.",
              variant: "destructive",
            });
          } else if (data?.code === 'PAYMENT_REQUIRED') {
            toast({
              title: "Service Unavailable",
              description: "AI service is temporarily unavailable. Please try again later.",
              variant: "destructive",
            });
          }
          throw new Error(data?.error || "Failed to generate explanation");
        }

        console.log("AI explanation received:", data);

        const result: EligibilityResult = {
          schemeId: selectedScheme.id,
          isEligible: data.isEligible,
          overallScore: data.overallScore,
          ruleResults,
          aiExplanation: data.explanation,
          nextSteps: data.nextSteps,
          alternativeSchemes: data.isEligible ? [] : ["pmay", "ayushman-bharat"],
          generatedAt: new Date(data.generatedAt),
        };

        // CRITICAL: Only here do we transition to FINAL_RESULT
        completeAIExplanation(result);
        
      } catch (error) {
        console.error("Error generating AI explanation:", error);
        setAiError(error instanceof Error ? error.message : "Unknown error occurred");
        setError("Failed to generate AI explanation. Please try again.");
      }
    };

    generateExplanation();
  }, [selectedScheme, userProfile, ruleResults, completeAIExplanation, setError, toast]);

  // Show error state if AI failed
  if (aiError) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div className="bg-card rounded-xl p-8 md:p-12 shadow-sm border text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            AI Generation Failed
          </h2>
          <p className="text-muted-foreground mb-6">
            {aiError}
          </p>
          
          <p className="text-sm text-muted-foreground">
            The eligibility assessment cannot be completed without AI analysis.
            Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="bg-card rounded-xl p-8 md:p-12 shadow-sm border text-center">
        {/* Animated AI icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Generating Official Explanation
        </h2>
        <p className="text-muted-foreground mb-8">
          Based on government rules and guidelines{dots}
        </p>

        {/* Loading steps */}
        <div className="space-y-4 text-left max-w-md mx-auto">
          {loadingSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const isPending = idx > currentStep;

            return (
              <div 
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-500",
                  isActive && "bg-primary/10",
                  isCompleted && "opacity-60",
                  isPending && "opacity-30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-success text-success-foreground",
                  isPending && "bg-muted"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "font-medium transition-colors",
                  isActive && "text-primary",
                  isCompleted && "text-success",
                  isPending && "text-muted-foreground"
                )}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            🤖 Using AI to analyze your eligibility based on official government guidelines. 
            This may take a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
