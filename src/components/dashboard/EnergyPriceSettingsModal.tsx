import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PoundSterling } from 'lucide-react';
import { DashboardConfig } from './types';
import EnergyPriceToggle from './energy-price/EnergyPriceToggle';
import EnergyPriceInputs from './energy-price/EnergyPriceInputs';
import PriceModeSelector from './energy-price/PriceModeSelector';
import AnnualPriceRiseSection from './energy-price/AnnualPriceRiseSection';
import EnergyPriceActions from './energy-price/EnergyPriceActions';

interface EnergyPriceSettingsModalProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceSettingsModal: React.FC<EnergyPriceSettingsModalProps> = ({ 
  config, 
  onConfigChange 
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

  const handleCancel = () => {
    setLocalConfig(config);
    setIsOpen(false);
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
        <Button variant="outline" className="w-full justify-start">
          <PoundSterling className="w-4 h-4 mr-2" />
          Energy Price Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PoundSterling className="w-5 h-5" />
            Energy Price Settings
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh] pr-6">
          <div className="space-y-6 pr-2">
            <div className="text-sm text-muted-foreground">
              Customize energy prices for more accurate savings calculations across all your renewable energy systems.
            </div>

            <EnergyPriceToggle 
              config={localConfig} 
              onConfigChange={setLocalConfig} 
            />

            {localConfig.enableCustomPricing && (
              <div className="space-y-6">
                <EnergyPriceInputs 
                  config={localConfig} 
                  onConfigChange={setLocalConfig} 
                />

                <PriceModeSelector 
                  config={localConfig} 
                  onConfigChange={setLocalConfig} 
                />

                <AnnualPriceRiseSection 
                  config={localConfig} 
                  onConfigChange={setLocalConfig} 
                />

                <EnergyPriceActions 
                  config={localConfig} 
                  onConfigChange={setLocalConfig} 
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EnergyPriceSettingsModal;