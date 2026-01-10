// Eligibility Stage State Machine
// STRICT: Results can ONLY be shown when stage === "FINAL_RESULT"
export type EligibilityStage = 
  | "IDLE"                  // No scheme selected
  | "SCHEME_SELECTED"       // Scheme selected, showing overview
  | "PROFILE_VALIDATION"    // Validating user profile
  | "RULE_EVALUATION"       // Evaluating eligibility rules
  | "AI_EXPLANATION"        // GenAI generating explanation
  | "FINAL_RESULT";         // Only here can results be shown

export interface Scheme {
  id: string;
  name: string;
  nameHindi?: string;
  category: SchemeCategory;
  description: string;
  ministry: string;
  benefits: string[];
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  applicationDeadline?: string;
  iconName: string;
}

export type SchemeCategory = 
  | "education"
  | "healthcare"
  | "agriculture"
  | "housing"
  | "employment"
  | "women_child"
  | "pension"
  | "financial";

export interface EligibilityCriterion {
  id: string;
  field: string;
  operator: "equals" | "lessThan" | "greaterThan" | "includes" | "between";
  value: string | number | boolean | [number, number];
  description: string;
}

export interface UserProfile {
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  annualIncome?: number;
  state?: string;
  category?: "general" | "obc" | "sc" | "st" | "ews";
  occupation?: string;
  isRural?: boolean;
  hasLand?: boolean;
  landHolding?: number; // in hectares
  familyMembers?: number;
  hasDisability?: boolean;
  isWidow?: boolean;
  isSeniorCitizen?: boolean;
  hasBPLCard?: boolean;
  education?: "none" | "primary" | "secondary" | "higher_secondary" | "graduate" | "postgraduate";
}

export interface RuleEvaluationResult {
  criterionId: string;
  passed: boolean;
  reason: string;
}

export interface EligibilityResult {
  schemeId: string;
  isEligible: boolean;
  overallScore: number; // 0-100
  ruleResults: RuleEvaluationResult[];
  aiExplanation: string;
  nextSteps?: string[];
  alternativeSchemes?: string[];
  generatedAt: Date;
}

export interface EligibilityState {
  stage: EligibilityStage;
  selectedScheme: Scheme | null;
  userProfile: UserProfile;
  ruleResults: RuleEvaluationResult[];
  finalResult: EligibilityResult | null;
  error: string | null;
  isLoading: boolean;
}
