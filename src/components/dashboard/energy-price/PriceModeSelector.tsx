import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardConfig } from '../types';

interface PriceModeSelectorProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const PriceModeSelector: React.FC<PriceModeSelectorProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const handlePriceModeChange = (mode: 'apply-now' | 'historical-adjustment') => {
    onConfigChange({
      ...config,
      priceChangeMode: mode,
    });
  };

  return (
    <div className="space-y-2">
      <Label>Price Change Mode</Label>
      <Select
        value={config.priceChangeMode}
        onValueChange={handlePriceModeChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apply-now">
            Apply Now - Use new prices for future calculations only
          </SelectItem>
          <SelectItem value="historical-adjustment">
            Historical Adjustment - Recalculate as if prices were always this
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {config.priceChangeMode === 'apply-now' 
          ? 'New prices will only affect future calculations' 
          : 'All existing data will be recalculated with the new prices'
        }
      </p>
    </div>
  );
};

export default PriceModeSelector;