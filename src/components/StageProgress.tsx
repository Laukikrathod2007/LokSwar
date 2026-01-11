import { Check, Circle, Sparkles } from 'lucide-react';
import { EligibilityStage } from '@/types/eligibility';
import { cn } from '@/lib/utils';

interface StageProgressProps {
  currentStage: EligibilityStage;
}

const stages: { key: EligibilityStage; label: string; icon?: string }[] = [
  { key: "SCHEME_SELECTED", label: "Scheme" },
  { key: "PROFILE_VALIDATION", label: "Profile" },
  { key: "RULE_EVALUATION", label: "Evaluation" },
  { key: "AI_EXPLANATION", label: "AI Analysis", icon: "ai" },
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
    <div className="w-full glass-card rounded-2xl p-4 md:p-6 animate-fade-in">
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
                      "flex-1 h-0.5 transition-all duration-700",
                      isCompleted || isCurrent 
                        ? "bg-gradient-to-r from-primary to-accent" 
                        : "bg-muted"
                    )}
                  />
                )}
                
                {/* Stage dot */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0",
                    isCompleted && "bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-lg shadow-success/30",
                    isCurrent && "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground ring-4 ring-accent/20 shadow-lg shadow-accent/30",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : stage.icon === 'ai' && isCurrent ? (
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Circle className={cn("w-4 h-4", isCurrent && "fill-current")} />
                  )}
                </div>
                
                {/* Connector line after */}
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "flex-1 h-0.5 transition-all duration-700",
                      isCompleted 
                        ? "bg-gradient-to-r from-accent to-primary" 
                        : "bg-muted"
                    )}
                  />
                )}
              </div>
              
              <span 
                className={cn(
                  "text-xs font-semibold text-center transition-colors flex items-center gap-1",
                  isCurrent && "text-accent",
                  isPending && "text-muted-foreground",
                  isCompleted && "text-success"
                )}
              >
                {stage.icon === 'ai' && <Sparkles className="w-3 h-3" />}
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
