import { useEffect, useState } from 'react';
import { Sparkles, Brain, FileText, CheckCircle } from 'lucide-react';
import { useEligibility } from '@/context/EligibilityContext';
import { EligibilityResult } from '@/types/eligibility';
import { cn } from '@/lib/utils';

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

  // Simulate AI generation (in real app, this would call an API)
  useEffect(() => {
    if (!selectedScheme) return;

    const generateExplanation = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 6000));

      try {
        // Calculate eligibility
        const passedRules = ruleResults.filter(r => r.passed).length;
        const totalRules = ruleResults.length;
        const isEligible = passedRules === totalRules;
        const overallScore = Math.round((passedRules / totalRules) * 100);

        // Generate explanation based on results
        const explanation = isEligible
          ? `Based on a comprehensive analysis of your profile against the eligibility criteria for ${selectedScheme.name}, you appear to meet all the required conditions. Your profile satisfies ${passedRules} out of ${totalRules} eligibility criteria, including the core requirements specified by the ${selectedScheme.ministry}. You are encouraged to proceed with the application process and gather the necessary documentation.`
          : `After careful evaluation of your profile against ${selectedScheme.name} eligibility requirements, we found that ${passedRules} out of ${totalRules} criteria are met. The unmet criteria may affect your eligibility. We recommend reviewing the specific requirements and considering alternative schemes that may better match your profile.`;

        const nextSteps = isEligible
          ? [
              "Gather all required documents mentioned above",
              "Visit the official scheme portal or nearest CSC center",
              "Submit your application with verified documents",
              "Track your application status online"
            ]
          : [
              "Review the unmet criteria carefully",
              "Check if any criteria can be met with updated documentation",
              "Consider alternative schemes listed below",
              "Visit local government office for personalized assistance"
            ];

        const result: EligibilityResult = {
          schemeId: selectedScheme.id,
          isEligible,
          overallScore,
          ruleResults,
          aiExplanation: explanation,
          nextSteps,
          alternativeSchemes: isEligible ? [] : ["pmay", "ayushman-bharat"],
          generatedAt: new Date(),
        };

        // CRITICAL: Only here do we transition to FINAL_RESULT
        completeAIExplanation(result);
      } catch (error) {
        setError("Failed to generate AI explanation. Please try again.");
      }
    };

    generateExplanation();
  }, [selectedScheme, ruleResults, completeAIExplanation, setError]);

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

        {/* Warning note */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            ⚠️ This analysis is AI-generated based on available government guidelines. 
            For official confirmation, please consult the relevant government department.
          </p>
        </div>
      </div>
    </div>
  );
}
