
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';

interface SystemFormProps {
  initialData?: SystemType;
  onSuccess: () => void;
}

const SystemForm: React.FC<SystemFormProps> = ({ initialData, onSuccess }) => {
  const { addSystem, updateSystem, currentHouse } = useSystem();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'solar',
    installDate: initialData?.installDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    specifications: initialData?.specifications || {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse) return;

    const systemData = {
      ...formData,
      houseId: currentHouse.id,
      installDate: new Date(formData.installDate),
      isActive: true,
    };

    if (isEditing && initialData) {
      updateSystem(initialData.id, systemData);
    } else {
      addSystem(systemData as Omit<SystemType, 'id'>);
    }

    onSuccess();
  };

  const updateSpecification = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const renderSpecificationFields = () => {
    switch (formData.type) {
      case 'solar':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">System Capacity (kW)</Label>
                <Input
                  id="capacity"
                  type="number"
                  step="0.1"
                  value={formData.specifications.capacity || ''}
                  onChange={(e) => updateSpecification('capacity', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="panelCount">Number of Panels</Label>
                <Input
                  id="panelCount"
                  type="number"
                  value={formData.specifications.panelCount || ''}
                  onChange={(e) => updateSpecification('panelCount', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="efficiency">Panel Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  value={formData.specifications.efficiency || ''}
                  onChange={(e) => updateSpecification('efficiency', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="orientation">Orientation</Label>
                <Select 
                  value={formData.specifications.orientation || 'south'} 
                  onValueChange={(value) => updateSpecification('orientation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="southeast">South East</SelectItem>
                    <SelectItem value="southwest">South West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="tilt">Roof Tilt (degrees)</Label>
              <Input
                id="tilt"
                type="number"
                value={formData.specifications.tilt || ''}
                onChange={(e) => updateSpecification('tilt', parseInt(e.target.value))}
              />
            </div>
          </>
        );

      case 'battery':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Battery Capacity (kWh)</Label>
                <Input
                  id="capacity"
                  type="number"
                  step="0.1"
                  value={formData.specifications.capacity || ''}
                  onChange={(e) => updateSpecification('capacity', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="efficiency">Round-trip Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  value={formData.specifications.efficiency || ''}
                  onChange={(e) => updateSpecification('efficiency', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.specifications.brand || ''}
                  onChange={(e) => updateSpecification('brand', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.specifications.model || ''}
                  onChange={(e) => updateSpecification('model', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'ev':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.specifications.make || ''}
                  onChange={(e) => updateSpecification('make', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.specifications.model || ''}
                  onChange={(e) => updateSpecification('model', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                <Input
                  id="batteryCapacity"
                  type="number"
                  step="0.1"
                  value={formData.specifications.batteryCapacity || ''}
                  onChange={(e) => updateSpecification('batteryCapacity', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="efficiency">Efficiency (miles/kWh)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.1"
                  value={formData.specifications.efficiency || ''}
                  onChange={(e) => updateSpecification('efficiency', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="annualMileage">Annual Mileage</Label>
              <Input
                id="annualMileage"
                type="number"
                value={formData.specifications.annualMileage || ''}
                onChange={(e) => updateSpecification('annualMileage', parseInt(e.target.value))}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">System Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Roof Solar Array, Tesla Powerwall"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">System Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value, specifications: {} }))}
          disabled={isEditing}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solar">Solar Panels</SelectItem>
            <SelectItem value="battery">Battery Storage</SelectItem>
            <SelectItem value="ev">Electric Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="installDate">Installation Date</Label>
        <Input
          id="installDate"
          type="date"
          value={formData.installDate}
          onChange={(e) => setFormData(prev => ({ ...prev, installDate: e.target.value }))}
          required
        />
      </div>

      {renderSpecificationFields()}

      <Button type="submit" className="w-full">
        {isEditing ? 'Update System' : 'Add System'}
      </Button>
    </form>
  );
};

export default SystemForm;
