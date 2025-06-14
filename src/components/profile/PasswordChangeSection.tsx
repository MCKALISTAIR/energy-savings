
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordChangeSectionProps {
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: () => void;
}

const PasswordChangeSection: React.FC<PasswordChangeSectionProps> = ({
  newPassword,
  confirmPassword,
  loading,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Change Password</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={onNewPasswordChange}
            placeholder="Enter new password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Confirm new password"
          />
        </div>

        <Button
          onClick={onChangePassword}
          disabled={loading || !newPassword || !confirmPassword}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangeSection;
