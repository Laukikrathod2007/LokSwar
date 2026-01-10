import { Scheme } from '@/types/eligibility';
import { schemeCategories } from '@/data/schemes';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SchemeCardProps {
  scheme: Scheme;
  onSelect: (scheme: Scheme) => void;
  isSelected?: boolean;
}

export function SchemeCard({ scheme, onSelect, isSelected }: SchemeCardProps) {
  const category = schemeCategories[scheme.category];
  const IconComponent = (LucideIcons as any)[scheme.iconName] || LucideIcons.FileText;

  return (
    <div
      onClick={() => onSelect(scheme)}
      className={cn("scheme-card group", isSelected && "selected")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(scheme)}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent 
            className="w-7 h-7" 
            style={{ color: category.color }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {scheme.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {category.label}
            </Badge>
          </div>
          
          {scheme.nameHindi && (
            <p className="text-sm text-muted-foreground mb-2">
              {scheme.nameHindi}
            </p>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {scheme.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {scheme.benefits.slice(0, 2).map((benefit, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center text-xs bg-success/10 text-success px-2 py-1 rounded-full"
              >
                {benefit.length > 30 ? benefit.substring(0, 30) + '...' : benefit}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span>{scheme.ministry}</span>
        <span className="text-primary font-medium group-hover:underline">
          Check Eligibility →
        </span>
      </div>
    </div>
  );
}
