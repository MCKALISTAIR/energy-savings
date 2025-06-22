
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SystemSpecificationsProps {
  systemType: 'solar' | 'battery' | 'ev';
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
  errors: any;
  showErrors: boolean;
  isMobile: boolean;
}

const SystemSpecifications: React.FC<SystemSpecificationsProps> = ({
  systemType,
  getSpecValue,
  updateSpecification,
  errors,
  showErrors,
  isMobile
}) => {
  switch (systemType) {
    case 'solar':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity (kW) <span className="text-red-500">*</span></Label>
            <Input
              id="capacity"
              type="number"
              value={getSpecValue('capacity')}
              onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
              className={`${showErrors && errors.capacity ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
              required
            />
            {showErrors && errors.capacity && (
              <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
            )}
          </div>
          <div>
            <Label htmlFor="panelCount">Panel Count</Label>
            <Input
              id="panelCount"
              type="number"
              value={getSpecValue('panelCount')}
              onChange={(e) => updateSpecification('panelCount', Number(e.target.value))}
              className={isMobile ? 'h-12' : ''}
            />
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

    case 'battery':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity (kWh) <span className="text-red-500">*</span></Label>
            <Input
              id="capacity"
              type="number"
              value={getSpecValue('capacity')}
              onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
              className={`${showErrors && errors.capacity ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
              required
            />
            {showErrors && errors.capacity && (
              <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
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

    case 'ev':
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
              type="number"
              value={getSpecValue('batteryCapacity')}
              onChange={(e) => updateSpecification('batteryCapacity', Number(e.target.value))}
              className={`${showErrors && errors.batteryCapacity ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`}
              required
            />
            {showErrors && errors.batteryCapacity && (
              <p className="text-sm text-red-500 mt-1">{errors.batteryCapacity}</p>
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

    default:
      return null;
  }
};

export default SystemSpecifications;
