import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Scale, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEligibility } from '@/context/EligibilityContext';
import { RuleEvaluationResult } from '@/types/eligibility';
import { cn } from '@/lib/utils';

export function RuleEvaluationProgress() {
  const { 
    selectedScheme, 
    userProfile, 
    completeRuleEvaluation,
    startAIExplanation,
    ruleResults,
    goBack 
  } = useEligibility();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<RuleEvaluationResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(true);

  useEffect(() => {
    if (!selectedScheme) return;

    const criteria = selectedScheme.eligibilityCriteria;
    
    // Simulate rule-by-rule evaluation with delays
    const evaluateNextRule = (index: number) => {
      if (index >= criteria.length) {
        setIsEvaluating(false);
        completeRuleEvaluation(results);
        return;
      }

      const criterion = criteria[index];
      const profileValue = (userProfile as any)[criterion.field];
      
      // Evaluate the rule
      let passed = false;
      let reason = '';

      switch (criterion.operator) {
        case 'equals':
          passed = profileValue === criterion.value;
          reason = passed 
            ? `${criterion.description} - Verified`
            : `${criterion.description} - Not matching`;
          break;
        case 'lessThan':
          passed = profileValue !== undefined && profileValue < (criterion.value as number);
          reason = passed 
            ? `${criterion.description} - Within limit`
            : `${criterion.description} - Exceeds limit`;
          break;
        case 'greaterThan':
          passed = profileValue !== undefined && profileValue > (criterion.value as number);
          reason = passed 
            ? `${criterion.description} - Above minimum`
            : `${criterion.description} - Below minimum`;
          break;
        case 'includes':
          if (Array.isArray(criterion.value)) {
            passed = (criterion.value as unknown as string[]).includes(profileValue);
          } else {
            passed = profileValue === criterion.value;
          }
          reason = passed 
            ? `${criterion.description} - Eligible category`
            : `${criterion.description} - Category not eligible`;
          break;
        case 'between':
          const [min, max] = criterion.value as [number, number];
          passed = profileValue !== undefined && profileValue >= min && profileValue <= max;
          reason = passed 
            ? `${criterion.description} - Within range`
            : `${criterion.description} - Outside range`;
          break;
      }

      const result: RuleEvaluationResult = {
        criterionId: criterion.id,
        passed,
        reason
      };

      setTimeout(() => {
        setResults(prev => [...prev, result]);
        setCurrentIndex(index + 1);
        
        // Continue to next rule after a delay
        setTimeout(() => evaluateNextRule(index + 1), 800);
      }, 1200);
    };

    // Start evaluation
    evaluateNextRule(0);
  }, [selectedScheme]);

  if (!selectedScheme) return null;

  const allRulesPassed = results.length > 0 && results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Evaluating Eligibility Rules
            </h2>
            <p className="text-sm text-muted-foreground">
              Checking <span className="text-primary font-medium">{selectedScheme.name}</span> criteria
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">
              {currentIndex}/{selectedScheme.eligibilityCriteria.length} rules verified
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${(currentIndex / selectedScheme.eligibilityCriteria.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Rules list */}
        <div className="space-y-3">
          {selectedScheme.eligibilityCriteria.map((criterion, idx) => {
            const result = results.find(r => r.criterionId === criterion.id);
            const isCurrentlyEvaluating = idx === currentIndex && isEvaluating;
            const isPending = idx > currentIndex;

            return (
              <div
                key={criterion.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl transition-all duration-500",
                  result?.passed && "bg-success/10 border border-success/20",
                  result && !result.passed && "bg-destructive/10 border border-destructive/20",
                  isCurrentlyEvaluating && "bg-primary/10 border border-primary/20",
                  isPending && "bg-muted/30 opacity-50"
                )}
              >
                <div className="mt-0.5">
                  {result?.passed && (
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  )}
                  {result && !result.passed && (
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-destructive" />
                    </div>
                  )}
                  {isCurrentlyEvaluating && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                  )}
                  {isPending && (
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    result?.passed && "text-success",
                    result && !result.passed && "text-destructive",
                    isCurrentlyEvaluating && "text-primary",
                    isPending && "text-muted-foreground"
                  )}>
                    {criterion.description}
                  </p>
                  {result && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.reason}
                    </p>
                  )}
                  {isCurrentlyEvaluating && (
                    <p className="text-sm text-primary mt-1 animate-pulse">
                      Verifying against your profile...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue button - only shown when evaluation is complete */}
        {!isEvaluating && (
          <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
            <div className={cn(
              "p-5 rounded-xl text-center",
              allRulesPassed ? "bg-success/10 border border-success/20" : "bg-amber-500/10 border border-amber-500/20"
            )}>
              <p className={cn(
                "font-semibold text-lg",
                allRulesPassed ? "text-success" : "text-amber-600"
              )}>
                {allRulesPassed 
                  ? "✓ All eligibility criteria verified!" 
                  : `${passedCount} of ${results.length} criteria met`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Our AI will now generate a detailed explanation based on official guidelines.
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full gap-3 h-14 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
              onClick={startAIExplanation}
            >
              <Sparkles className="w-5 h-5" />
              Generate AI Explanation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
