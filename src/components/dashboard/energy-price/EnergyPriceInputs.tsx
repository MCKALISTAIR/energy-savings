import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DashboardConfig } from '../types';

interface EnergyPriceInputsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const EnergyPriceInputs: React.FC<EnergyPriceInputsProps> = ({ 
  config, 
  onConfigChange 
}) => {
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

  return (
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
  );
};

export default EnergyPriceInputs;