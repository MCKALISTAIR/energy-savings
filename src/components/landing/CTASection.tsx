
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Plan Your Energy Future?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of homeowners making informed decisions about renewable energy
        </p>
        {user ? (
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/calculator')}
            className="text-lg px-8 py-6"
          >
            Go to Calculator
          </Button>
        ) : (
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        )}
      </div>
    </div>
  );
};

export default CTASection;
