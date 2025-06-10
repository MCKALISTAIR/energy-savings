
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Battery, Car } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import { DashboardConfig } from '@/components/dashboard/DashboardSettings';

interface TechnologyComparisonProps {
  data: SavingsData;
  config: DashboardConfig;
}

const TechnologyComparison: React.FC<TechnologyComparisonProps> = ({ data, config }) => {
  const calculateROI = (savings: number, cost: number, period: number) => {
    if (cost <= 0) return 0;
    return ((savings * 12 * period) / cost) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover-scale border-l-4 border-l-yellow-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-yellow-500" />
            Solar Power
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Monthly Savings</span>
            <span className="font-semibold">£{data.solar.monthlySavings.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payback Period</span>
            <span className="font-semibold">{data.solar.paybackPeriod.toFixed(1)} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{config.solarROIPeriod}-Year ROI</span>
            <span className="font-semibold text-green-600">
              {calculateROI(data.solar.monthlySavings, data.solar.systemCost, config.solarROIPeriod).toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Battery className="w-5 h-5 text-blue-500" />
            Battery Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Monthly Savings</span>
            <span className="font-semibold">£{data.battery.monthlySavings.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payback Period</span>
            <span className="font-semibold">{data.battery.paybackPeriod.toFixed(1)} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{config.batteryROIPeriod}-Year ROI</span>
            <span className="font-semibold text-green-600">
              {calculateROI(data.battery.monthlySavings, data.battery.systemCost, config.batteryROIPeriod).toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="w-5 h-5 text-green-500" />
            Electric Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Monthly Savings</span>
            <span className="font-semibold">£{data.ev.totalMonthlySavings.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payback Period</span>
            <span className="font-semibold">{data.ev.paybackPeriod.toFixed(1)} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{config.evROIPeriod}-Year ROI</span>
            <span className="font-semibold text-green-600">
              {data.ev.vehicleCost > 28000 ? 
                calculateROI(data.ev.totalMonthlySavings, data.ev.vehicleCost - 28000, config.evROIPeriod).toFixed(0) : 
                0}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnologyComparison;
