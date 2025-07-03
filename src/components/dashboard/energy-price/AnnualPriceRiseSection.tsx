import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardConfig } from '../types';

interface AnnualPriceRiseSectionProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const AnnualPriceRiseSection: React.FC<AnnualPriceRiseSectionProps> = ({ 
  config, 
  onConfigChange 
}) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="annual-price-rise">Annual Price Rise</Label>
          <p className="text-sm text-muted-foreground">
            Automatically adjust prices each year by a set percentage
          </p>
        </div>
        <Switch
          id="annual-price-rise"
          checked={config.enableAnnualPriceRise}
          onCheckedChange={(enabled) => 
            onConfigChange({
              ...config,
              enableAnnualPriceRise: enabled,
            })
          }
        />
      </div>

      {config.enableAnnualPriceRise && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price-rise-percentage">Annual % Change</Label>
            <Input
              id="price-rise-percentage"
              type="number"
              step="0.1"
              value={config.annualPriceRisePercentage}
              onChange={(e) => 
                onConfigChange({
                  ...config,
                  annualPriceRisePercentage: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="3.0"
            />
            <p className="text-xs text-muted-foreground">
              Use negative values for price drops (e.g., -2.5)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-rise-date">Annual Change Date</Label>
            <Input
              id="price-rise-date"
              type="text"
              value={config.priceRiseDate}
              onChange={(e) => 
                onConfigChange({
                  ...config,
                  priceRiseDate: e.target.value,
                })
              }
              placeholder="01-01"
              pattern="[0-9]{2}-[0-9]{2}"
            />
            <p className="text-xs text-muted-foreground">
              Format: MM-DD (e.g., 01-01 for January 1st)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualPriceRiseSection;