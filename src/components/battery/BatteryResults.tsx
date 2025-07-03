import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import BatterySavingsStats from './BatterySavingsStats';
import BatteryBackupInfo from './BatteryBackupInfo';

interface BatteryResultsProps {
  results: SavingsData['battery'];
  outageFrequency: string;
  batterySize: string;
}

const BatteryResults: React.FC<BatteryResultsProps> = ({ 
  results, 
  outageFrequency, 
  batterySize 
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
        <BatterySavingsStats results={results} />
        <BatteryBackupInfo 
          outageFrequency={outageFrequency} 
          batterySize={batterySize} 
        />
      </CardContent>
    </Card>
  );
};

export default BatteryResults;