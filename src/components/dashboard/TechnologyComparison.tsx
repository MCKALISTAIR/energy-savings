
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SavingsData } from '@/pages/Index';
import { DashboardConfig } from './types';
import { formatCurrency } from '@/utils/currency';
import { useDatabaseSystem } from '@/contexts/DatabaseSystemContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TechnologyComparisonProps {
  data: SavingsData;
  config: DashboardConfig;
}

const TechnologyComparison: React.FC<TechnologyComparisonProps> = ({ data, config }) => {
  const { getCurrentHouseSystems, currentHouse } = useDatabaseSystem();
  const systems = getCurrentHouseSystems();

  // Check if user has any systems
  if (!currentHouse || systems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technology Comparison (Over {config.impactTimeframe} Years)</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Add systems to your house to see comparison data
            </p>
            <p className="text-sm text-muted-foreground">
              Go to the Systems tab to add solar panels, batteries, electric vehicles, or heat pumps
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get unique system types the user has
  const userSystemTypes = [...new Set(systems.map(system => system.type))];

  const solarSavings = data.solar.twentyYearSavings;
  const batterySavings = data.battery.twentyYearSavings;
  const evSavings = data.ev.tenYearSavings * 2; // Extrapolate EV savings to 20 years
  const heatPumpSavings = data.heatPump.twentyYearSavings;

  // Only include savings for systems the user actually has
  const activeSavings = [];
  if (userSystemTypes.includes('solar')) {
    activeSavings.push({ type: 'Solar', savings: solarSavings });
  }
  if (userSystemTypes.includes('battery')) {
    activeSavings.push({ type: 'Battery', savings: batterySavings });
  }
  if (userSystemTypes.includes('ev')) {
    activeSavings.push({ type: 'EV', savings: evSavings });
  }
  if (userSystemTypes.includes('heat_pump')) {
    activeSavings.push({ type: 'Heat Pump', savings: heatPumpSavings });
  }

  const totalSavings = activeSavings.reduce((sum, item) => sum + item.savings, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Comparison (Over {config.impactTimeframe} Years)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSavings.map((item) => {
          const percentage = totalSavings > 0 ? (item.savings / totalSavings) * 100 : 0;
          return (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{item.type} Savings</span>
                <span>{formatCurrency(item.savings)}</span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TechnologyComparison;
