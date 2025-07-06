import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { DashboardConfig } from '../types';

interface AnnualPriceRiseSectionProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const AnnualPriceRiseSection: React.FC<AnnualPriceRiseSectionProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const [dateError, setDateError] = useState<string>('');

  const validateDate = (dateString: string): boolean => {
    // Check format DD-MM
    const dateRegex = /^(\d{2})-(\d{2})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      setDateError('Invalid format. Use DD-MM');
      return false;
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    
    // Validate day range
    if (day < 1 || day > 31) {
      setDateError('Day must be between 01-31');
      return false;
    }
    
    // Validate month range
    if (month < 1 || month > 12) {
      setDateError('Month must be between 01-12');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleDateChange = (value: string) => {
    if (value === '') {
      setDateError('');
      onConfigChange({
        ...config,
        priceRiseDate: value,
      });
      return;
    }
    
    if (validateDate(value)) {
      onConfigChange({
        ...config,
        priceRiseDate: value,
      });
    }
  };

  const clearPercentage = () => {
    onConfigChange({
      ...config,
      annualPriceRisePercentage: 0,
    });
  };

  const clearDate = () => {
    setDateError('');
    onConfigChange({
      ...config,
      priceRiseDate: '',
    });
  };
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
            <div className="relative">
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
                className="pr-8"
              />
              {config.annualPriceRisePercentage !== 0 && (
                <button
                  type="button"
                  onClick={clearPercentage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Use negative values for price drops (e.g., -2.5)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-rise-date">Annual Change Date</Label>
            <div className="relative">
              <Input
                id="price-rise-date"
                type="text"
                value={config.priceRiseDate}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="01-01"
                pattern="[0-9]{2}-[0-9]{2}"
                className={`pr-8 ${dateError ? "border-destructive" : ""}`}
              />
              {config.priceRiseDate && (
                <button
                  type="button"
                  onClick={clearDate}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {dateError && (
              <p className="text-sm text-destructive">{dateError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: DD-MM (e.g., 01-01 for January 1st)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualPriceRiseSection;