import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorPage = ({ error, resetError }: ErrorPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error message from various sources
  const errorMessage = error?.message || 
                      location.state?.message || 
                      new URLSearchParams(location.search).get('msg') ||
                      'An unexpected error occurred';

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Something went wrong
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            An unexpected error occurred
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-mono">
              {errorMessage}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            Please try refreshing the page or return to the home page.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={handleHome} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;