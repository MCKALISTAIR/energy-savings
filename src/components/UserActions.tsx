
import React from 'react';
import { User, LogOut, Calculator, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';

const UserActions: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show create account CTA for unauthenticated users
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button 
          size="sm"
          onClick={() => navigate('/auth', { state: { from: '/calculator' } })}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </Button>
      </div>
    );
  }

  // Show user actions for authenticated users
  return (
    <div className="flex items-center gap-3">
      <Calculator 
        className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
        onClick={() => navigate('/calculator')}
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ProfileModal>
          <User className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        </ProfileModal>
        {user.email}
      </div>
      <LogOut 
        className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
        onClick={handleSignOut}
      />
    </div>
  );
};

export default UserActions;
