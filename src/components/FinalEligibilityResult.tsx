import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Share2,
  RotateCcw,
  ExternalLink
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
          "rounded-xl p-8 text-center",
          finalResult.isEligible ? "result-eligible" : "result-not-eligible"
        )}
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
          {finalResult.isEligible ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {finalResult.isEligible ? "You Are Eligible!" : "Eligibility Not Confirmed"}
        </h2>
        
        <p className="text-lg opacity-90 mb-4">
          {selectedScheme.name}
        </p>

        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
          <span className="text-sm">Eligibility Score:</span>
          <span className="text-xl font-bold">{finalResult.overallScore}%</span>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          AI Analysis Report
        </h3>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed">
            {finalResult.aiExplanation}
          </p>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          Generated on: {finalResult.generatedAt.toLocaleString()}
        </div>
      </div>

      {/* Criteria Results */}
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Criteria Breakdown</h3>
        
        <div className="space-y-3">
          {finalResult.ruleResults.map((result, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                result.passed ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              {result.passed ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              )}
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
        <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recommended Next Steps</h3>
          
          <ol className="space-y-3">
            {finalResult.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                  {idx + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Alternative Schemes */}
      {alternativeSchemeData && alternativeSchemeData.length > 0 && (
        <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Alternative Schemes to Consider</h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {alternativeSchemeData.map((scheme) => scheme && (
              <div 
                key={scheme.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
          className="flex-1 gap-2"
          onClick={() => window.open('https://india.gov.in', '_blank')}
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={reset}
        >
          <RotateCcw className="w-4 h-4" />
          Check Another
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
        <p>
          <strong>Disclaimer:</strong> This eligibility assessment is indicative and based on AI analysis. 
          Final eligibility will be determined by the concerned government department upon verification of documents.
        </p>
      </div>
    </div>
  );
}
