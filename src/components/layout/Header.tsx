
import React from 'react';
import { House } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import UserActions from '@/components/UserActions';
import HelpSection from '@/components/HelpSection';
import VisuallyHidden from '@/components/accessibility/VisuallyHidden';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleHomeClick = () => {
    navigate('/landing');
  };

  return (
    <header className="w-full mb-8" role="banner">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <House 
            className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-muted-foreground hover:text-foreground cursor-pointer transition-colors ${isMobile ? 'mr-2' : 'mr-4'}`}
            onClick={handleHomeClick}
            aria-label="Go to home page"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHomeClick();
              }
            }}
          />
          <VisuallyHidden>Home</VisuallyHidden>
        </div>

        <nav id="navigation" className={`flex items-center gap-2 ${isMobile ? 'ml-2' : 'ml-4'}`} role="navigation" aria-label="Main navigation">
          <HelpSection />
          <UserActions />
        </nav>
      </div>
      
      <div className={`text-center ${isMobile ? 'mt-2' : 'mt-4'}`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-foreground ${isMobile ? 'mb-2' : 'mb-4'}`}>
          Renewable Energy Savings Calculator
        </h1>
        <p className={`${isMobile ? 'text-sm px-4' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
          Discover how much you can save with solar panels, battery storage, electric vehicles, and heat pumps. 
          Make informed decisions about your sustainable energy future.
        </p>
      </div>
    </header>
  );
};

export default Header;
