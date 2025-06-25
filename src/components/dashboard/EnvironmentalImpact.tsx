
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import { environmentalCalculator, EnvironmentalCalculator, DEFAULT_ENVIRONMENTAL_FACTORS } from '@/config/environmentalCalculations';
import { EnvironmentalConfig } from './types';

interface EnvironmentalImpactProps {
  data: SavingsData;
  timeframe?: number;
  config?: EnvironmentalConfig;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ 
  data, 
  timeframe = 20,
  config = {}
}) => {
  // Create calculator instance with custom factors if provided
  const calculator = config.customFactors 
    ? new EnvironmentalCalculator({
        ...DEFAULT_ENVIRONMENTAL_FACTORS,
        solar: {
          ...DEFAULT_ENVIRONMENTAL_FACTORS.solar,
          co2PreventedPerKwh: config.customFactors.solarCO2Factor ?? DEFAULT_ENVIRONMENTAL_FACTORS.solar.co2PreventedPerKwh,
        },
        ev: {
          ...DEFAULT_ENVIRONMENTAL_FACTORS.ev,
          co2PreventedPerMile: config.customFactors.evCO2Factor ?? DEFAULT_ENVIRONMENTAL_FACTORS.ev.co2PreventedPerMile,
        },
        heatPump: {
          ...DEFAULT_ENVIRONMENTAL_FACTORS.heatPump,
          co2PreventedPerKwh: config.customFactors.heatPumpCO2Factor ?? DEFAULT_ENVIRONMENTAL_FACTORS.heatPump.co2PreventedPerKwh,
        },
        general: {
          ...DEFAULT_ENVIRONMENTAL_FACTORS.general,
          treesPerTonneCO2: config.customFactors.treesPerTonneCO2 ?? DEFAULT_ENVIRONMENTAL_FACTORS.general.treesPerTonneCO2,
        },
      })
    : environmentalCalculator;

  // Extract annual mileage from EV data if available
  const annualMileage = 10000; // Default fallback - in real app, this would come from EV specifications

  // Calculate environmental impact
  const impact = calculator.calculateTotalImpact({
    solar: { monthlySavings: data.solar.monthlySavings },
    ev: { annualMileage: data.ev.totalMonthlySavings > 0 ? annualMileage : undefined },
    heatPump: { monthlySavings: data.heatPump.monthlySavings },
  }, timeframe);

  return (
    <Card className="hover-scale bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-500" />
          Environmental Impact Summary
        </CardTitle>
        <CardDescription>Your contribution to a sustainable future over {timeframe} years</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {impact.totalCO2Prevented.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Tonnes of CO₂ prevented over {timeframe} years</p>
            {config.showBreakdown && impact.totalCO2Prevented > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <div>Solar: {impact.breakdown.solar.toFixed(1)}t</div>
                {impact.breakdown.ev > 0 && <div>EV: {impact.breakdown.ev.toFixed(1)}t</div>}
                {impact.breakdown.heatPump > 0 && <div>Heat Pump: {impact.breakdown.heatPump.toFixed(1)}t</div>}
              </div>
            )}
          </div>
          
          {config.showTreesEquivalent !== false && (
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(impact.treesEquivalent)}
              </div>
              <p className="text-sm text-muted-foreground">Trees equivalent planted over {timeframe} years</p>
            </div>
          )}
          
          {config.showCarsEquivalent !== false && impact.carsRemovedEquivalent > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {impact.carsRemovedEquivalent.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Cars removed from road equivalent</p>
            </div>
          )}
        </div>
        
        {impact.totalCO2Prevented === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Calculate your renewable energy savings to see environmental impact</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvironmentalImpact;
