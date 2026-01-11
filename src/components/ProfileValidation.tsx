import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, User, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEligibility } from '@/context/EligibilityContext';
import { UserProfile } from '@/types/eligibility';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { VoiceInputButton } from './VoiceInputButton';
import { toast } from '@/hooks/use-toast';

type VoiceField = 'name' | 'age' | 'income' | 'family' | 'land' | null;

export function ProfileValidation() {
  const { 
    selectedScheme, 
    userProfile, 
    completeProfileValidation, 
    startRuleEvaluation,
    goBack 
  } = useEligibility();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: userProfile.name || '',
    age: userProfile.age || undefined,
    gender: userProfile.gender || undefined,
    annualIncome: userProfile.annualIncome || undefined,
    state: userProfile.state || '',
    category: userProfile.category || undefined,
    isRural: userProfile.isRural || false,
    hasLand: userProfile.hasLand || false,
    landHolding: userProfile.landHolding || undefined,
    hasBPLCard: userProfile.hasBPLCard || false,
    isWidow: userProfile.isWidow || false,
    familyMembers: userProfile.familyMembers || undefined,
    education: userProfile.education || undefined,
  });

  const [activeVoiceField, setActiveVoiceField] = useState<VoiceField>(null);

  const handleVoiceResult = useCallback((transcript: string) => {
    if (!activeVoiceField) return;

    const cleanTranscript = transcript.trim();
    
    switch (activeVoiceField) {
      case 'name':
        setProfile(prev => ({ ...prev, name: cleanTranscript }));
        toast({ title: "Name captured", description: cleanTranscript });
        break;
      case 'age':
        const age = parseInt(cleanTranscript.replace(/\D/g, ''));
        if (!isNaN(age) && age > 0 && age < 150) {
          setProfile(prev => ({ ...prev, age }));
          toast({ title: "Age captured", description: `${age} years` });
        } else {
          toast({ title: "Could not parse age", description: "Please say a valid number", variant: "destructive" });
        }
        break;
      case 'income':
        const incomeMatch = cleanTranscript.replace(/,/g, '').match(/\d+/);
        if (incomeMatch) {
          const income = parseInt(incomeMatch[0]);
          setProfile(prev => ({ ...prev, annualIncome: income }));
          toast({ title: "Income captured", description: `₹${income.toLocaleString('en-IN')}` });
        } else {
          toast({ title: "Could not parse income", description: "Please say a number", variant: "destructive" });
        }
        break;
      case 'family':
        const members = parseInt(cleanTranscript.replace(/\D/g, ''));
        if (!isNaN(members) && members > 0) {
          setProfile(prev => ({ ...prev, familyMembers: members }));
          toast({ title: "Family size captured", description: `${members} members` });
        } else {
          toast({ title: "Could not parse family size", description: "Please say a valid number", variant: "destructive" });
        }
        break;
      case 'land':
        const landMatch = cleanTranscript.match(/[\d.]+/);
        if (landMatch) {
          const land = parseFloat(landMatch[0]);
          setProfile(prev => ({ ...prev, landHolding: land }));
          toast({ title: "Land holding captured", description: `${land} hectares` });
        } else {
          toast({ title: "Could not parse land holding", description: "Please say a number", variant: "destructive" });
        }
        break;
    }
    
    setActiveVoiceField(null);
  }, [activeVoiceField]);

  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition(handleVoiceResult);

  const toggleVoiceInput = (field: VoiceField) => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      if (isListening) {
        stopListening();
      }
      setActiveVoiceField(field);
      setTimeout(() => startListening(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfileValidation(profile);
    startRuleEvaluation();
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!selectedScheme) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <Button 
        variant="ghost" 
        onClick={goBack}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scheme Overview
      </Button>

      <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Profile Verification
            </h2>
            <p className="text-sm text-muted-foreground">
              Provide your details for {selectedScheme.name}
            </p>
          </div>
        </div>

        {/* Voice Input Instructions */}
        {isSupported && (
          <div className="mb-6 p-3 bg-accent/30 rounded-lg flex items-center gap-3 text-sm">
            <Mic className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-muted-foreground">
              Click the <span className="text-primary font-medium">microphone icon</span> next to any field to speak your answer instead of typing.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={profile.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="flex-1"
                />
                <VoiceInputButton
                  isListening={isListening && activeVoiceField === 'name'}
                  isSupported={isSupported}
                  onClick={() => toggleVoiceInput('name')}
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age (Years)</Label>
              <div className="flex gap-2">
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={profile.age || ''}
                  onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
                  className="flex-1"
                />
                <VoiceInputButton
                  isListening={isListening && activeVoiceField === 'age'}
                  isSupported={isSupported}
                  onClick={() => toggleVoiceInput('age')}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={profile.gender} 
                onValueChange={(v) => updateField('gender', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (₹)</Label>
              <div className="flex gap-2">
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 300000"
                  value={profile.annualIncome || ''}
                  onChange={(e) => updateField('annualIncome', parseInt(e.target.value) || undefined)}
                  className="flex-1"
                />
                <VoiceInputButton
                  isListening={isListening && activeVoiceField === 'income'}
                  isSupported={isSupported}
                  onClick={() => toggleVoiceInput('income')}
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={profile.state} 
                onValueChange={(v) => updateField('state', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="uttar_pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="west_bengal">West Bengal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Social Category</Label>
              <Select 
                value={profile.category} 
                onValueChange={(v) => updateField('category', v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                  <SelectItem value="ews">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select 
                value={profile.education} 
                onValueChange={(v) => updateField('education', v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Formal Education</SelectItem>
                  <SelectItem value="primary">Primary (1-5)</SelectItem>
                  <SelectItem value="secondary">Secondary (6-10)</SelectItem>
                  <SelectItem value="higher_secondary">Higher Secondary (11-12)</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Post Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Family Members */}
            <div className="space-y-2">
              <Label htmlFor="family">Family Members</Label>
              <div className="flex gap-2">
                <Input
                  id="family"
                  type="number"
                  placeholder="Number of family members"
                  value={profile.familyMembers || ''}
                  onChange={(e) => updateField('familyMembers', parseInt(e.target.value) || undefined)}
                  className="flex-1"
                />
                <VoiceInputButton
                  isListening={isListening && activeVoiceField === 'family'}
                  isSupported={isSupported}
                  onClick={() => toggleVoiceInput('family')}
                />
              </div>
            </div>
          </div>

          {/* Land Holding */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="landHolding">Land Holding (Hectares)</Label>
              <div className="flex gap-2">
                <Input
                  id="landHolding"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  value={profile.landHolding || ''}
                  onChange={(e) => updateField('landHolding', parseFloat(e.target.value) || undefined)}
                  className="flex-1"
                />
                <VoiceInputButton
                  isListening={isListening && activeVoiceField === 'land'}
                  isSupported={isSupported}
                  onClick={() => toggleVoiceInput('land')}
                />
              </div>
            </div>
          </div>

          {/* Toggle switches */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasLand" className="cursor-pointer">Do you own agricultural land?</Label>
              <Switch
                id="hasLand"
                checked={profile.hasLand}
                onCheckedChange={(v) => updateField('hasLand', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isRural" className="cursor-pointer">Do you live in a rural area?</Label>
              <Switch
                id="isRural"
                checked={profile.isRural}
                onCheckedChange={(v) => updateField('isRural', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hasBPL" className="cursor-pointer">Do you have a BPL Card?</Label>
              <Switch
                id="hasBPL"
                checked={profile.hasBPLCard}
                onCheckedChange={(v) => updateField('hasBPLCard', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isWidow" className="cursor-pointer">Are you a widow?</Label>
              <Switch
                id="isWidow"
                checked={profile.isWidow}
                onCheckedChange={(v) => updateField('isWidow', v)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2">
            Continue to Evaluation
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
