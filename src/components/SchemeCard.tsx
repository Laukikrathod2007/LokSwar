import { Scheme } from '@/types/eligibility';
import { schemeCategories } from '@/data/schemes';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

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
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ 
            background: `linear-gradient(135deg, ${category.color}30, ${category.color}15)`,
            boxShadow: `0 4px 16px ${category.color}20`
          }}
        >
          <IconComponent 
            className="w-7 h-7" 
            style={{ color: category.color }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {scheme.name}
            </h3>
            <Badge 
              variant="secondary" 
              className="shrink-0 text-xs bg-primary/10 text-primary border-primary/20"
            >
              {category.label}
            </Badge>
          </div>
          
          {scheme.nameHindi && (
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {scheme.nameHindi}
            </p>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {scheme.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {scheme.benefits.slice(0, 2).map((benefit, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center text-xs bg-success/10 text-success px-2.5 py-1 rounded-full border border-success/20"
              >
                {benefit.length > 28 ? benefit.substring(0, 28) + '...' : benefit}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{scheme.ministry}</span>
        <span className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          Check Eligibility 
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
