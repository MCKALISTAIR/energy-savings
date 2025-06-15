
import React from 'react';
import { User, LogOut, Calculator, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';

interface UserActionsProps {
  hasUnsavedProgress?: boolean;
  progressDescription?: string;
}

const UserActions: React.FC<UserActionsProps> = ({ 
  hasUnsavedProgress = false, 
  progressDescription = "renewable energy calculations" 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show enhanced create account CTA for unauthenticated users
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Button 
                  size="sm"
                  onClick={() => navigate('/auth', { state: { from: '/calculator' } })}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    hasUnsavedProgress 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md animate-pulse' 
                      : ''
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Button>
                {hasUnsavedProgress && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-2 h-2 p-0 rounded-full animate-pulse"
                  >
                    <span className="sr-only">Unsaved progress</span>
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {hasUnsavedProgress 
                  ? `Save your ${progressDescription}` 
                  : 'Create an account to save your progress'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Show user actions for authenticated users
  return (
    <div className="flex items-center gap-3">
      <Calculator 
        className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
        onClick={() => navigate('/calculator')}
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ProfileModal>
          <User className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        </ProfileModal>
        {user.email}
      </div>
      <LogOut 
        className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
        onClick={handleSignOut}
      />
    </div>
  );
};

export default UserActions;
