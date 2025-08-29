
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Zap, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserActions from '@/components/UserActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto px-4 relative ${isMobile ? 'py-8' : 'py-16'}`}>
      {/* Login/User Actions in top right */}
      <div className={`absolute ${isMobile ? 'top-4 right-2' : 'top-6 right-4'}`}>
        {user ? (
          <UserActions />
        ) : (
          <Button 
            size={isMobile ? "sm" : "icon"}
            variant="outline"
            onClick={() => navigate('/auth')}
            className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
          >
            <LogIn className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </Button>
        )}
      </div>

      <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'}`}>
        <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'} font-bold text-foreground ${isMobile ? 'mb-4' : 'mb-6'}`}>
          Discover Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            {isMobile ? ' Renewable Energy' : ' Renewable Energy '}
          </span>
          Savings
        </h1>
        <p className={`${isMobile ? 'text-sm px-2' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto ${isMobile ? 'mb-6' : 'mb-8'}`}>
          {isMobile 
            ? 'Calculate savings from solar panels, batteries, EVs, and heat pumps with our planning tool.'
            : 'Make informed decisions about your sustainable energy future. Calculate potential savings from solar panels, battery storage, electric vehicles, and heat pumps with our comprehensive planning tool.'
                size={isMobile ? "default" : "lg"}
        </p>
        <div className="flex justify-center">
          {user ? (
            <Button 
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/calculator')}
              className={isMobile ? "px-6" : "text-lg px-8 py-6"}
                className={isMobile ? "w-full" : "text-lg px-8 py-6"}
              <Calculator className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-2'}`} />
              Go to Calculator
            </Button>
          ) : (
                size={isMobile ? "default" : "lg"}
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/auth')}
                className={`${isMobile ? 'w-full' : 'text-lg px-8 py-6'} bg-white/10 border-white/20 text-white hover:bg-white/20`}
            >
              <Zap className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-2'}`} />
              Start Calculating Savings
            </Button>
          )}
        </div>
      </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-75 ${isMobile ? 'mt-3' : 'mt-4'}`}>
  );
};

export default HeroSection;
