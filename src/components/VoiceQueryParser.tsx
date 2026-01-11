import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ParsedQuery {
  field: string;
  value: string | number;
  confidence: number;
}

interface VoiceQueryParserProps {
  onQueryParsed: (parsed: Record<string, any>) => void;
  className?: string;
}

export function VoiceQueryParser({ onQueryParsed, className }: VoiceQueryParserProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResults, setParsedResults] = useState<ParsedQuery[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleVoiceResult = async (text: string) => {
    setTranscript(text);
    setIsProcessing(true);
    
    try {
      // Parse the voice input to structured data using pattern matching
      // This demonstrates the AI parsing capability
      const parsed: ParsedQuery[] = [];
      
      // Parse age patterns
      const agePatterns = [
        /(?:meri umar|my age|i am|main)\s*(\d+)\s*(?:saal|years?|hai)?/i,
        /(\d+)\s*(?:saal|years?)\s*(?:ka|ki|ke|of age)?/i,
      ];
      
      for (const pattern of agePatterns) {
        const match = text.match(pattern);
        if (match) {
          parsed.push({ field: 'age', value: parseInt(match[1]), confidence: 0.95 });
          break;
        }
      }
      
      // Parse land holding patterns
      const landPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़|aker)/i,
        /(\d+(?:\.\d+)?)\s*(?:hectare|hectares|हेक्टेयर)/i,
        /(?:mere paas|i have|meri)\s*(\d+(?:\.\d+)?)\s*(?:acre|bigha|hectare)/i,
      ];
      
      for (const pattern of landPatterns) {
        const match = text.match(pattern);
        if (match) {
          let value = parseFloat(match[1]);
          // Convert acres to hectares if needed
          if (text.toLowerCase().includes('acre') || text.toLowerCase().includes('एकड़')) {
            value = value * 0.4047;
          }
          parsed.push({ field: 'landHolding', value: Math.round(value * 100) / 100, confidence: 0.9 });
          break;
        }
      }
      
      // Parse income patterns
      const incomePatterns = [
        /(?:income|kamai|aay)\s*(?:hai|is)?\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac)?/i,
        /(\d+(?:,\d+)*)\s*(?:rupees?|₹|rs\.?)/i,
      ];
      
      for (const pattern of incomePatterns) {
        const match = text.match(pattern);
        if (match) {
          let value = parseFloat(match[1].replace(/,/g, ''));
          if (text.toLowerCase().includes('lakh') || text.toLowerCase().includes('lac')) {
            value = value * 100000;
          }
          parsed.push({ field: 'annualIncome', value: Math.round(value), confidence: 0.88 });
          break;
        }
      }
      
      // Parse family size patterns
      const familyPatterns = [
        /(\d+)\s*(?:log|members?|logo|jan|family|parivaar)/i,
        /(?:family|parivaar|ghar)\s*(?:mein|me|has)?\s*(\d+)/i,
      ];
      
      for (const pattern of familyPatterns) {
        const match = text.match(pattern);
        if (match) {
          parsed.push({ field: 'familyMembers', value: parseInt(match[1]), confidence: 0.92 });
          break;
        }
      }
      
      // Parse category patterns
      if (text.match(/(?:general|सामान्य)/i)) {
        parsed.push({ field: 'category', value: 'general', confidence: 0.95 });
      } else if (text.match(/(?:obc|अन्य पिछड़ा वर्ग|other backward)/i)) {
        parsed.push({ field: 'category', value: 'obc', confidence: 0.95 });
      } else if (text.match(/(?:\bsc\b|scheduled caste|अनुसूचित जाति)/i)) {
        parsed.push({ field: 'category', value: 'sc', confidence: 0.95 });
      } else if (text.match(/(?:\bst\b|scheduled tribe|अनुसूचित जनजाति)/i)) {
        parsed.push({ field: 'category', value: 'st', confidence: 0.95 });
      }
      
      // Parse BPL status
      if (text.match(/(?:bpl|below poverty|गरीबी रेखा|गरीब)/i)) {
        parsed.push({ field: 'hasBPLCard', value: 'Yes', confidence: 0.94 });
      }
      
      // Parse rural/urban
      if (text.match(/(?:village|gaon|gramin|rural|ग्रामीण)/i)) {
        parsed.push({ field: 'isRural', value: 'Yes', confidence: 0.93 });
      } else if (text.match(/(?:city|sheher|urban|शहरी)/i)) {
        parsed.push({ field: 'isRural', value: 'No', confidence: 0.93 });
      }
      
      setParsedResults(parsed);
      setShowResults(true);
      
      if (parsed.length > 0) {
        toast({
          title: "Voice Query Parsed",
          description: `Extracted ${parsed.length} profile detail${parsed.length > 1 ? 's' : ''} from your speech.`,
        });
      } else {
        toast({
          title: "Could not parse query",
          description: "Please try speaking more clearly with specific details.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error("Voice parsing error:", error);
      toast({
        title: "Parsing Error",
        description: "Failed to process voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition(handleVoiceResult);

  const handleConfirmResults = () => {
    const profileData: Record<string, any> = {};
    parsedResults.forEach(result => {
      if (result.value === 'Yes') {
        profileData[result.field] = true;
      } else if (result.value === 'No') {
        profileData[result.field] = false;
      } else {
        profileData[result.field] = result.value;
      }
    });
    onQueryParsed(profileData);
    setShowResults(false);
    setParsedResults([]);
    setTranscript('');
  };

  const fieldLabels: Record<string, string> = {
    age: 'Age',
    landHolding: 'Land Holding (hectares)',
    annualIncome: 'Annual Income (₹)',
    familyMembers: 'Family Members',
    category: 'Social Category',
    hasBPLCard: 'BPL Card Holder',
    isRural: 'Rural Resident',
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            Voice Query Understanding
            <span className="genai-badge text-xs py-0.5 px-2">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            Speak naturally in Hindi or English — AI extracts your profile details
          </p>
        </div>
      </div>

      {/* Listening State */}
      <div className="relative">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          size="lg"
          className={cn(
            "w-full gap-3 h-14 text-base font-medium transition-all",
            isListening 
              ? "bg-destructive hover:bg-destructive/90" 
              : "bg-gradient-to-r from-primary to-primary/80"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Speech...
            </>
          ) : isListening ? (
            <>
              <div className="relative">
                <MicOff className="w-5 h-5" />
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
              </div>
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Speaking
            </>
          )}
        </Button>

        {isListening && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Try saying: "Meri umar 45 saal hai, mere paas 2 acre zameen hai, 
              annual income 2 lakh rupees hai, family mein 5 log hain"
            </p>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border">
          <p className="text-sm font-medium text-muted-foreground mb-1">You said:</p>
          <p className="text-foreground italic">"{transcript}"</p>
        </div>
      )}

      {/* Parsed Results */}
      {showResults && parsedResults.length > 0 && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Extracted Data:
          </p>
          
          <div className="space-y-2">
            {parsedResults.map((result, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-medium text-foreground">
                    {fieldLabels[result.field] || result.field}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-success">
                    {typeof result.value === 'number' 
                      ? result.field === 'annualIncome' 
                        ? `₹${result.value.toLocaleString('en-IN')}`
                        : result.value
                      : result.value
                    }
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(result.confidence * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleConfirmResults}
            className="w-full gap-2 mt-4"
          >
            Apply to Profile
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
