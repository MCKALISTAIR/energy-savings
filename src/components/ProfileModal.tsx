
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ProfileForm from './profile/ProfileForm';
import { useProfileForm } from '@/hooks/useProfileForm';

interface ProfileModalProps {
  children: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetForm } = useProfileForm();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form state when closing
      resetForm();
    }
  };

  return (
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
        
        <ProfileForm isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
