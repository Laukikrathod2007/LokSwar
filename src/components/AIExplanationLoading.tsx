import { useEffect, useState } from 'react';
import { Sparkles, Brain, FileText, CheckCircle, AlertTriangle, Languages, Lightbulb } from 'lucide-react';
import { useEligibility } from '@/context/EligibilityContext';
import { EligibilityResult } from '@/types/eligibility';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const loadingSteps = [
  { icon: Brain, text: "Analyzing official eligibility criteria...", color: "from-blue-600 to-blue-800" },
  { icon: FileText, text: "Simplifying government policy language...", color: "from-violet-600 to-violet-800" },
  { icon: Languages, text: "Preparing multilingual explanation...", color: "from-emerald-600 to-emerald-800" },
  { icon: Lightbulb, text: "Generating personalized guidance...", color: "from-amber-600 to-amber-800" },
  { icon: CheckCircle, text: "Finalizing official assessment report...", color: "from-green-600 to-green-800" },
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
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-3">
            AI Generation Failed
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {aiError}
          </p>
          
          <p className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/50">
            The eligibility assessment cannot be completed without AI analysis.
            Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
        {/* Animated AI icon */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-primary/20 animate-ping" />
          <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-amber-500/30 to-primary/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Generating Official Explanation
        </h2>
        <p className="text-muted-foreground mb-8">
          AI is analyzing government guidelines{dots}
        </p>

        {/* AI Capabilities Badge */}
        <div className="inline-flex items-center gap-2 genai-badge mb-8">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-foreground font-medium">Powered by Advanced AI</span>
        </div>

        {/* Loading steps */}
        <div className="space-y-3 text-left max-w-md mx-auto">
          {loadingSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const isPending = idx > currentStep;

            return (
              <div 
                key={idx}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-500",
                  isActive && "bg-primary/10 border border-primary/20",
                  isCompleted && "opacity-60",
                  isPending && "opacity-30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                  isActive && `bg-gradient-to-br ${step.color} text-white shadow-lg`,
                  isCompleted && "bg-success text-success-foreground",
                  isPending && "bg-muted"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-medium transition-colors text-sm",
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

        {/* GenAI Info note */}
        <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-primary/5 border border-amber-500/20">
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI simplifies complex government policy language into clear, 
            citizen-friendly explanations while maintaining legal accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}
