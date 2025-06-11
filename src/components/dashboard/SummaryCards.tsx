
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, PoundSterling, Calendar, Leaf } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import DashboardSettings from './DashboardSettings';
import { DashboardConfig } from './types';

interface SummaryCardsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalSystemCost: number;
  impactTimeframe?: number;
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalMonthlySavings,
  totalAnnualSavings,
  totalSystemCost,
  impactTimeframe = 20,
  config,
  onConfigChange
}) => {
  const totalImpactSavings = (totalAnnualSavings * impactTimeframe) - totalSystemCost;

  return (
    <div className="space-y-4">
      {/* Header with Customize Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Summary</h2>
        <DashboardSettings config={config} onConfigChange={onConfigChange} />
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <PoundSterling className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.round(totalMonthlySavings))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Savings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(Math.round(totalAnnualSavings))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalAnnualSavings > 0 ? (totalSystemCost / totalAnnualSavings).toFixed(1) : '0'}y
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{impactTimeframe}-Year Impact</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.round(totalImpactSavings))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryCards;
