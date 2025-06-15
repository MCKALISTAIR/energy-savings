
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';

interface SubtleSavePromptProps {
  hasData: boolean;
  dataDescription?: string;
}

const SubtleSavePrompt: React.FC<SubtleSavePromptProps> = ({ 
  hasData, 
  dataDescription = "your calculations" 
}) => {
  const navigate = useNavigate();
  const { houses, systems } = useSystem();

  // Check if user has added houses or systems locally
  const hasLocalData = houses.length > 1 || systems.length > 0; // houses.length > 1 because there's a default house

  // Don't show if no data
  if (!hasData && !hasLocalData) {
    return null;
  }

  const getDescription = () => {
    if (hasData && hasLocalData) {
      return "your calculations, houses, and systems";
    } else if (hasLocalData) {
      return "your houses and systems";
    }
    return dataDescription;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <Save className="w-4 h-4" />
          <span>Save {getDescription()} to access them anytime</span>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/auth', { state: { from: '/calculator' } })}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 h-8"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default SubtleSavePrompt;
