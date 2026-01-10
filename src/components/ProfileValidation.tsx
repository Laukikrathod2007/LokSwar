import { useState } from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEligibility } from '@/context/EligibilityContext';
import { UserProfile } from '@/types/eligibility';

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={profile.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age (Years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age || ''}
                onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
              />
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
              <Input
                id="income"
                type="number"
                placeholder="e.g., 300000"
                value={profile.annualIncome || ''}
                onChange={(e) => updateField('annualIncome', parseInt(e.target.value) || undefined)}
              />
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
              <Input
                id="family"
                type="number"
                placeholder="Number of family members"
                value={profile.familyMembers || ''}
                onChange={(e) => updateField('familyMembers', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          {/* Land Holding */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="landHolding">Land Holding (Hectares)</Label>
              <Input
                id="landHolding"
                type="number"
                step="0.1"
                placeholder="e.g., 1.5"
                value={profile.landHolding || ''}
                onChange={(e) => updateField('landHolding', parseFloat(e.target.value) || undefined)}
              />
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
