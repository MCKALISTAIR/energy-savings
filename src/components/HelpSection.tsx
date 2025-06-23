
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HelpSection: React.FC = () => {
  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate('/help');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-muted-foreground hover:text-foreground"
      onClick={handleHelpClick}
    >
      <HelpCircle className="w-5 h-5" />
    </Button>
  );
};

export default HelpSection;
