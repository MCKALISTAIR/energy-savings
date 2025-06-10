import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal } from 'lucide-react';

export interface DashboardConfig {
  impactTimeframe: number;
  solarROIPeriod: number;
  batteryROIPeriod: number;
  evROIPeriod: number;
  showSummaryCards: boolean;
  showSavingsChart: boolean;
  showInvestmentChart: boolean;
  showProjectionChart: boolean;
  showTechnologyComparison: boolean;
  showEnvironmentalImpact: boolean;
}

interface DashboardSettingsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<DashboardConfig>(config);

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  const handleReset = () => {
    const defaultConfig: DashboardConfig = {
      impactTimeframe: 20,
      solarROIPeriod: 20,
      batteryROIPeriod: 20,
      evROIPeriod: 10,
      showSummaryCards: true,
      showSavingsChart: true,
      showInvestmentChart: true,
      showProjectionChart: true,
      showTechnologyComparison: true,
      showEnvironmentalImpact: true,
    };
    setLocalConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Customize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Dashboard Settings</h4>
          </div>

          {/* Time Periods */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-muted-foreground">Time Periods</h5>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="impact-timeframe" className="text-xs">Impact Period (years)</Label>
              <Input
                id="impact-timeframe"
                type="number"
                min="1"
                max="50"
                value={localConfig.impactTimeframe}
                onChange={(e) => setLocalConfig(prev => ({ 
                  ...prev, 
                  impactTimeframe: parseInt(e.target.value) || 20 
                }))}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="solar-roi" className="text-xs">Solar ROI (years)</Label>
              <Input
                id="solar-roi"
                type="number"
                min="1"
                max="50"
                value={localConfig.solarROIPeriod}
                onChange={(e) => setLocalConfig(prev => ({ 
                  ...prev, 
                  solarROIPeriod: parseInt(e.target.value) || 20 
                }))}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="battery-roi" className="text-xs">Battery ROI (years)</Label>
              <Input
                id="battery-roi"
                type="number"
                min="1"
                max="50"
                value={localConfig.batteryROIPeriod}
                onChange={(e) => setLocalConfig(prev => ({ 
                  ...prev, 
                  batteryROIPeriod: parseInt(e.target.value) || 20 
                }))}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="ev-roi" className="text-xs">EV ROI (years)</Label>
              <Input
                id="ev-roi"
                type="number"
                min="1"
                max="50"
                value={localConfig.evROIPeriod}
                onChange={(e) => setLocalConfig(prev => ({ 
                  ...prev, 
                  evROIPeriod: parseInt(e.target.value) || 10 
                }))}
                className="h-8"
              />
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-muted-foreground">Show/Hide Sections</h5>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-summary" className="text-xs">Summary Cards</Label>
              <Switch
                id="show-summary"
                checked={localConfig.showSummaryCards}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showSummaryCards: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-savings" className="text-xs">Savings Chart</Label>
              <Switch
                id="show-savings"
                checked={localConfig.showSavingsChart}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showSavingsChart: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-investment" className="text-xs">Investment Chart</Label>
              <Switch
                id="show-investment"
                checked={localConfig.showInvestmentChart}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showInvestmentChart: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-projection" className="text-xs">Projection Chart</Label>
              <Switch
                id="show-projection"
                checked={localConfig.showProjectionChart}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showProjectionChart: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-comparison" className="text-xs">Technology Comparison</Label>
              <Switch
                id="show-comparison"
                checked={localConfig.showTechnologyComparison}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showTechnologyComparison: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-environmental" className="text-xs">Environmental Impact</Label>
              <Switch
                id="show-environmental"
                checked={localConfig.showEnvironmentalImpact}
                onCheckedChange={(checked) => setLocalConfig(prev => ({ 
                  ...prev, 
                  showEnvironmentalImpact: checked 
                }))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              Apply
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardSettings;
