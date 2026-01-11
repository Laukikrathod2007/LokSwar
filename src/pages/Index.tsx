import { Header } from '@/components/Header';
import { EligibilityFlow } from '@/components/EligibilityFlow';
import { EligibilityProvider } from '@/context/EligibilityContext';
import { Shield, ExternalLink } from 'lucide-react';

const Index = () => {
  return (
    <EligibilityProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <EligibilityFlow />
        </main>

        <footer className="border-t border-border/50 mt-12 py-8 bg-gradient-to-b from-transparent to-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>LokSwar - Official Government Scheme Eligibility Portal</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <a 
                  href="https://india.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline transition-colors"
                >
                  india.gov.in
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">AI-Powered Assistance</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </EligibilityProvider>
  );
};

export default Index;
