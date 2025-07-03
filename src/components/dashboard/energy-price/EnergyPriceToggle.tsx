import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardConfig } from '../types';

interface EnergyPriceToggleProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceToggle: React.FC<EnergyPriceToggleProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const handleToggleCustomPricing = (enabled: boolean) => {
    onConfigChange({
      ...config,
      enableCustomPricing: enabled,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="custom-pricing">Enable Custom Pricing</Label>
        <p className="text-sm text-muted-foreground">
          Use your actual energy rates instead of UK averages
        </p>
      </div>
      <Switch
        id="custom-pricing"
        checked={config.enableCustomPricing}
        onCheckedChange={handleToggleCustomPricing}
      />
    </div>
  );
};

export default EnergyPriceToggle;