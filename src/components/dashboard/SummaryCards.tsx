
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, PoundSterling, Calendar, Leaf } from 'lucide-react';

interface SummaryCardsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalSystemCost: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalMonthlySavings,
  totalAnnualSavings,
  totalSystemCost
}) => {
  return (
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
                £{totalMonthlySavings.toFixed(0)}
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
                £{totalAnnualSavings.toFixed(0)}
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
                {(totalSystemCost / totalAnnualSavings).toFixed(1)}y
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
              <p className="text-sm text-muted-foreground">20-Year Impact</p>
              <p className="text-2xl font-bold text-green-600">
                £{((totalAnnualSavings * 20) - totalSystemCost).toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
