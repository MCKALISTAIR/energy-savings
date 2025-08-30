
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

interface EmailAuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  rememberEmail: boolean;
  setRememberEmail: (remember: boolean) => void;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => void;
  handleSignUp: (e: React.FormEvent) => void;
  defaultTab?: string;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  rememberEmail,
  setRememberEmail,
  loading,
  handleSignIn,
  handleSignUp,
  defaultTab = "signin",
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="signin-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="sm:text-sm text-base h-12"
            />
          </div>
          <div>
            <Label htmlFor="signin-password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="sm:text-sm text-base h-12"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-email"
              checked={rememberEmail}
              onCheckedChange={(checked) => setRememberEmail(checked as boolean)}
            />
            <Label htmlFor="remember-email" className="text-sm font-normal">
              Remember my email
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="signup-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="sm:text-sm text-base h-12"
            />
          </div>
          <div>
            <Label htmlFor="signup-password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min. 6 characters)"
              required
              minLength={6}
              className="sm:text-sm text-base h-12"
            />
          </div>
          <div>
            <Label htmlFor="signup-confirm-password">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={6}
              className={`sm:text-sm text-base h-12 ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}`}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-email-signup"
              checked={rememberEmail}
              onCheckedChange={(checked) => setRememberEmail(checked as boolean)}
            />
            <Label htmlFor="remember-email-signup" className="text-sm font-normal">
              Remember my email
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default EmailAuthForm;
