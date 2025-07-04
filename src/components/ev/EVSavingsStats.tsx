import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Fuel, Wrench, Leaf } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface EVSavingsStatsProps {
  results: SavingsData['ev'];
}

const EVSavingsStats: React.FC<EVSavingsStatsProps> = ({ results }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            £{results.totalMonthlySavings.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">Monthly Savings</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            £{results.vehicleCost.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">Vehicle Cost</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <span className="flex items-center gap-2">
            <Fuel className="w-4 h-4" />
            Annual Fuel Savings
          </span>
          <span className="font-semibold text-green-600">
            £{results.fuelSavings.toFixed(0)}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Annual Maintenance Savings
          </span>
          <span className="font-semibold text-green-600">
            £{results.maintenanceSavings.toFixed(0)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Payback Period</span>
          <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
        </div>
        <Progress value={Math.min(100, (7 / results.paybackPeriod) * 100)} className="h-2" />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Leaf className="w-4 h-4" />
          10-Year Net Savings
        </h4>
        <div className="text-2xl font-bold text-green-600">
          £{results.tenYearSavings.toFixed(0)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Including applicable UK EV grants
        </p>
      </div>
    </>
  );
};

export default EVSavingsStats;