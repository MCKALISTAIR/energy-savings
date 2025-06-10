
import React from 'react';
import { Zap } from 'lucide-react';

const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-foreground">Energy Calculator</h1>
      </div>
      <p className="text-muted-foreground">
        Sign in to save your renewable energy calculations
      </p>
    </div>
  );
};

export default AuthHeader;
