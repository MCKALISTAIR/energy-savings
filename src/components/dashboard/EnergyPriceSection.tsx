import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardConfig } from './types';
import { getDefaultConfig } from './defaultConfig';
import { PoundSterling, RotateCcw } from 'lucide-react';

interface EnergyPriceSectionProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceSection: React.FC<EnergyPriceSectionProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const handleToggleCustomPricing = (enabled: boolean) => {
    onConfigChange({
      ...config,
      enableCustomPricing: enabled,
    });
  };

  const handlePriceChange = (energyType: keyof typeof config.customEnergyPrices, value: string) => {
    const numValue = parseFloat(value) || 0;
    onConfigChange({
      ...config,
      customEnergyPrices: {
        ...config.customEnergyPrices,
        [energyType]: numValue,
      },
    });
  };

  const handlePriceModeChange = (mode: 'apply-now' | 'historical-adjustment') => {
    onConfigChange({
      ...config,
      priceChangeMode: mode,
    });
  };

  const resetToDefaults = () => {
    const defaultConfig = getDefaultConfig();
    onConfigChange({
      ...config,
      customEnergyPrices: defaultConfig.customEnergyPrices,
    });
  };

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

        {config.enableCustomPricing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity-price">Electricity Rate (£/kWh)</Label>
                <Input
                  id="electricity-price"
                  type="number"
                  step="0.01"
                  value={config.customEnergyPrices.electricity}
                  onChange={(e) => handlePriceChange('electricity', e.target.value)}
                  placeholder="0.30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="petrol-price">Petrol Price (£/litre)</Label>
                <Input
                  id="petrol-price"
                  type="number"
                  step="0.01"
                  value={config.customEnergyPrices.petrol}
                  onChange={(e) => handlePriceChange('petrol', e.target.value)}
                  placeholder="1.45"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gas-price">Gas Rate (£/kWh)</Label>
                <Input
                  id="gas-price"
                  type="number"
                  step="0.01"
                  value={config.customEnergyPrices.gas}
                  onChange={(e) => handlePriceChange('gas', e.target.value)}
                  placeholder="0.06"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="oil-price">Oil Rate (£/kWh)</Label>
                <Input
                  id="oil-price"
                  type="number"
                  step="0.01"
                  value={config.customEnergyPrices.oil}
                  onChange={(e) => handlePriceChange('oil', e.target.value)}
                  placeholder="0.09"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lpg-price">LPG Rate (£/kWh)</Label>
                <Input
                  id="lpg-price"
                  type="number"
                  step="0.01"
                  value={config.customEnergyPrices.lpg}
                  onChange={(e) => handlePriceChange('lpg', e.target.value)}
                  placeholder="0.08"
                />
              </div>
            </div>

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

            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to UK Averages
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyPriceSection;