import { useState } from 'react';
import { Landmark, Shield, Sparkles } from 'lucide-react';
import { LanguageSelector, Language } from './LanguageSelector';

export function Header() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <header className="gov-header relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="official-seal">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                LokSwar
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full text-amber-200 border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </span>
            </div>
            <p className="text-xs md:text-sm text-white/70">
              Official Government Scheme Eligibility Portal
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure & Official</span>
          </div>
          
          <LanguageSelector 
            currentLanguage={language}
            onLanguageChange={setLanguage}
            variant="header"
          />
        </div>
      </div>
    </header>
  );
}
