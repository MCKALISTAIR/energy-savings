
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumericValidation } from '@/hooks/useNumericValidation';

interface EVSpecificationsProps {
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
  errors: any;
  showErrors: boolean;
  isMobile: boolean;
}

const EVSpecifications: React.FC<EVSpecificationsProps> = ({
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
        <Label htmlFor="make">Make</Label>
        <Input
          id="make"
          value={getSpecValue('make')}
          onChange={(e) => updateSpecification('make', e.target.value)}
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
      <div>
        <Label htmlFor="batteryCapacity">Battery Capacity (kWh) <span className="text-red-500">*</span></Label>
        <Input
          id="batteryCapacity"
          type="text"
          value={getSpecValue('batteryCapacity')}
          onChange={(e) => handleNumericInput(e, 'batteryCapacity', true, updateSpecification)}
          className={`${showErrors && errors.batteryCapacity ? 'border-red-500' : ''} ${validationErrors.batteryCapacity ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
          required
        />
        {showErrors && errors.batteryCapacity && (
          <p className="text-sm text-red-500 mt-1">{errors.batteryCapacity}</p>
        )}
        {validationErrors.batteryCapacity && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.batteryCapacity}</p>
        )}
      </div>
      <div>
        <Label htmlFor="efficiency">Efficiency (miles/kWh)</Label>
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
        <Label htmlFor="annualMileage">Annual Mileage <span className="text-red-500">*</span></Label>
        <Input
          id="annualMileage"
          type="number"
          value={getSpecValue('annualMileage')}
          onChange={(e) => updateSpecification('annualMileage', Number(e.target.value))}
          className={`${showErrors && errors.annualMileage ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
          required
        />
        {showErrors && errors.annualMileage && (
          <p className="text-sm text-red-500 mt-1">{errors.annualMileage}</p>
        )}
      </div>
    </div>
  );
};

export default EVSpecifications;
