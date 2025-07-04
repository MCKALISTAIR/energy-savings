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
}

const EVResults: React.FC<EVResultsProps> = ({ results, milesPerYear, currentMPG }) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-green-500" />
          Your EV Savings Potential
        </CardTitle>
        <CardDescription>
          Financial benefits of switching to electric
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EVSavingsStats results={results} />
        <EnvironmentalImpactInfo milesPerYear={milesPerYear} currentMPG={currentMPG} />
      </CardContent>
    </Card>
  );
};

export default EVResults;