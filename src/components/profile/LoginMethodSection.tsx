
import React from 'react';
import { Settings } from 'lucide-react';

interface LoginMethodSectionProps {
  isGoogleUser: boolean;
}

const LoginMethodSection: React.FC<LoginMethodSectionProps> = ({ isGoogleUser }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Login Method</h3>
      
      <div className="p-3 bg-muted rounded-md">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="text-sm">
            {isGoogleUser ? 'Google Sign-In' : 'Email & Password'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isGoogleUser 
            ? 'You are signed in with your Google account'
            : 'You are using email and password authentication'
          }
        </p>
      </div>
    </div>
  );
};

export default LoginMethodSection;
