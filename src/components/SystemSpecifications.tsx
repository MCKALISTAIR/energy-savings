
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SystemSpecificationsProps {
  systemType: 'solar' | 'battery' | 'ev';
  getSpecValue: (key: string, defaultValue?: any) => any;
  updateSpecification: (key: string, value: any) => void;
}

const SystemSpecifications: React.FC<SystemSpecificationsProps> = ({
  systemType,
  getSpecValue,
  updateSpecification
}) => {
  switch (systemType) {
    case 'solar':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity (kW)</Label>
            <Input
              id="capacity"
              type="number"
              value={getSpecValue('capacity')}
              onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="panelCount">Panel Count</Label>
            <Input
              id="panelCount"
              type="number"
              value={getSpecValue('panelCount')}
              onChange={(e) => updateSpecification('panelCount', Number(e.target.value))}
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
            />
          </div>
          <div>
            <Label htmlFor="orientation">Orientation</Label>
            <Input
              id="orientation"
              value={getSpecValue('orientation')}
              onChange={(e) => updateSpecification('orientation', e.target.value)}
              placeholder="e.g., South"
            />
          </div>
          <div>
            <Label htmlFor="tilt">Tilt (degrees)</Label>
            <Input
              id="tilt"
              type="number"
              value={getSpecValue('tilt')}
              onChange={(e) => updateSpecification('tilt', Number(e.target.value))}
            />
          </div>
        </div>
      );

    case 'battery':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity (kWh)</Label>
            <Input
              id="capacity"
              type="number"
              value={getSpecValue('capacity')}
              onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
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
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={getSpecValue('brand')}
              onChange={(e) => updateSpecification('brand', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={getSpecValue('model')}
              onChange={(e) => updateSpecification('model', e.target.value)}
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
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={getSpecValue('model')}
              onChange={(e) => updateSpecification('model', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
            <Input
              id="batteryCapacity"
              type="number"
              value={getSpecValue('batteryCapacity')}
              onChange={(e) => updateSpecification('batteryCapacity', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="efficiency">Efficiency (miles/kWh)</Label>
            <Input
              id="efficiency"
              type="number"
              step="0.1"
              value={getSpecValue('efficiency')}
              onChange={(e) => updateSpecification('efficiency', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="annualMileage">Annual Mileage</Label>
            <Input
              id="annualMileage"
              type="number"
              value={getSpecValue('annualMileage')}
              onChange={(e) => updateSpecification('annualMileage', Number(e.target.value))}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default SystemSpecifications;
