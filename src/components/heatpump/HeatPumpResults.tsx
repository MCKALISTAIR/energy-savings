import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PoundSterling } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import HeatPumpSavingsStats from './HeatPumpSavingsStats';
import EnvironmentalImpactInfo from './EnvironmentalImpactInfo';

interface HeatPumpResultsProps {
  results: SavingsData['heatPump'];
}

const HeatPumpResults: React.FC<HeatPumpResultsProps> = ({ results }) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PoundSterling className="w-5 h-5 text-green-500" />
          Your Heat Pump Savings Potential
        </CardTitle>
        <CardDescription>
          Based on your inputs, here's your potential savings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HeatPumpSavingsStats results={results} />
        <EnvironmentalImpactInfo results={results} />
      </CardContent>
    </Card>
  );
};

export default HeatPumpResults;