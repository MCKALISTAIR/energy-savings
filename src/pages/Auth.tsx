import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailAuthForm from '@/components/auth/EmailAuthForm';

const Auth: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
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

  const handleDevBypass = () => {
    console.log('Development bypass activated - redirecting to main app');
    localStorage.setItem('devBypass', 'true');
    navigate('/');
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
              rememberEmail={rememberEmail}
              setRememberEmail={setRememberEmail}
              loading={loading}
              handleSignIn={handleSignIn}
              handleSignUp={handleSignUp}
            />

            {/* Development bypass button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={handleDevBypass}
                variant="outline"
                className="w-full bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                🚧 Dev Bypass (Skip Login)
              </Button>
              <p className="text-xs text-yellow-600 mt-1 text-center">
                For development only
              </p>
            </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

</edits_to_apply>
