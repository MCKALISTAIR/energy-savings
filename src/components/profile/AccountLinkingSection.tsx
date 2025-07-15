import React, { useState } from 'react';
import { Link2, Unlink, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AccountLinkingSectionProps {
  user: any;
}

const AccountLinkingSection: React.FC<AccountLinkingSectionProps> = ({ user }) => {
  const { linkIdentity, unlinkIdentity } = useAuth();
  const { toast } = useToast();
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  // Get linked identities from user
  const identities = user?.identities || [];
  const hasEmailProvider = identities.some((id: any) => id.provider === 'email');
  const hasGoogleProvider = identities.some((id: any) => id.provider === 'google');

  const handleLinkGoogle = async () => {
    setLinkingProvider('google');
    
    try {
      const { error } = await linkIdentity('google');
      
      if (error) {
        toast({
          title: "Link Failed",
          description: error.message || "Failed to link Google account",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Linked",
          description: "Your Google account has been successfully linked",
        });
      }
    } catch (err: any) {
      toast({
        title: "Link Failed",
        description: err.message || "An error occurred while linking your account",
        variant: "destructive",
      });
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkProvider = async (identity: any) => {
    // Prevent unlinking if it's the only authentication method
    if (identities.length <= 1) {
      toast({
        title: "Cannot Unlink",
        description: "You must have at least one authentication method",
        variant: "destructive",
      });
      return;
    }

    setUnlinkingProvider(identity.provider);
    
    try {
      const { error } = await unlinkIdentity(identity);
      
      if (error) {
        toast({
          title: "Unlink Failed",
          description: error.message || "Failed to unlink account",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Unlinked",
          description: `${identity.provider} account has been unlinked`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Unlink Failed",
        description: err.message || "An error occurred while unlinking your account",
        variant: "destructive",
      });
    } finally {
      setUnlinkingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Account Linking</h3>
      
      <div className="space-y-3">
        {/* Current linked accounts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Linked Accounts</h4>
          {identities.map((identity: any) => (
            <div key={identity.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                {identity.provider === 'google' && (
                  <div className="w-5 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center">
                    G
                  </div>
                )}
                {identity.provider === 'email' && (
                  <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                    @
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">
                    {identity.provider === 'google' ? 'Google' : 'Email & Password'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {identity.provider === 'google' 
                      ? `Connected as ${identity.identity_data?.email || user.email}`
                      : `Email: ${user.email}`
                    }
                  </p>
                </div>
              </div>
              
              {identities.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnlinkProvider(identity)}
                  disabled={unlinkingProvider === identity.provider}
                  className="text-muted-foreground hover:text-destructive"
                >
                  {unlinkingProvider === identity.provider ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <Unlink className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Available accounts to link */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available to Link</h4>
          
          {!hasGoogleProvider && (
            <div className="flex items-center justify-between p-3 border border-dashed rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center">
                  G
                </div>
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-muted-foreground">
                    Sign in with your Google account
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLinkGoogle}
                disabled={linkingProvider === 'google'}
                className="flex items-center gap-2"
              >
                {linkingProvider === 'google' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                Link
              </Button>
            </div>
          )}
        </div>

        {/* Security notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Linking accounts allows you to sign in using any of your connected methods. 
            You must keep at least one authentication method linked to your account.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AccountLinkingSection;