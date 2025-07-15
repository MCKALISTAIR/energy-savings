
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import PersonalInfoSection from './PersonalInfoSection';
import PreferencesSection from './PreferencesSection';
import LoginMethodSection from './LoginMethodSection';
import AccountLinkingSection from './AccountLinkingSection';
import PasswordChangeSection from './PasswordChangeSection';
import { useProfileForm } from '@/hooks/useProfileForm';

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ isOpen, onClose }) => {
  const {
    user,
    firstName,
    lastName,
    currency,
    newPassword,
    confirmPassword,
    loading,
    error,
    success,
    isGoogleUser,
    handleFirstNameChange,
    handleLastNameChange,
    setCurrency,
    setNewPassword,
    setConfirmPassword,
    loadUserData,
    handleSaveProfile,
    handleChangePassword,
  } = useProfileForm();

  React.useEffect(() => {
    loadUserData(isOpen);
  }, [isOpen]);

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(90vh-140px)] pl-4 pr-4">
          <div className="space-y-6 pb-6 pr-2 pl-2">
            {/* Personal Information */}
            <PersonalInfoSection
              email={user?.email || ''}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
            />

            {/* Preferences */}
            <PreferencesSection
              currency={currency}
              onCurrencyChange={setCurrency}
            />

            {/* Login Methods */}
            <LoginMethodSection user={user} />

            {/* Account Linking */}
            <AccountLinkingSection user={user} />

            {/* Password Change (only for email users) */}
            {!isGoogleUser && (
              <PasswordChangeSection
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                loading={loading}
                onNewPasswordChange={(e) => setNewPassword(e.target.value)}
                onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
                onChangePassword={handleChangePassword}
              />
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
          </div>
        </ScrollArea>
      </div>

      {/* Action Buttons - Side by Side */}
      <div className="flex gap-3 p-6 pt-4 border-t bg-background">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveProfile}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </>
  );
};

export default ProfileForm;
