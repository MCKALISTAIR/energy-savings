
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, User, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SaveDataPromptProps {
  hasData: boolean;
  dataDescription?: string;
}

const SaveDataPrompt: React.FC<SaveDataPromptProps> = ({ 
  hasData, 
  dataDescription = "your calculations and savings data" 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't show the prompt if user is logged in or has no data
  if (user || !hasData) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Save className="w-5 h-5" />
          Save Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-300 bg-yellow-100">
          <TrendingUp className="w-4 h-4" />
          <AlertDescription className="text-yellow-800">
            You've calculated some great savings! Create an account to save {dataDescription} and access them anytime.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => navigate('/auth')}
            className="flex-1 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Create Account & Save
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="flex-1"
          >
            Sign In
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Free account • Takes 30 seconds • No spam
        </p>
      </CardContent>
    </Card>
  );
};

export default SaveDataPrompt;
