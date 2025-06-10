import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SavingsData } from '@/pages/Index';
import { DashboardConfig } from './types';

interface TechnologyComparisonProps {
  data: SavingsData;
  config: DashboardConfig;
}

const TechnologyComparison: React.FC<TechnologyComparisonProps> = ({ data, config }) => {
  const solarSavings = data.solar.twentyYearSavings;
  const batterySavings = data.battery.twentyYearSavings;
  const evSavings = data.ev.tenYearSavings * 2; // Extrapolate EV savings to 20 years

  const totalSavings = solarSavings + batterySavings + evSavings;

  const solarPercentage = (solarSavings / totalSavings) * 100 || 0;
  const batteryPercentage = (batterySavings / totalSavings) * 100 || 0;
  const evPercentage = (evSavings / totalSavings) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Comparison (Over {config.impactTimeframe} Years)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Solar Savings</span>
            <span>${solarSavings.toLocaleString()}</span>
          </div>
          <Progress value={solarPercentage} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Battery Savings</span>
            <span>${batterySavings.toLocaleString()}</span>
          </div>
          <Progress value={batteryPercentage} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>EV Savings</span>
            <span>${evSavings.toLocaleString()}</span>
          </div>
          <Progress value={evPercentage} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyComparison;
