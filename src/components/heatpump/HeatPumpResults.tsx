import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PoundSterling, AlertTriangle } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import HeatPumpSavingsStats from './HeatPumpSavingsStats';
import EnvironmentalImpactInfo from './EnvironmentalImpactInfo';

interface HeatPumpResultsProps {
  results: SavingsData['heatPump'];
  hasData: boolean;
}

const HeatPumpResults: React.FC<HeatPumpResultsProps> = ({ results, hasData }) => {
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
        {!hasData ? (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Please fill in the heat pump details to see your potential environmental impact.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <HeatPumpSavingsStats results={results} />
            <EnvironmentalImpactInfo results={results} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatPumpResults;