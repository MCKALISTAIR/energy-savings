
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '@/components/ProfileModal';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // Clear development bypass when logging out
    localStorage.removeItem('devBypass');
    navigate('/landing');
  };

  return (
    <div className="flex justify-between items-start mb-8">
      <div className="text-center flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Renewable Energy Savings Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how much you can save with solar panels, battery storage, electric vehicles, and heat pumps. 
          Make informed decisions about your sustainable energy future.
        </p>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ProfileModal>
            <User className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </ProfileModal>
          {user?.email}
        </div>
        <LogOut 
          className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
          onClick={handleSignOut}
        />
      </div>
    </div>
  );
};

export default Header;
