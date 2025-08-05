import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import EVSavingsStats from './EVSavingsStats';
import EnvironmentalImpactInfo from './EnvironmentalImpactInfo';

interface EVResultsProps {
  results: SavingsData['ev'];
  milesPerYear: string;
  currentMPG: string;
  hasCurrentVehicle: boolean;
}

const EVResults: React.FC<EVResultsProps> = ({ results, milesPerYear, currentMPG, hasCurrentVehicle }) => {
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
        <EVSavingsStats results={results} />
        <EnvironmentalImpactInfo 
          milesPerYear={milesPerYear} 
          currentMPG={currentMPG} 
          hasCurrentVehicle={hasCurrentVehicle} 
        />
      </CardContent>
    </Card>
  );
};

export default EVResults;