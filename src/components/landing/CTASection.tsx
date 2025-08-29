import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <section className={`${isMobile ? 'py-8' : 'py-16'} bg-gradient-to-r from-green-600 to-blue-600 text-white`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
          Ready to Start Your Renewable Energy Journey?
        </h2>
        <p className={`${isMobile ? 'text-sm mb-6' : 'text-lg mb-8'} opacity-90 max-w-2xl mx-auto`}>
          {isMobile 
            ? 'Get personalized calculations and start saving today'
            : 'Get personalized calculations for your home and discover how much you could save with renewable energy solutions'
          }
        </p>
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-center gap-4'}`}>
          {user ? (
            <Button 
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/calculator')}
              className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} bg-white text-green-600 hover:bg-gray-50`}
            >
              <Calculator className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-2'}`} />
              Start Calculating
            </Button>
          ) : (
            <Button
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/auth')}
              className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} bg-white/10 border-white/20 text-white hover:bg-white/20`}
            >
              <ArrowRight className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-2'}`} />
              Get Started Free
            </Button>
          )}
        </div>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-75 ${isMobile ? 'mt-3' : 'mt-4'}`}>
          No credit card required • Free calculations • Instant results
        </p>
      </div>
    </section>
  );
};

export default CTASection;