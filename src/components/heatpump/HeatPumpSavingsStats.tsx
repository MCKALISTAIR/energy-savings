import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { SavingsData } from '@/pages/Index';

interface HeatPumpSavingsStatsProps {
  results: SavingsData['heatPump'];
}

const HeatPumpSavingsStats: React.FC<HeatPumpSavingsStatsProps> = ({ results }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.round(results.monthlySavings))}
          </div>
          <div className="text-sm text-muted-foreground">Monthly Savings</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(Math.round(results.systemCost))}
          </div>
          <div className="text-sm text-muted-foreground">System Cost</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Payback Period
          </span>
          <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
        </div>
        <Progress value={Math.min(100, (10 / results.paybackPeriod) * 100)} className="h-2" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            20-Year Net Savings
          </span>
          <span className="font-semibold text-green-600">
            {formatCurrency(Math.round(results.twentyYearSavings))}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Total savings after system pays for itself
        </div>
      </div>
    </>
  );
};

export default HeatPumpSavingsStats;