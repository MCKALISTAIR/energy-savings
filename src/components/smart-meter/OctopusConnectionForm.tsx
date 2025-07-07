import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';

interface OctopusConnectionFormProps {
  apiKey: string;
  loading: boolean;
  onApiKeyChange: (value: string) => void;
  onConnect: () => void;
}

const OctopusConnectionForm: React.FC<OctopusConnectionFormProps> = ({
  apiKey,
  loading,
  onApiKeyChange,
  onConnect
}) => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-gray-400" />
          Connect Your Smart Meter
        </CardTitle>
        <CardDescription>
          Enter your API key to connect your smart meter and start receiving real-time data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To connect your smart meter, you'll need your Octopus Energy API key. 
              This can be found in your Octopus Energy account dashboard under Developer settings.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">Octopus Energy API Key</Label>
            <Input 
              id="api-key"
              type="password"
              placeholder="sk_live_..."
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can find your API key in your Octopus Energy account dashboard
            </p>
          </div>

          <Button onClick={onConnect} className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect Octopus Energy Smart Meter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OctopusConnectionForm;