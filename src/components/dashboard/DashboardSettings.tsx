
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal } from 'lucide-react';
import { DashboardConfig, DashboardSettingsProps } from './types';
import { getDefaultConfig } from './defaultConfig';
import TimePeriodsSection from './TimePeriodsSection';
import VisibilitySection from './VisibilitySection';
import ActionButtons from './ActionButtons';

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<DashboardConfig>(config);

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  const handleReset = () => {
    const defaultConfig = getDefaultConfig();
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

          <TimePeriodsSection 
            config={localConfig} 
            onConfigChange={setLocalConfig} 
          />

          <VisibilitySection 
            config={localConfig} 
            onConfigChange={setLocalConfig} 
          />

          <ActionButtons 
            onSave={handleSave} 
            onReset={handleReset} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardSettings;
