
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Zap, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserActions from '@/components/UserActions';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 relative">
      {/* Login/User Actions in top right */}
      <div className="absolute top-6 right-4">
        {user ? (
          <UserActions />
        ) : (
          <Button 
            size="icon"
            variant="outline"
            onClick={() => navigate('/auth')}
            className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
          >
            <LogIn className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Discover Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Renewable Energy </span>
          Savings
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Make informed decisions about your sustainable energy future. Calculate potential savings from solar panels, 
          battery storage, electric vehicles, and heat pumps with our comprehensive planning tool.
        </p>
        <div className="flex justify-center">
          {user ? (
            <Button 
              size="lg" 
              onClick={() => navigate('/calculator')}
              className="text-lg px-8 py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Go to Calculator
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Calculating Savings
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
