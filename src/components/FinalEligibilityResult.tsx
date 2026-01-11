import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Share2,
  RotateCcw,
  ExternalLink,
  Sparkles,
  FileText,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEligibility } from '@/context/EligibilityContext';
import { schemes, schemeCategories } from '@/data/schemes';
import { cn } from '@/lib/utils';

export function FinalEligibilityResult() {
  const { finalResult, selectedScheme, userProfile, reset } = useEligibility();

  // CRITICAL: Only render if we have a final result
  if (!finalResult || !selectedScheme) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No Result Available</h2>
        <p className="text-muted-foreground mb-4">
          Please complete the eligibility assessment process.
        </p>
        <Button onClick={reset}>Start Over</Button>
      </div>
    );
  }

  const category = schemeCategories[selectedScheme.category];
  const alternativeSchemeData = finalResult.alternativeSchemes
    ?.map(id => schemes.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Result Header */}
      <div 
        className={cn(
          "rounded-2xl p-8 md:p-10 text-center relative overflow-hidden",
          finalResult.isEligible ? "result-eligible" : "result-not-eligible"
        )}
      >
        {/* Background Pattern */}
        {finalResult.isEligible && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-32 h-32 border border-white/30 rounded-full" />
            <div className="absolute bottom-4 right-4 w-48 h-48 border border-white/20 rounded-full" />
          </div>
        )}
        
        <div className="relative z-10">
          <div className={cn(
            "w-24 h-24 mx-auto mb-5 rounded-2xl flex items-center justify-center",
            finalResult.isEligible ? "bg-white/20" : "bg-destructive/20"
          )}>
            {finalResult.isEligible ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {finalResult.isEligible ? "You Are Eligible!" : "Eligibility Not Confirmed"}
          </h2>
          
          <p className="text-lg opacity-90 mb-5">
            {selectedScheme.name}
          </p>

          <div className={cn(
            "inline-flex items-center gap-3 rounded-full px-6 py-3",
            finalResult.isEligible ? "bg-white/20" : "bg-destructive/20"
          )}>
            <span className="text-sm font-medium">Eligibility Score:</span>
            <span className="text-2xl font-bold">{finalResult.overallScore}%</span>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          AI-Generated Explanation
          <span className="genai-badge text-xs py-0.5 px-2 ml-2">
            <Sparkles className="w-3 h-3" />
            Official
          </span>
        </h3>
        
        <div className="prose prose-sm max-w-none">
          <div className="p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {finalResult.aiExplanation}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground flex items-center justify-between">
          <span>Generated on: {finalResult.generatedAt.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-amber-600">
            <Sparkles className="w-3 h-3" />
            AI Simplified
          </span>
        </div>
      </div>

      {/* Criteria Results */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Criteria Breakdown
        </h3>
        
        <div className="space-y-3">
          {finalResult.ruleResults.map((result, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl",
                result.passed ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                result.passed ? "bg-success/20" : "bg-destructive/20"
              )}>
                {result.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  result.passed ? "text-success" : "text-destructive"
                )}>
                  {result.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      {finalResult.nextSteps && finalResult.nextSteps.length > 0 && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            Recommended Next Steps
            <span className="genai-badge text-xs py-0.5 px-2 ml-2">
              <Sparkles className="w-3 h-3" />
              AI Guidance
            </span>
          </h3>
          
          <ol className="space-y-3">
            {finalResult.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="text-foreground pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Alternative Schemes */}
      {alternativeSchemeData && alternativeSchemeData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Alternative Schemes to Consider
          </h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {alternativeSchemeData.map((scheme) => scheme && (
              <div 
                key={scheme.id}
                className="p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-foreground">{scheme.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {scheme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          size="lg" 
          className="flex-1 gap-2 h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
          onClick={() => window.open('https://india.gov.in', '_blank')}
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2 h-14 glass-card"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2 h-14 glass-card"
          onClick={reset}
        >
          <RotateCcw className="w-4 h-4" />
          Check Another
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="glass-card rounded-2xl p-5 text-center">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Official Disclaimer:</strong> This eligibility assessment is indicative and generated using AI analysis of government guidelines. 
          Final eligibility will be determined by the concerned government department upon verification of original documents.
        </p>
      </div>
    </div>
  );
}
