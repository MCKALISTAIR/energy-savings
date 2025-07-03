import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DashboardConfig } from '../types';
import { getDefaultConfig } from '../defaultConfig';

interface EnergyPriceActionsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceActions: React.FC<EnergyPriceActionsProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const resetToDefaults = () => {
    const defaultConfig = getDefaultConfig();
    onConfigChange({
      ...config,
      customEnergyPrices: defaultConfig.customEnergyPrices,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={resetToDefaults}
      className="w-full"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset to UK Averages
    </Button>
  );
};

export default EnergyPriceActions;