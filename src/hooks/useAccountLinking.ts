import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAccountLinking = () => {
  const { linkIdentity } = useAuth();
  const { toast } = useToast();
  const [linkingState, setLinkingState] = useState<{
    showPrompt: boolean;
    email: string;
    existingMethod: 'email' | 'google';
    newMethod: 'email' | 'google';
    pendingCredentials?: any;
  }>({
    showPrompt: false,
    email: '',
    existingMethod: 'email',
    newMethod: 'google'
  });

  const checkForExistingAccount = async (email: string, newMethod: 'email' | 'google') => {
    try {
      // This is a simplified check - in a real implementation, you'd need to
      // check with your backend to see if an account exists with this email
      // For now, we'll simulate this based on auth state
      
      // You would implement a backend check here
      // const { data } = await supabase.functions.invoke('check-existing-account', {
      //   body: { email }
      // });
      
      return null; // No existing account found
    } catch (error) {
      console.error('Error checking for existing account:', error);
      return null;
    }
  };

  const handleLinkAccount = async () => {
    setLinkingState(prev => ({ ...prev, showPrompt: false }));
    
    try {
      if (linkingState.newMethod === 'google') {
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
            description: "Your accounts have been successfully linked",
          });
        }
      }
    } catch (err: any) {
      toast({
        title: "Link Failed",
        description: err.message || "An error occurred while linking accounts",
        variant: "destructive",
      });
    }
  };

  const handleCreateSeparateAccount = async () => {
    setLinkingState(prev => ({ ...prev, showPrompt: false }));
    
    try {
      if (linkingState.newMethod === 'google') {
        // Force creation of a new account by signing out first
        await supabase.auth.signOut();
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            queryParams: {
              prompt: 'select_account'
            }
          }
        });
        
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message || "Failed to create new account",
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      toast({
        title: "Sign In Failed",
        description: err.message || "An error occurred while creating account",
        variant: "destructive",
      });
    }
  };

  const promptAccountLinking = (email: string, existingMethod: 'email' | 'google', newMethod: 'email' | 'google') => {
    setLinkingState({
      showPrompt: true,
      email,
      existingMethod,
      newMethod
    });
  };

  const closeLinkingPrompt = () => {
    setLinkingState(prev => ({ ...prev, showPrompt: false }));
  };

  return {
    linkingState,
    handleLinkAccount,
    handleCreateSeparateAccount,
    promptAccountLinking,
    closeLinkingPrompt,
    checkForExistingAccount
  };
};