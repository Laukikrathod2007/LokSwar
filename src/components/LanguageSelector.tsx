import { useState } from 'react';
import { Languages, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'mr' | 'bn';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'header' | 'default';
}

export function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange,
  variant = 'default' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === 'header' ? 'ghost' : 'outline'}
          size="sm" 
          className={cn(
            "gap-2 font-medium transition-all",
            variant === 'header' 
              ? "text-white/90 hover:text-white hover:bg-white/10 border-white/20" 
              : "glass-card"
          )}
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang.nativeName}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 glass-card border-border/50 p-2"
      >
        <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-muted-foreground">
            AI-Powered Translation
          </span>
        </div>
        <DropdownMenuSeparator />
        
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              "flex items-center justify-between gap-3 cursor-pointer rounded-lg py-2.5 px-3 my-0.5",
              currentLanguage === lang.code && "bg-primary/10"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <div>
                <p className="font-medium text-foreground">{lang.nativeName}</p>
                <p className="text-xs text-muted-foreground">{lang.name}</p>
              </div>
            </div>
            
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
