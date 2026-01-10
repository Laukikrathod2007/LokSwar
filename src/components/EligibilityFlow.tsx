import { useEligibility } from '@/context/EligibilityContext';
import { SchemeList } from './SchemeList';
import { SchemeOverview } from './SchemeOverview';
import { ProfileValidation } from './ProfileValidation';
import { RuleEvaluationProgress } from './RuleEvaluationProgress';
import { AIExplanationLoading } from './AIExplanationLoading';
import { FinalEligibilityResult } from './FinalEligibilityResult';
import { StageProgress } from './StageProgress';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * CRITICAL: This component enforces strict stage-based rendering.
 * 
 * The flow is:
 * IDLE → SCHEME_SELECTED → PROFILE_VALIDATION → RULE_EVALUATION → AI_EXPLANATION → FINAL_RESULT
 * 
 * There are NO shortcuts. Results can ONLY be shown when stage === "FINAL_RESULT"
 */
export function EligibilityFlow() {
  const { stage, error, reset } = useEligibility();

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Something Went Wrong</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={reset}>Start Over</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator - shown for all stages except IDLE */}
      <StageProgress currentStage={stage} />

      {/* STRICT stage-based rendering - NO shortcuts to FINAL_RESULT */}
      
      {stage === "IDLE" && <SchemeList />}
      
      {stage === "SCHEME_SELECTED" && <SchemeOverview />}
      
      {stage === "PROFILE_VALIDATION" && <ProfileValidation />}
      
      {stage === "RULE_EVALUATION" && <RuleEvaluationProgress />}
      
      {stage === "AI_EXPLANATION" && <AIExplanationLoading />}
      
      {stage === "FINAL_RESULT" && <FinalEligibilityResult />}
    </div>
  );
}
