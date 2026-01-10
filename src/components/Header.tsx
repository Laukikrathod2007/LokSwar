import { Landmark, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="gov-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">LokSwar</h1>
            <p className="text-xs md:text-sm text-white/80">Government Scheme Eligibility Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 gap-2"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden md:inline">English</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
