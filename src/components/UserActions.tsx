
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';

const UserActions: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Check for development bypass flag
  const devBypass = localStorage.getItem('devBypass') === 'true';

  const handleSignOut = async () => {
    await signOut();
    // Clear development bypass when logging out
    localStorage.removeItem('devBypass');
    navigate('/landing');
  };

  // Don't show anything if user is not logged in AND dev bypass is not active
  if (!user && !devBypass) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ProfileModal>
          <User className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        </ProfileModal>
        {user?.email || (devBypass && 'Dev Mode')}
      </div>
      <LogOut 
        className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
        onClick={handleSignOut}
      />
    </div>
  );
};

export default UserActions;
