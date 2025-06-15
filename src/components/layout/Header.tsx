
import React from 'react';
import { House } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserActions from '@/components/UserActions';

interface HeaderProps {
  hasUnsavedProgress?: boolean;
  progressDescription?: string;
}

const Header: React.FC<HeaderProps> = ({ hasUnsavedProgress, progressDescription }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/landing');
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <House 
            className="w-6 h-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors mr-4" 
            onClick={handleHomeClick}
          />
        </div>

        <div className="ml-4">
          <UserActions 
            hasUnsavedProgress={hasUnsavedProgress}
            progressDescription={progressDescription}
          />
        </div>
      </div>
      
      <div className="text-center mt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Renewable Energy Savings Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how much you can save with solar panels, battery storage, electric vehicles, and heat pumps. 
          Make informed decisions about your sustainable energy future.
        </p>
      </div>
    </div>
  );
};

export default Header;
