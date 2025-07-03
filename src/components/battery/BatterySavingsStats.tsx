import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface BatterySavingsStatsProps {
  results: SavingsData['battery'];
}

const BatterySavingsStats: React.FC<BatterySavingsStatsProps> = ({ results }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            £{results.monthlySavings.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">Monthly Savings</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            £{results.systemCost.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">System Cost</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Payback Period</span>
          <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
        </div>
        <Progress value={Math.min(100, (15 / results.paybackPeriod) * 100)} className="h-2" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            20-Year Net Savings
          </span>
          <span className="font-semibold text-green-600">
            £{results.twentyYearSavings.toFixed(0)}
          </span>
        </div>
      </div>
    </>
  );
};

export default BatterySavingsStats;