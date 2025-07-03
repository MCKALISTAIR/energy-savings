import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PoundSterling } from 'lucide-react';
import { DashboardConfig } from './types';
import EnergyPriceToggle from './energy-price/EnergyPriceToggle';
import EnergyPriceInputs from './energy-price/EnergyPriceInputs';
import PriceModeSelector from './energy-price/PriceModeSelector';
import AnnualPriceRiseSection from './energy-price/AnnualPriceRiseSection';
import EnergyPriceActions from './energy-price/EnergyPriceActions';

interface EnergyPriceSectionProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceSection: React.FC<EnergyPriceSectionProps> = ({ 
  config, 
  onConfigChange 
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PoundSterling className="w-5 h-5" />
          Energy Price Settings
        </CardTitle>
        <CardDescription>
          Customize energy prices for more accurate savings calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EnergyPriceToggle 
          config={config} 
          onConfigChange={onConfigChange} 
        />

        {config.enableCustomPricing && (
          <div className="space-y-4">
            <EnergyPriceInputs 
              config={config} 
              onConfigChange={onConfigChange} 
            />

            <PriceModeSelector 
              config={config} 
              onConfigChange={onConfigChange} 
            />

            <AnnualPriceRiseSection 
              config={config} 
              onConfigChange={onConfigChange} 
            />

            <EnergyPriceActions 
              config={config} 
              onConfigChange={onConfigChange} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyPriceSection;