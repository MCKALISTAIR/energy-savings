import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, WifiOff, CheckCircle, ExternalLink, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';

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
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState<string>('');
  const { validateApiKey } = useOctopusEnergy();

  const handleApiKeyChange = (value: string) => {
    onApiKeyChange(value);
    setValidationState('idle');
    setValidationError('');
  };

  const handleClearApiKey = () => {
    onApiKeyChange('');
    setValidationState('idle');
    setValidationError('');
  };

  const handleValidateKey = async () => {
    if (!apiKey.trim()) return;
    
    setValidationState('validating');
    const result = await validateApiKey(apiKey);
    
    if (result.success && result.data?.valid) {
      setValidationState('valid');
    } else {
      setValidationState('invalid');
      setValidationError(result.error || 'Invalid API key');
    }
  };

  const handleBlur = () => {
    // Only validate if there's an API key and we're not currently validating
    if (apiKey.trim() && validationState !== 'validating') {
      handleValidateKey();
    }
  };

  const getValidationIcon = () => {
    switch (validationState) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

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
              <a 
                href="https://octopus.energy/dashboard/new/accounts/personal-details/api-access" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
              >
                Get API Key <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">Octopus Energy API Key</Label>
            <div className="relative">
              <Input 
                id="api-key"
                type="password"
                placeholder="sk_live_..."
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                onBlur={handleBlur}
                className={validationState === 'invalid' ? 'border-destructive pr-16' : 'pr-16'}
              />
              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                {apiKey && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearApiKey}
                    className="h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {getValidationIcon()}
              </div>
            </div>
            
            {validationState === 'invalid' && validationError && (
              <p className="text-xs text-destructive">
                {validationError}
              </p>
            )}
            
            {validationState === 'valid' && (
              <p className="text-xs text-green-600">
                API key is valid and account found
              </p>
            )}
            
            <p className="text-xs text-muted-foreground">
              You can find your API key in your Octopus Energy account dashboard
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleValidateKey} 
              variant="outline" 
              disabled={!apiKey.trim() || validationState === 'validating'}
              className="flex-1"
            >
              {validationState === 'validating' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validate Key
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-2">
                    <Button 
                      onClick={validationState === 'valid' ? onConnect : undefined}
                      disabled={loading || !apiKey.trim() || validationState !== 'valid'}
                      className="w-full"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Connect Smart Meter
                    </Button>
                  </div>
                </TooltipTrigger>
                {validationState !== 'valid' && (
                  <TooltipContent>
                    <p>Please validate your API key first</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OctopusConnectionForm;