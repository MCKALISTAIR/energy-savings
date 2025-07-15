import React from 'react';
import { AlertTriangle, Link2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AccountLinkingPromptProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  existingMethod: 'email' | 'google';
  newMethod: 'email' | 'google';
  onLinkAccount: () => void;
  onCreateNew: () => void;
  loading: boolean;
}

const AccountLinkingPrompt: React.FC<AccountLinkingPromptProps> = ({
  isOpen,
  onClose,
  email,
  existingMethod,
  newMethod,
  onLinkAccount,
  onCreateNew,
  loading
}) => {
  const getMethodName = (method: 'email' | 'google') => {
    return method === 'google' ? 'Google' : 'Email & Password';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Account Already Exists
          </DialogTitle>
          <DialogDescription>
            We found an existing account with this email address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              An account with <strong>{email}</strong> already exists using{' '}
              <strong>{getMethodName(existingMethod)}</strong> authentication.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Would you like to link your {getMethodName(newMethod)} account to your existing account, 
              or create a separate account?
            </p>

            <div className="space-y-2">
              <Button
                onClick={onLinkAccount}
                disabled={loading}
                className="w-full flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                {loading ? 'Linking...' : `Link to existing account`}
              </Button>

              <Button
                onClick={onCreateNew}
                variant="outline"
                disabled={loading}
                className="w-full flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create separate account
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Link account:</strong> You'll be able to sign in using either method</p>
            <p><strong>Create separate:</strong> You'll have two different accounts with the same email</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountLinkingPrompt;