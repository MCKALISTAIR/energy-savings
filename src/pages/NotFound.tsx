import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-4xl font-bold text-foreground">404</CardTitle>
          <p className="text-xl text-muted-foreground">Page not found</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
