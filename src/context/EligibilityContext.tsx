import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  EligibilityStage, 
  EligibilityState, 
  Scheme, 
  UserProfile,
  RuleEvaluationResult,
  EligibilityResult 
} from '@/types/eligibility';

interface EligibilityContextType extends EligibilityState {
  // Stage transitions - STRICT order enforcement
  selectScheme: (scheme: Scheme) => void;
  startProfileValidation: () => void;
  completeProfileValidation: (profile: UserProfile) => void;
  startRuleEvaluation: () => void;
  completeRuleEvaluation: (results: RuleEvaluationResult[]) => void;
  startAIExplanation: () => void;
  completeAIExplanation: (result: EligibilityResult) => void;
  setError: (error: string) => void;
  reset: () => void;
  goBack: () => void;
}

const initialState: EligibilityState = {
  stage: "IDLE",
  selectedScheme: null,
  userProfile: {},
  ruleResults: [],
  finalResult: null,
  error: null,
  isLoading: false,
};

const EligibilityContext = createContext<EligibilityContextType | undefined>(undefined);

export function EligibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EligibilityState>(initialState);

  // STRICT: Scheme selection ONLY moves to SCHEME_SELECTED, never to result
  const selectScheme = useCallback((scheme: Scheme) => {
    setState(prev => ({
      ...prev,
      selectedScheme: scheme,
      stage: "SCHEME_SELECTED", // NOT FINAL_RESULT!
      error: null,
      finalResult: null, // Clear any previous result
      ruleResults: [],
    }));
  }, []);

  // Transition: SCHEME_SELECTED -> PROFILE_VALIDATION
  const startProfileValidation = useCallback(() => {
    setState(prev => {
      if (prev.stage !== "SCHEME_SELECTED") {
        console.error(`Invalid transition: Cannot start profile validation from ${prev.stage}`);
        return prev;
      }
      return {
        ...prev,
        stage: "PROFILE_VALIDATION",
        isLoading: false,
      };
    });
  }, []);

  // Complete profile validation and stay at PROFILE_VALIDATION
  const completeProfileValidation = useCallback((profile: UserProfile) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile },
    }));
  }, []);

  // Transition: PROFILE_VALIDATION -> RULE_EVALUATION
  const startRuleEvaluation = useCallback(() => {
    setState(prev => {
      if (prev.stage !== "PROFILE_VALIDATION") {
        console.error(`Invalid transition: Cannot start rule evaluation from ${prev.stage}`);
        return prev;
      }
      return {
        ...prev,
        stage: "RULE_EVALUATION",
        isLoading: true,
      };
    });
  }, []);

  // Complete rule evaluation
  const completeRuleEvaluation = useCallback((results: RuleEvaluationResult[]) => {
    setState(prev => ({
      ...prev,
      ruleResults: results,
      isLoading: false,
    }));
  }, []);

  // Transition: RULE_EVALUATION -> AI_EXPLANATION
  const startAIExplanation = useCallback(() => {
    setState(prev => {
      if (prev.stage !== "RULE_EVALUATION") {
        console.error(`Invalid transition: Cannot start AI explanation from ${prev.stage}`);
        return prev;
      }
      return {
        ...prev,
        stage: "AI_EXPLANATION",
        isLoading: true,
      };
    });
  }, []);

  // FINAL transition: AI_EXPLANATION -> FINAL_RESULT
  // This is the ONLY way to reach FINAL_RESULT
  const completeAIExplanation = useCallback((result: EligibilityResult) => {
    setState(prev => {
      if (prev.stage !== "AI_EXPLANATION") {
        console.error(`Invalid transition: Cannot complete AI explanation from ${prev.stage}`);
        return prev;
      }
      return {
        ...prev,
        stage: "FINAL_RESULT", // Only here!
        finalResult: result,
        isLoading: false,
      };
    });
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      switch (prev.stage) {
        case "SCHEME_SELECTED":
          return { ...initialState };
        case "PROFILE_VALIDATION":
          return { ...prev, stage: "SCHEME_SELECTED" };
        case "RULE_EVALUATION":
          return { ...prev, stage: "PROFILE_VALIDATION", isLoading: false };
        case "AI_EXPLANATION":
          return { ...prev, stage: "RULE_EVALUATION", isLoading: false };
        case "FINAL_RESULT":
          return { ...prev, stage: "AI_EXPLANATION", isLoading: false };
        default:
          return prev;
      }
    });
  }, []);

  return (
    <EligibilityContext.Provider
      value={{
        ...state,
        selectScheme,
        startProfileValidation,
        completeProfileValidation,
        startRuleEvaluation,
        completeRuleEvaluation,
        startAIExplanation,
        completeAIExplanation,
        setError,
        reset,
        goBack,
      }}
    >
      {children}
    </EligibilityContext.Provider>
  );
}

export function useEligibility() {
  const context = useContext(EligibilityContext);
  if (context === undefined) {
    throw new Error('useEligibility must be used within an EligibilityProvider');
  }
  return context;
}
