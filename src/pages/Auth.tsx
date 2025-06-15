import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailAuthForm from '@/components/auth/EmailAuthForm';

const Auth: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from calculator
  const cameFromCalculator = location.state?.from === '/calculator';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load saved email on component mount (if user opted to remember)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/calculator');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Save or remove email based on remember me checkbox
    if (rememberEmail) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Save or remove email based on remember me checkbox
    if (rememberEmail) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleSignInButton
              loading={loading}
              setLoading={setLoading}
              setError={setError}
            />

            <EmailAuthForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              rememberEmail={rememberEmail}
              setRememberEmail={setRememberEmail}
              loading={loading}
              handleSignIn={handleSignIn}
              handleSignUp={handleSignUp}
              defaultTab="signup"
            />

            {error && (
              <Alert className="mt-4">
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4">
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Continue without account CTA */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/calculator')}
                className="w-full flex items-center justify-center gap-2 mb-3"
              >
                <Calculator className="w-4 h-4" />
                Continue without account
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You can use the calculator without an account, but you'll need to sign up to save your data
              </p>
            </div>

            {/* Back CTA - Dynamic based on where user came from */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(cameFromCalculator ? '/calculator' : '/')}
                className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                {cameFromCalculator ? 'Back to Calculator' : 'Back to Landing Page'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
