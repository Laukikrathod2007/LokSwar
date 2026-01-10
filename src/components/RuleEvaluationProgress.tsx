import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Scale } from 'lucide-react';
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
  const someRulesFailed = results.some(r => !r.passed);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Evaluating Eligibility Rules
            </h2>
            <p className="text-sm text-muted-foreground">
              Checking {selectedScheme.name} criteria
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {currentIndex}/{selectedScheme.eligibilityCriteria.length} rules checked
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
                  "flex items-start gap-3 p-4 rounded-lg transition-all duration-300",
                  result?.passed && "bg-success/10 border border-success/20",
                  result && !result.passed && "bg-destructive/10 border border-destructive/20",
                  isCurrentlyEvaluating && "bg-primary/10 border border-primary/20",
                  isPending && "bg-muted/50 opacity-50"
                )}
              >
                <div className="mt-0.5">
                  {result?.passed && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  {result && !result.passed && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  {isCurrentlyEvaluating && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
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
                    <p className="text-sm text-primary mt-1">
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
          <div className="mt-6 pt-6 border-t space-y-4">
            <div className={cn(
              "p-4 rounded-lg text-center",
              allRulesPassed ? "bg-success/10" : "bg-warning/10"
            )}>
              <p className={cn(
                "font-medium",
                allRulesPassed ? "text-success" : "text-warning"
              )}>
                {allRulesPassed 
                  ? "✓ All eligibility criteria passed!" 
                  : `${results.filter(r => r.passed).length} of ${results.length} criteria met`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI will now generate a detailed explanation of your eligibility status.
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={startAIExplanation}
            >
              Generate AI Explanation
              <Loader2 className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
