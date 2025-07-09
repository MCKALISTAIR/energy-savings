import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Wifi } from 'lucide-react';
import EnhancedMeterDataCards from './EnhancedMeterDataCards';
import BenefitsSection from './BenefitsSection';
import OctopusInfoSection from './OctopusInfoSection';

interface MeterData {
  currentUsage: number;
  dailyUsage: number;
  dailyCost: number;
  tariffRate: number;
}

interface Account {
  number: string;
}

interface ConnectedMeterDisplayProps {
  account: Account | null;
  apiKey: string;
  meterData: MeterData;
  gasData?: MeterData;
  onDisconnect: () => void;
  onChangeSupplier: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const ConnectedMeterDisplay: React.FC<ConnectedMeterDisplayProps> = ({
  account,
  apiKey,
  meterData,
  gasData,
  onDisconnect,
  onChangeSupplier,
  onRefresh,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Octopus Energy Integration</h2>
        <p className="text-gray-600">
          Your smart meter is connected and providing real-time energy data
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-green-500" />
            Connected to Octopus Energy
          </CardTitle>
          <CardDescription>
            Your Octopus Energy smart meter is connected and providing real-time data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Octopus Energy smart meter connected successfully! Data is being updated every 30 minutes.
              </AlertDescription>
            </Alert>
            
            {account && (
              <div className="text-sm text-muted-foreground">
                <p>Account: {account.number}</p>
                <p>API Key: {apiKey.substring(0, 8)}...</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={onDisconnect} variant="outline">
                Disconnect
              </Button>
              <Button 
                variant="ghost" 
                onClick={onChangeSupplier}
                className="text-muted-foreground"
              >
                Change Supplier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Data Display */}
      <EnhancedMeterDataCards 
        electricityData={meterData} 
        gasData={gasData}
        onRefresh={onRefresh}
        loading={loading}
      />

      <Separator />

      {/* Benefits Section */}
      <BenefitsSection connected />

      {/* Octopus Energy Specific Info */}
      <OctopusInfoSection />
    </div>
  );
};

export default ConnectedMeterDisplay;