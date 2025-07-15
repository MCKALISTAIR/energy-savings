
import React from 'react';
import { Settings } from 'lucide-react';

interface LoginMethodSectionProps {
  user: any;
}

const LoginMethodSection: React.FC<LoginMethodSectionProps> = ({ user }) => {
  const identities = user?.identities || [];
  const hasMultipleMethods = identities.length > 1;
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Login Methods</h3>
      
      <div className="space-y-2">
        {identities.map((identity: any) => (
          <div key={identity.id} className="p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">
                {identity.provider === 'google' ? 'Google Sign-In' : 'Email & Password'}
              </span>
              {hasMultipleMethods && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Linked
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {identity.provider === 'google' 
                ? `Connected with ${identity.identity_data?.email || user.email}`
                : `Email: ${user.email}`
              }
            </p>
          </div>
        ))}
        
        {hasMultipleMethods && (
          <p className="text-xs text-muted-foreground">
            You can sign in using any of your linked methods
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginMethodSection;
