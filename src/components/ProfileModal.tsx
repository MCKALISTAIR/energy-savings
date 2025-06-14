
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import ProfileForm from './profile/ProfileForm';
import UnsavedChangesDialog from './profile/UnsavedChangesDialog';
import { useProfileForm } from '@/hooks/useProfileForm';

interface ProfileModalProps {
  children: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { resetForm, hasUnsavedChanges, handleSaveProfile } = useProfileForm();

  const handleOpenChange = (open: boolean) => {
    if (!open && hasUnsavedChanges) {
      // Show confirmation dialog instead of closing
      setShowUnsavedDialog(true);
      return;
    }
    
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleCloseWithoutSaving = () => {
    setShowUnsavedDialog(false);
    setIsOpen(false);
    resetForm();
  };

  const handleSaveAndClose = async () => {
    await handleSaveProfile();
    setShowUnsavedDialog(false);
    setIsOpen(false);
  };

  const handleCancelClose = () => {
    setShowUnsavedDialog(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-8 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </DialogTitle>
            <DialogDescription className="sr-only">
              Manage your profile information, preferences, and account settings
            </DialogDescription>
          </DialogHeader>
          
          <ProfileForm isOpen={isOpen} onClose={() => handleOpenChange(false)} />
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={handleCloseWithoutSaving}
        onCancel={handleCancelClose}
        onSave={handleSaveAndClose}
      />
    </>
  );
};

export default ProfileModal;
