import { Header } from '@/components/Header';
import { EligibilityFlow } from '@/components/EligibilityFlow';
import { EligibilityProvider } from '@/context/EligibilityContext';

const Index = () => {
  return (
    <EligibilityProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <EligibilityFlow />
        </main>

        <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
          <p>
            LokSwar - Government Scheme Eligibility Portal | 
            <span className="ml-1">For official information, visit</span>
            <a 
              href="https://india.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              india.gov.in
            </a>
          </p>
        </footer>
      </div>
    </EligibilityProvider>
  );
};

export default Index;
