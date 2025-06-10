
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DashboardConfig } from './types';

interface TimePeriodsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const TimePeriodsSection: React.FC<TimePeriodsProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium text-muted-foreground">Time Periods</h5>
      
      <div className="grid grid-cols-2 items-center gap-2">
        <Label htmlFor="impact-timeframe" className="text-xs">Impact Period (years)</Label>
        <Input
          id="impact-timeframe"
          type="number"
          min="1"
          max="50"
          value={config.impactTimeframe}
          onChange={(e) => onConfigChange({ 
            ...config, 
            impactTimeframe: parseInt(e.target.value) || 20 
          })}
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
          value={config.solarROIPeriod}
          onChange={(e) => onConfigChange({ 
            ...config, 
            solarROIPeriod: parseInt(e.target.value) || 20 
          })}
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
          value={config.batteryROIPeriod}
          onChange={(e) => onConfigChange({ 
            ...config, 
            batteryROIPeriod: parseInt(e.target.value) || 20 
          })}
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
          value={config.evROIPeriod}
          onChange={(e) => onConfigChange({ 
            ...config, 
            evROIPeriod: parseInt(e.target.value) || 10 
          })}
          className="h-8"
        />
      </div>
    </div>
  );
};

export default TimePeriodsSection;
