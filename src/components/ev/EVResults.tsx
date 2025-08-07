import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Fuel, AlertTriangle } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import EVSavingsStats from './EVSavingsStats';
import EnvironmentalImpactInfo from './EnvironmentalImpactInfo';

interface EVResultsProps {
  results: SavingsData['ev'];
  milesPerYear: string;
  currentMPG: string;
  hasCurrentVehicle: boolean;
  hasData: boolean;
}

const EVResults: React.FC<EVResultsProps> = ({ 
  results, 
  milesPerYear, 
  currentMPG, 
  hasCurrentVehicle,
  hasData
}) => {

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-green-500" />
          Your EV Savings Potential
        </CardTitle>
        <CardDescription>
          {hasCurrentVehicle 
            ? 'Financial benefits of switching to electric' 
            : 'EV savings vs equivalent new petrol vehicle'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasData ? (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Please fill in the EV details and click "Calculate Savings" to see your potential benefits.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <EVSavingsStats results={results} />
            
            <EnvironmentalImpactInfo 
              milesPerYear={milesPerYear} 
              currentMPG={currentMPG} 
              hasCurrentVehicle={hasCurrentVehicle} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EVResults;