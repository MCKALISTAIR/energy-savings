import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileModalProps {
  children: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is using Google OAuth
  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const hasPassword = user?.app_metadata?.providers?.includes('email');

  // Function to validate name input (letters and hyphens only)
  const validateNameInput = (value: string): string => {
    return value.replace(/[^a-zA-Z-]/g, '');
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNameInput(e.target.value);
    setFirstName(validatedValue);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNameInput(e.target.value);
    setLastName(validatedValue);
  };

  useEffect(() => {
    if (user && isOpen) {
      // Load user metadata if available
      const metadata = user.user_metadata || {};
      setFirstName(metadata.first_name || '');
      setLastName(metadata.last_name || '');
      
      // Load currency preference from localStorage or default to USD
      const savedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
      setCurrency(savedCurrency);
    }
  }, [user, isOpen]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      });

      if (updateError) throw updateError;

      // Save currency preference to localStorage
      localStorage.setItem('preferredCurrency', currency);

      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form state when closing
      setError(null);
      setSuccess(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="Enter your first name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Only letters and hyphens allowed
                  </p>
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Enter your last name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Only letters and hyphens allowed
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
              
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Login Method */}
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

            {/* Password Change (only for email users) */}
            {!isGoogleUser && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Change Password</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    variant="outline"
                    className="w-full"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </Button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
