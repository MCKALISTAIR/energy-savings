
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumericValidation } from '@/hooks/useNumericValidation';

interface SolarSpecificationsProps {
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
  errors: any;
  showErrors: boolean;
  isMobile: boolean;
}

const SolarSpecifications: React.FC<SolarSpecificationsProps> = ({
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
        <Label htmlFor="capacity">Capacity (kW) <span className="text-red-500">*</span></Label>
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
        <Label htmlFor="panelCount">Panel Count <span className="text-red-500">*</span></Label>
        <Input
          id="panelCount"
          type="text"
          value={getSpecValue('panelCount')}
          onChange={(e) => handleNumericInput(e, 'panelCount', false, updateSpecification)}
          className={`${showErrors && errors.panelCount ? 'border-red-500' : ''} ${validationErrors.panelCount ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
          required
        />
        {showErrors && errors.panelCount && (
          <p className="text-sm text-red-500 mt-1">{errors.panelCount}</p>
        )}
        {validationErrors.panelCount && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.panelCount}</p>
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
        <Label htmlFor="orientation">Orientation</Label>
        <Input
          id="orientation"
          value={getSpecValue('orientation')}
          onChange={(e) => updateSpecification('orientation', e.target.value)}
          placeholder="e.g., South"
          className={isMobile ? 'h-12' : ''}
        />
      </div>
      <div>
        <Label htmlFor="tilt">Tilt (degrees)</Label>
        <Input
          id="tilt"
          type="number"
          value={getSpecValue('tilt')}
          onChange={(e) => updateSpecification('tilt', Number(e.target.value))}
          className={isMobile ? 'h-12' : ''}
        />
      </div>
    </div>
  );
};

export default SolarSpecifications;
