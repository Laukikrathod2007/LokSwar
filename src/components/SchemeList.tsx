import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SchemeCard } from './SchemeCard';
import { GenAIFeatures } from './GenAIFeatures';
import { schemes, schemeCategories } from '@/data/schemes';
import { useEligibility } from '@/context/EligibilityContext';
import { SchemeCategory } from '@/types/eligibility';
import { cn } from '@/lib/utils';

export function SchemeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'all'>('all');
  const { selectScheme, selectedScheme } = useEligibility();

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.nameHindi?.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 genai-badge mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-foreground font-medium">Official Government Portal</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Discover Your Government Benefits
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our AI-powered system analyzes your eligibility for central and state government welfare schemes 
          with multilingual support and voice assistance.
        </p>
      </div>

      {/* GenAI Features Showcase */}
      <GenAIFeatures />

      {/* Search Section */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search schemes by name, benefit, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base rounded-xl bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              selectedCategory === 'all' 
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                : "glass-card hover:bg-muted/80"
            )}
          >
            All Schemes
          </button>
          {Object.entries(schemeCategories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as SchemeCategory)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                selectedCategory === key 
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                  : "glass-card hover:bg-muted/80"
              )}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredSchemes.map(scheme => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onSelect={selectScheme}
            isSelected={selectedScheme?.id === scheme.id}
          />
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="glass-card rounded-2xl text-center py-16">
          <p className="text-muted-foreground text-lg">No schemes found matching your search.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
