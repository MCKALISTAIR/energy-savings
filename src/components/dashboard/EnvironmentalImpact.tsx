
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface EnvironmentalImpactProps {
  data: SavingsData;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ data }) => {
  return (
    <Card className="hover-scale bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-500" />
          Environmental Impact Summary
        </CardTitle>
        <CardDescription>Your contribution to a sustainable future</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {((data.solar.monthlySavings * 12 * 20 / 120) + 
                (data.ev.fuelSavings * 20 / 2000)).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Tonnes of CO₂ prevented over 20 years</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(data.solar.monthlySavings * 12 / 120 * 2500).toFixed(0)}
            </div>
            <p className="text-sm text-muted-foreground">Trees equivalent planted annually</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {((data.ev.fuelSavings / 1.45) * 2.3 / 1000).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Cars removed from road equivalent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalImpact;
