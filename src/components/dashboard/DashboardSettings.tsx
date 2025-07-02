
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlidersHorizontal } from 'lucide-react';
import { DashboardConfig, DashboardSettingsProps } from './types';
import { getDefaultConfig } from './defaultConfig';
import TimePeriodsSection from './TimePeriodsSection';
import VisibilitySection from './VisibilitySection';
import EnergyPriceSection from './EnergyPriceSection';
import ActionButtons from './ActionButtons';

interface DashboardSettingsPropsExtended extends DashboardSettingsProps {
  iconOnly?: boolean;
}

const DashboardSettings: React.FC<DashboardSettingsPropsExtended> = ({ 
  config, 
  onConfigChange, 
  iconOnly = false 
}) => {
  const [localConfig, setLocalConfig] = useState<DashboardConfig>(config);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local config with prop changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = () => {
    onConfigChange(localConfig);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultConfig = getDefaultConfig();
    setLocalConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset local config to current config when opening
      setLocalConfig(config);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size={iconOnly ? "icon" : "sm"} 
          className="ml-auto hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {!iconOnly && <span className="ml-2">Customize</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-4 pr-2">
            <TimePeriodsSection
              config={localConfig}
              onConfigChange={setLocalConfig}
            />

            <VisibilitySection
              config={localConfig}
              onConfigChange={setLocalConfig}
            />

            <EnergyPriceSection
              config={localConfig}
              onConfigChange={setLocalConfig}
            />

            <ActionButtons
              onSave={handleSave}
              onReset={handleReset}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettings;
