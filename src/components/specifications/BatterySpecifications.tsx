
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumericValidation } from '@/hooks/useNumericValidation';

interface BatterySpecificationsProps {
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
  errors: any;
  showErrors: boolean;
  isMobile: boolean;
}

const BatterySpecifications: React.FC<BatterySpecificationsProps> = ({
  getSpecValue,
  updateSpecification,
  errors,
  showErrors,
  isMobile
}) => {
  const { validationErrors, handleNumericInput } = useNumericValidation();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="capacity">Capacity (kWh) <span className="text-red-500">*</span></Label>
        <Input
          id="capacity"
          type="text"
          value={getSpecValue('capacity')}
          onChange={(e) => handleNumericInput(e, 'capacity', true, updateSpecification)}
          className={`${showErrors && errors.capacity ? 'border-red-500' : ''} ${validationErrors.capacity ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
          required
        />
        {showErrors && errors.capacity && (
          <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
        )}
        {validationErrors.capacity && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.capacity}</p>
        )}
      </div>
      <div>
        <Label htmlFor="efficiency">Efficiency (%)</Label>
        <Input
          id="efficiency"
          type="number"
          step="0.1"
          value={getSpecValue('efficiency')}
          onChange={(e) => updateSpecification('efficiency', Number(e.target.value))}
          className={isMobile ? 'h-12' : ''}
        />
      </div>
      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={getSpecValue('brand')}
          onChange={(e) => updateSpecification('brand', e.target.value)}
          className={isMobile ? 'h-12' : ''}
        />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={getSpecValue('model')}
          onChange={(e) => updateSpecification('model', e.target.value)}
          className={isMobile ? 'h-12' : ''}
        />
      </div>
    </div>
  );
};

export default BatterySpecifications;
