import { Check, Circle } from 'lucide-react';
import { EligibilityStage } from '@/types/eligibility';
import { cn } from '@/lib/utils';

interface StageProgressProps {
  currentStage: EligibilityStage;
}

const stages: { key: EligibilityStage; label: string }[] = [
  { key: "SCHEME_SELECTED", label: "Scheme" },
  { key: "PROFILE_VALIDATION", label: "Profile" },
  { key: "RULE_EVALUATION", label: "Evaluation" },
  { key: "AI_EXPLANATION", label: "Analysis" },
  { key: "FINAL_RESULT", label: "Result" },
];

const stageOrder: Record<EligibilityStage, number> = {
  "IDLE": 0,
  "SCHEME_SELECTED": 1,
  "PROFILE_VALIDATION": 2,
  "RULE_EVALUATION": 3,
  "AI_EXPLANATION": 4,
  "FINAL_RESULT": 5,
};

export function StageProgress({ currentStage }: StageProgressProps) {
  if (currentStage === "IDLE") return null;

  const currentIndex = stageOrder[currentStage];

  return (
    <div className="w-full bg-card rounded-xl p-4 md:p-6 shadow-sm border animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, index) => {
          const stageIndex = stageOrder[stage.key];
          const isCompleted = currentIndex > stageIndex;
          const isCurrent = currentIndex === stageIndex;
          const isPending = currentIndex < stageIndex;

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center w-full">
                {/* Connector line before */}
                {index > 0 && (
                  <div 
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-500",
                      isCompleted || isCurrent ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
                
                {/* Stage dot */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Circle className={cn("w-3 h-3", isCurrent && "fill-current")} />
                  )}
                </div>
                
                {/* Connector line after */}
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-500",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
              
              <span 
                className={cn(
                  "text-xs font-medium text-center transition-colors",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground",
                  isCompleted && "text-success"
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
