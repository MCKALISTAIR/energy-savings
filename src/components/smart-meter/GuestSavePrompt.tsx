import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Save } from 'lucide-react';
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
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Save className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Save Your Selection</CardTitle>
        </div>
        <CardDescription>
          You've selected {supplierName}. Create an account to save your energy supplier selection and access more features.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center space-x-3">
          <Button onClick={handleSignUp} className="flex-1">
            <User className="w-4 h-4 mr-2" />
            Sign Up & Save
          </Button>
          {onDismiss && (
            <Button variant="ghost" onClick={onDismiss}>
              Continue as Guest
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestSavePrompt;