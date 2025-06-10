
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardConfig } from './types';

interface VisibilityProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const VisibilitySection: React.FC<VisibilityProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium text-muted-foreground">Show/Hide Sections</h5>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="show-summary" className="text-xs">Summary Cards</Label>
        <Switch
          id="show-summary"
          checked={config.showSummaryCards}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showSummaryCards: checked 
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-savings" className="text-xs">Savings Chart</Label>
        <Switch
          id="show-savings"
          checked={config.showSavingsChart}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showSavingsChart: checked 
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-investment" className="text-xs">Investment Chart</Label>
        <Switch
          id="show-investment"
          checked={config.showInvestmentChart}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showInvestmentChart: checked 
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-projection" className="text-xs">Projection Chart</Label>
        <Switch
          id="show-projection"
          checked={config.showProjectionChart}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showProjectionChart: checked 
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-comparison" className="text-xs">Technology Comparison</Label>
        <Switch
          id="show-comparison"
          checked={config.showTechnologyComparison}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showTechnologyComparison: checked 
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-environmental" className="text-xs">Environmental Impact</Label>
        <Switch
          id="show-environmental"
          checked={config.showEnvironmentalImpact}
          onCheckedChange={(checked) => onConfigChange({ 
            ...config, 
            showEnvironmentalImpact: checked 
          })}
        />
      </div>
    </div>
  );
};

export default VisibilitySection;
