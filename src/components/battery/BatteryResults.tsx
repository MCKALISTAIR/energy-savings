import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, AlertTriangle } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import BatterySavingsStats from './BatterySavingsStats';
import BatteryBackupInfo from './BatteryBackupInfo';

interface BatteryResultsProps {
  results: SavingsData['battery'];
  outageFrequency: string;
  batterySize: string;
  hasData: boolean;
}

const BatteryResults: React.FC<BatteryResultsProps> = ({ 
  results, 
  outageFrequency, 
  batterySize,
  hasData 
}) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Your Battery Savings
        </CardTitle>
        <CardDescription>
          Financial benefits and energy independence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasData ? (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Please fill in the battery details to see your potential environmental impact.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <BatterySavingsStats results={results} />
            <BatteryBackupInfo 
              outageFrequency={outageFrequency} 
              batterySize={batterySize} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BatteryResults;