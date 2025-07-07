import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SmartMeterBackButtonProps {
  onBack: () => void;
}

const SmartMeterBackButton: React.FC<SmartMeterBackButtonProps> = ({ onBack }) => {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Suppliers
      </Button>
    </div>
  );
};

export default SmartMeterBackButton;