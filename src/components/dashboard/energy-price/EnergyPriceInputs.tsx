import React, { useState } from 'react';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const handlePriceChange = (energyType: keyof typeof config.customEnergyPrices, value: string) => {
    const numValue = parseFloat(value);
    
    // Clear previous error and warning for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[energyType];
      return newErrors;
    });
    setWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[energyType];
      return newWarnings;
    });
    
    // Validate the value
    if (value !== '' && (isNaN(numValue) || numValue < 0)) {
      setErrors(prev => ({
        ...prev,
        [energyType]: 'Value cannot be negative'
      }));
      return; // Don't update config with invalid value
    }
    
    // Check for high price warning (electricity and gas only)
    if (value !== '' && !isNaN(numValue) && numValue >= 0 && 
        (energyType === 'electricity' || energyType === 'gas') && 
        numValue > config.highPriceWarningThreshold) {
      setWarnings(prev => ({
        ...prev,
        [energyType]: `This price looks high (>£${config.highPriceWarningThreshold}/kWh). Are you sure this is correct?`
      }));
    }
    
    // Update config with valid value
    onConfigChange({
      ...config,
      customEnergyPrices: {
        ...config.customEnergyPrices,
        [energyType]: numValue || 0,
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
          min="0"
          value={config.customEnergyPrices.electricity}
          onChange={(e) => handlePriceChange('electricity', e.target.value)}
          placeholder="0.30"
          className={errors.electricity ? "border-destructive" : ""}
        />
        {errors.electricity && (
          <p className="text-sm text-destructive">{errors.electricity}</p>
        )}
        {warnings.electricity && (
          <p className="text-sm text-amber-600">{warnings.electricity}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="petrol-price">Petrol Price (£/litre)</Label>
        <Input
          id="petrol-price"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.petrol}
          onChange={(e) => handlePriceChange('petrol', e.target.value)}
          placeholder="1.45"
          className={errors.petrol ? "border-destructive" : ""}
        />
        {errors.petrol && (
          <p className="text-sm text-destructive">{errors.petrol}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gas-price">Gas Rate (£/kWh)</Label>
        <Input
          id="gas-price"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.gas}
          onChange={(e) => handlePriceChange('gas', e.target.value)}
          placeholder="0.06"
          className={errors.gas ? "border-destructive" : ""}
        />
        {errors.gas && (
          <p className="text-sm text-destructive">{errors.gas}</p>
        )}
        {warnings.gas && (
          <p className="text-sm text-amber-600">{warnings.gas}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gas-standing-charge">Gas Standing Charge (£/day)</Label>
        <Input
          id="gas-standing-charge"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.gasStandingCharge}
          onChange={(e) => handlePriceChange('gasStandingCharge', e.target.value)}
          placeholder="0.30"
          className={errors.gasStandingCharge ? "border-destructive" : ""}
        />
        {errors.gasStandingCharge && (
          <p className="text-sm text-destructive">{errors.gasStandingCharge}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="oil-price">Oil Rate (£/kWh)</Label>
        <Input
          id="oil-price"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.oil}
          onChange={(e) => handlePriceChange('oil', e.target.value)}
          placeholder="0.09"
          className={errors.oil ? "border-destructive" : ""}
        />
        {errors.oil && (
          <p className="text-sm text-destructive">{errors.oil}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lpg-price">LPG Rate (£/kWh)</Label>
        <Input
          id="lpg-price"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.lpg}
          onChange={(e) => handlePriceChange('lpg', e.target.value)}
          placeholder="0.08"
          className={errors.lpg ? "border-destructive" : ""}
        />
        {errors.lpg && (
          <p className="text-sm text-destructive">{errors.lpg}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="public-charging-price">Public Charging Rate (£/kWh)</Label>
        <Input
          id="public-charging-price"
          type="number"
          step="0.01"
          min="0"
          value={config.customEnergyPrices.publicCharging}
          onChange={(e) => handlePriceChange('publicCharging', e.target.value)}
          placeholder="0.79"
          className={errors.publicCharging ? "border-destructive" : ""}
        />
        {errors.publicCharging && (
          <p className="text-sm text-destructive">{errors.publicCharging}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Typical UK rapid charging rate at public stations
        </p>
      </div>
    </div>
  );
};

export default EnergyPriceInputs;