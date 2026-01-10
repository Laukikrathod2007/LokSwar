import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SchemeCard } from './SchemeCard';
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
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Find Your Government Benefits
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a scheme to check your eligibility. Our AI-powered system will guide you through the assessment process.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search schemes by name or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            selectedCategory === 'all' 
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All Schemes
        </button>
        {Object.entries(schemeCategories).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as SchemeCategory)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === key 
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Schemes grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No schemes found matching your search.</p>
        </div>
      )}
    </div>
  );
}
