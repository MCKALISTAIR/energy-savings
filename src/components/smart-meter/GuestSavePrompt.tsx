import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuestSavePromptProps {
  supplierName: string;
  onDismiss?: () => void;
}

const GuestSavePrompt: React.FC<GuestSavePromptProps> = ({ 
  supplierName, 
  onDismiss 
}) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Save className="w-5 h-5" />
        <span className="text-sm font-medium">
          Save your energy supplier selection ({supplierName}) to access it anytime
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSignUp}
          className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-3 py-1 h-8 font-medium"
        >
          Create Account
        </Button>
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDismiss}
            className="text-white hover:bg-blue-700 text-sm px-3 py-1 h-8"
          >
            Continue as Guest
          </Button>
        )}
      </div>
    </div>
  );
};

export default GuestSavePrompt;